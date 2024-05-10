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

    // Check if password is provided and not empty
    if (!data.password || typeof data.password !== 'string') {
        return res.status(400).json({
            status: 'error',
            message: 'Password is required and must be a non-empty string'
        });
    }

    // Hash the password with salt rounds
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
            data.last_name,
            data.age,
            vRole,
            vDate,
            vStatus
        ]);

        
        if (result.insertId > 0) {
            
            const token = signJWTToken({
                id: result.insertId,
                role: vRole,
                firstName: data.first_name,
                lastName: data.last_name
            });

            // Respond with success status
            res.status(201).json({
                status: 'success',
                data: {
                    token,
                    user: {
                        id: result.insertId,
                        email: data.email,
                        first_name: data.first_name,
                        last_name: data.last_name,
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

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            message: 'You must be logged in to access this feature.'
        });
    }

    const token = authorization.split(' ')[1];
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    const [rows] = await conn.query("SELECT * FROM users WHERE id = ? AND status = 'ACTV'", [decoded.id]);
    const user = rows[0];

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
