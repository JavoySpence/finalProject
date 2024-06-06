import { pool } from '../database/dbConnection.js';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

// Function to sign JWT tokens
function signJWTToken(user) {
    const token = JWT.sign({
        id: user.id,
        email: user.email,
        role: user.role,
    }, process.env.JWT_SECRET, { 
        expiresIn: process.env.JWT_EXPIRES_IN 
    });
    console.log('Issued JWT:', token);
    return token;
}

// Function to check if a user exists by email
async function userExists(email) {
    const sqlQuery = `SELECT * FROM users_login WHERE email = ?`;
    try {
        const [user] = await pool.query(sqlQuery, [email]);
        return user.length > 0;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}
// Middleware to protect routes
export const protect = async (req, res, next) => {
    const authorization = req.get('authorization');
    
    if (!authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid token format'
        });
    }

    const token = authorization.split(' ')[1];

    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        console.log('DECODED >>', decoded);
        
        const strQuery = `SELECT * FROM users_login WHERE id = ?`;
        const [rows] = await pool.query(strQuery, [decoded.id]);
        console.log(`ROWS >> ${JSON.stringify(rows)}`);
        
        if (!rows[0]) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const user = rows[0];
        user.password = undefined;
        req.user = user;
        next();
    } catch (e) {
        console.error('Error fetching user from database:', e);
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};

// Controller to create an admin user
export const createAdminUser = async (req, res) => {
    const { email, password, first_name, last_name, role } = req.body;

    if (await userExists(email)) {
        return res.status(400).json({
            status: 'error',
            message: 'User already exists'
        });
    }

    const pwd = bcrypt.hashSync(password, 12);
    const sqlQuery = `
        INSERT INTO users_login (email, password, first_name, last_name, role)
        VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sqlQuery, [email, pwd, first_name, last_name, role]);

    if (result.affectedRows > 0) {
        return res.status(200).json({
            success: true,
            insertedID: result.insertId
        });
    } else {
        return res.status(400).json({
            status: 'error',
            message: 'Error creating user'
        });
    }
};

// Controller to register a new user
export const registerUser = async (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    if (await userExists(email)) {
        return res.status(400).json({
            status: 'error',
            message: 'User already exists'
        });
    }

    const pwd = bcrypt.hashSync(password, 12);
    const sqlQuery = `
        INSERT INTO users_login (email, password, first_name, last_name)
        VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.query(sqlQuery, [email, pwd, first_name, last_name]);

    if (result.affectedRows > 0) {
        const token = signJWTToken({ id: result.insertId, email: email, role: "STUDENT" });
        const data = req.body;
        data.password = undefined;

        return res.status(200).json({
            status: "success",
            data: {
                token: token,
                data: data
            }
        });
    } else {
        return res.status(400).json({
            status: 'error',
            message: 'Error creating user'
        });
    }
};

// Controller to login a user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    let sqlQuery = `SELECT * FROM users_login WHERE email = ?`;
    const [result] = await pool.query(sqlQuery, [email]);
    console.log(JSON.stringify(result))
    if (!result.length ) {
        return res.status(404).json({
            status: 'error',
            message: 'User not found'
        });
    } 

    if (!(await bcrypt.compare(password, result[0].password))) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid credentials'
        });
    }
    
    const token = signJWTToken({ id: result[0].id, email: email, role: result[0].role });
    result[0].password = undefined;
    return res.status(200).json({
        status: 'success',
        data: {
            token: token,
            user: result[0]
        }
    });
};

// Controller to get the current user
export const getThisUser = async (req, res) => {
    const data = req.user;
    if (!data) return next();
    data.password = undefined;
    let strQuery = `SELECT * FROM users_login WHERE id = ?`;
    const [user] = await pool.query(strQuery, [data.id]);
    if (!user.length) {
        return res.status(404).json({
            status: 'error',
            message: 'Invalid Request'
        });
    }

    user[0].password = undefined;
    return res.status(200).json({
        status: 'success',
        data: {
            user: user[0]
        }
    });
};
