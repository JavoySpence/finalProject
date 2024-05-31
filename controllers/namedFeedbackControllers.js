
import { pool } from '../database/dbConnection.js';

export const getNamedFeedbacks = async (req, res, next) => {
  try {
    const [feedbacks] = await pool.query('SELECT * FROM named_feedback');
    res.status(200).json({
      status:'success',
      results: feedbacks.length,
      data: { feedbacks },
    });

  } catch (error) {
    console.error('Error fetching time data:', error);
    res.status(500).json({
        status: 'error',
        message: 'Error fetching time data',
    });
  }
};


export const getSingleFeedbacks = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [feedbacks] = await pool.query('SELECT * FROM named_feedback WHERE id = ?', [id]);
    res.status(200).json({
      status:'success',
      results: feedbacks.length,
      data: { feedbacks },
    });

  } catch (error) {
    console.error('Error fetching single feedback data:', error);
    res.status(500).json({
        status: 'error',
        message: 'Error fetching singler feedback data',
    });
  }
};


export const deleteFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM named_feedback WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No feedback found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Feedback successfully deleted',
    });

  } catch (error) {
    console.error('Error deleting feedback data:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting feedback data',
    });
  }
};


export const createFeedback = async (req, res, next) => {
  try {
      const { first_name, last_name, feedback } = req.body;

      if (!first_name || !last_name || !feedback) {
          return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const [result] = await pool.query(
          `INSERT INTO named_feedback (first_name, last_name, feedback) VALUES (?, ?, ?);`,
          [first_name, last_name, feedback]
      );

      res.status(201).json({
          success: true,
          message: 'Feedback created successfully',
          data: {
              feedbackId: result.insertId,
              first_name,
              last_name,
              feedback,
          },
      });
  } catch (error) {
      console.error('Error in createFeedback:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};
