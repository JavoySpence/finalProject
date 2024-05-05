import { pool } from '../database/dbConnection.js';

export const getNamedFeedbacks = async (req, res, next) => {
  try {
    const [feedback] = await pool.query('SELECT * FROM named_feedback');
    res.status(200).json({
      status:'success',
      results: feedback.length,
      data: { feedback },
    });
  } catch (error) {
    console.error('Error fetching time data:', error);
    res.status(500).json({
        status: 'error',
        message: 'Error fetching time data',
    });
  }
}