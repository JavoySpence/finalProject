import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import { pool } from '../database/dbConnection.js';

const conn = pool;

function signJWTToken(user) {
    return JWT.sign({
        id: user.id,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

export const registerUser = async (req, res, next) => {
    const sqlQuery = `
        INSERT INTO users (email, password, first_name, last_name, age, role, last_login, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const data = req.body;
    const vRole = 'USER';
    const vStatus = 'ACTV';
    const vDate = new Date();
    const saltRounds = 10;

    if (!data.password || typeof data.password !== 'string' || !data.first_name) {
        return res.status(400).json({
            status: 'error',
            message: 'Password and first name are required and must be non-empty strings'
        });
    }

    try {
        data.password = bcrypt.hashSync(data.password, saltRounds);
    } catch (error) {
        console.error('Error hashing password:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error hashing password'
        });
    }

    try {
        
        const [result] = await conn.query(sqlQuery, [
            data.email,
            data.password,
            data.first_name,
            data.last_name || null, // Handle the case when last_name is not provided
            data.age || null, // Handle the case when age is not provided
            vRole,
            vDate,
            vStatus
        ]);

        if (result.insertId > 0) {
            const token = signJWTToken({
                id: result.insertId,
                role: vRole,
                firstName: data.first_name,
                lastName: data.last_name || null // Handle the case when last_name is not provided
            });

            res.status(201).json({
                status: 'success',
                data: {
                    token,
                    user: {
                        id: result.insertId,
                        email: data.email,
                        first_name: data.first_name,
                        last_name: data.last_name || null, // Handle the case when last_name is not provided
                        role: vRole
                    }
                }
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Error creating user'
            });
        }
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred during registration'
        });
    }
};


export const loginUser = async (req, res) => {
    const data = req.body;

    try {
        const [rows] = await conn.query("SELECT * FROM users WHERE email = ?", [data.email]);
        const user = rows[0];

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        if (user.status !== 'ACTV') {
            return res.status(403).json({
                status: 'error',
                message: 'User is not active'
            });
        }

        const passwordMatch = await bcrypt.compare(data.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        await conn.query("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?", [user.id]);

        const token = signJWTToken(user);
        user.password = undefined;

        res.status(200).json({
            status: 'success',
            data: {
                token,
                user
            }
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};



export const protect = async (req, res, next) => {
    const authorization = req.get('Authorization');
    console.log(`AUTHORIZATION >>${authorization}`);
    if (!authorization || !authorization.startsWith('Bearer')) {
        return res.status(401).json({
            status: 'error',
            message: 'You must be logged in to access this feature.'
        });
    }

    const token = authorization.split(' ')[1];
    console.log(`JWT_SECRET >>${process.env.JWT_SECRET}`)
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    console.log(`DECODED >>${JSON.stringify(decoded)}`);

    const [rows] = await conn.query("SELECT * FROM users WHERE id = ? AND status = 'ACTV'", [decoded.id]);
    const user = rows[0];
    console.log(`ROWS[0] >>${JSON.stringify(rows[0])}`);
    console.log(`USER >>${JSON.stringify(user)}`);
    if (!user) {
        return res.status(404).json({
            status: 'error',
            message: 'Token is invalid or user not found.'
        });
    }

    user.password = undefined;
    req.user = user;
    next();
};

export const getThisUser = async (req, res, next)=>{
    console.log(`inside getThisUser()`)
   const data = req.user;
   console.log(`DATA FRom req.user >> ${JSON.stringify(data)}`);
   if(!data) return next();
   const [user] = await conn.query(`SELECT * FROM users WHERE id = ?`, [data.id]);
   console.log(`[User] >> ${JSON.stringify(user)}`);
   if(!user) {
    return res.status(404).json({
        status: 'error',
        message: 'User not found'
    });
   }
   user.password = undefined;
   res.status(200).json({
    status:'success',
    data: {
        user: user
    }
   });
};


// export const getAllUsers = async (req, res, next) => {
//     try {
//         const [users] = await pool.query('SELECT * FROM users');
//         res.status(200).json({
//             status:'success',
//             results: users.length,
//             data: { users },
//         });
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         res.status(500).json({
//             status: 'error',
//         });
//     }
// }
