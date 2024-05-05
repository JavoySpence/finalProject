import { pool } from '../database/dbConnection.js';

export const getAnnonymousFeedbacks = async (req, res, next) => {
    try {
        const [time] = await pool.query('SELECT * FROM annonymous_feedback');
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


export const deleteAnnonymousFeedbacks = async (req, res, next) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM annonymous_feedback WHERE id =?', [id]);
        res.status(200).json({
            status:'success',
            message: 'Annonymous feedback deleted successfully',
        });

    } catch (error) {
        console.error('Error deleting annonymous feedback:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while deleting annonymous feedback',
        });
    }
}


export const createAnnonymousFeedbacks = async (req, res, next) => {
    try {
        const { feedback } = req.body;
        await pool.query('INSERT INTO annonymous_feedback (feedback) VALUES (?)', [feedback]);
        res.status(201).json({
            status:'success',
            message: 'Annonymous feedback created successfully',
            data: { feedback },
        });
        
    } catch (error) {
        console.error('Error creating annonymous feedback:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while creating annonymous feedback',
           
        });
    }
}