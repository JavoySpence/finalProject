import { pool } from '../database/dbConnection.js';

export const getAllRescheduless = async (req, res, next) => {
    try {
        const [appointments] = await pool.query('SELECT * FROM appointment_reschedule');
        res.status(200).json({
            status: 'success',
            results: appointments.length,
            data: { appointments },
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({
            status: 'error',
        });
    }
}

export const deleteReschedule = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM appointment_reschedule WHERE id = ?', [id]);

        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 'success',
                message: 'Appointment reschedule deleted successfully',
            });
        } else {
            res.status(404).json({
                status: 'not found',
                message: 'Appointment reschedule not found',
            });
        }
    } catch (error) {
        console.error('Error deleting appointment reschedule:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while deleting the appointment reschedule',
        });
    }
}

export const createReschedule = async (req, res, next) => {
    const { first_name, last_name, phone, email, original_time, new_time, reason_for_rescheduling } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO appointment_reschedule (first_name, last_name, phone, email, original_time, new_time, reason_for_rescheduling) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, phone, email, original_time, new_time, reason_for_rescheduling]
        );

        res.status(201).json({
            status: 'success',
            data: {
                id: result.insertId,
                first_name,
                last_name,
                phone,
                email,
                original_time,
                new_time,
                reason_for_rescheduling
            }
        });
    } catch (error) {
        console.error('Error creating reschedule:', error);
        res.status(500).json({
            status: 'error',
        });
    }
};