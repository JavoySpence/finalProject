import { pool } from '../database/dbConnection.js';


export const getAllAppointments = async (req, res, next) => {
    try {
        // Define the query with a subquery to retrieve the corresponding `id` from `users` based on `first_name` and `last_name`
        const query = `
            SELECT * FROM appointment a;
        `;

        // Execute the query
        const [appointments] = await pool.query(query);

        // Respond with the appointments data
        res.status(200).json({
            status: 'success',
            results: appointments.length,
            data: { appointments },
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching appointments',
        });
    }
};




export const getSingleAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [appointment] = await pool.query(`SELECT * FROM appointment WHERE  = ?`, [id]);

        if (appointment.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Appointment not found with the specified ID',
            });
        }

        res.status(200).json({
            status: 'success',
            results: 1,
            data: { appointment: appointment[0] },
        });

       } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching the appointment',
        });
    }
};



export const updateAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            first_name,
            last_name,
            sex,
            DOB,
            title,
            reason_for_visit,
            doctor_name,
            phone
        } = req.body;

        const dobConverted = new Date(DOB).toISOString().slice(0, 19).replace('T', ' ');

        const sqlQuery = `
            UPDATE appointment
            SET first_name = ?, last_name = ?, sex = ?, DOB = ?, title = ?, reason_for_visit = ?, doctor_name = ?, phone = ?
            WHERE id = ?
        `;

        const updateResult = await pool.query(sqlQuery, [
            first_name,
            last_name,
            sex,
            dobConverted,
            title,
            reason_for_visit,
            doctor_name,
            phone,
            id // Correctly passing the ID parameter
        ]);

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No appointment found with the given id',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Appointment updated successfully',
            data: {
                id,
                first_name,
                last_name,
                sex,
                DOB: dobConverted,
                title,
                reason_for_visit,
                doctor_name,
                phone,
            },
        });
        } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while updating the appointment',
        });
       }
};

export const createAppointment = async (req, res, next) => {
    try {
        const {
            first_name,
            last_name,
            sex,
            DOB,
            title,
            reason_for_visit,
            doctor_name,
            phone,
            medical_history,
            medications_taken,
        } = req.body;

        const dobConverted = new Date(DOB).toISOString().slice(0, 19).replace('T', ' ');

        const [user] = await pool.query(
            'SELECT id FROM users WHERE first_name = ? AND last_name = ? LIMIT 1',
            [first_name, last_name]
        );

        if (user.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
        }

        const userId = user[0].id;

        const sqlQuery = `
            INSERT INTO appointment (id, first_name, last_name, sex, DOB, title, reason_for_visit, doctor_name, phone, medical_history, medications_taken)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.query(sqlQuery, [
            userId,
            first_name,
            last_name,
            sex,
            dobConverted,
            title,
            reason_for_visit,
            doctor_name,
            phone,
            medical_history || 'None',
            medications_taken || 'None',
        ]);

        res.status(201).json({
            status: 'success',
            message: 'Appointment created successfully',
            data: {
                appointmentId: result.insertId,
                first_name,
                last_name,
                sex,
                DOB: dobConverted,
                title,
                reason_for_visit,
                doctor_name,
                phone,
                medical_history,
                medications_taken,
            },
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while creating the appointment',
            error: error.message,
        });
    }
};



export const deleteAppointment = async (req, res, next) => {
    try {
        const { user_id } = req.params;

        const [result] = await pool.query(
            `DELETE FROM appointment WHERE user_id = ?`, [user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No appointments found for the specified user_id',
            });
        }

        res.status(200).json({
            status: 'success',
            message: `Successfully deleted ${result.affectedRows} appointment(s) for user_id ${user_id}`,
        });
    } catch (error) {
        console.error('Error deleting appointments:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while deleting appointments',
        });
    }
};
