import { pool } from '../database/dbConnection.js';


export const getAllTime = async (req, res, next) => {
    try {
        const [time] = await pool.query('SELECT * FROM time');
        res.status(200).json({
            status: 'success',
            results: time.length,
            data: { time },
        });
        
    } catch (error) {
        console.error('Error fetching time data:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching time data',
        });
    }
};
