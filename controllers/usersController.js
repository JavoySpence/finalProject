import { pool } from '../database/dbConnection.js';
import bcrypt from 'bcrypt';
const saltRounds = 10;


export const getAllUsers = async (req, res, next) => {
    try {
        const [users] = await pool.query('SELECT * FROM users');
        res.status(200).json({
            status:'success',
            results: users.length,
            data: { users },
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            status: 'error',
        });
    }
}


export const getSingleUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [user] = await pool.query('SELECT * FROM users WHERE id =?', [id]);
        res.status(200).json({
            status:'success',
            results: user.length,
            data: { user },
        });
    } catch (error) {
        console.error('Error fetching user by id:', error);
        res.status(500).json({
            status: 'error',
        });
    }
}


export const createUser = async (req, res, next) => {
    try {
        const newEntry = new Object();
        newEntry.first_name = req.body.first_name;
        newEntry.last_name = req.body.last_name;
        newEntry.password = req.body.password;

        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(newEntry.password, salt);
        newEntry.password = hashedPassword;

        const [result] = await pool.query(
            `INSERT INTO users (first_name, last_name, password) VALUES (?, ?, ?)`,
            [newEntry.first_name, newEntry.last_name, newEntry.password]
        );

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: {
                user_id: result.insertId,
                first_name: newEntry.first_name,
                last_name: newEntry.last_name,
            },
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while creating the user',
        });
    }
};


export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [user] = await pool.query('DELETE FROM users WHERE id =?', [id]);
        res.status(200).json({
            status:'success',
            results: user.length,
            data: { user },
        });
    } catch (error) {
        console.error('Error fetching user by id:', error);
        res.status(500).json({
            status: 'error',
        });
    }
}

