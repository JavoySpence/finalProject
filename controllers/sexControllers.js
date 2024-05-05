import { pool } from '../database/dbConnection.js';


export const getAllSex = async (req, res, next) => {
    try {
        const [sex] = await pool.query('SELECT * FROM sex');
        res.status(200).json({
            status:'success',
            results: sex.length,
            data: { sex },
        });
    } catch (error) {
        console.error('Error fetching sex:', error);
    }
}