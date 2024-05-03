import { pool } from '../database/dbConnection.js';

export const getAllDoctors = async (req, res, next) => {
    try {
        const [doctors] = await pool.query('SELECT * FROM doctor');
        res.status(200).json({
            status:'success',
            results: doctors.length,
            data: { doctors },
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({
            status: 'error',
        });
    }
}

