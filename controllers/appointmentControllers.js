import { pool } from '../database/dbConnection.js';


export const getAllAppointments = async (req, res, next) => {
    try {
        // Define the query with a subquery to retrieve the corresponding `id` from `users` based on `first_name` and `last_name`
        const query = `
            SELECT * FROM appointment a;
        `;

        
        const [appointments] = await pool.query(query);

    
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
        const [appointment] = await pool.query(`SELECT * FROM appointment WHERE id = ?`, [id]);

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
            phone,
            appointment_date,
        } = req.body;

        const dobConverted = new Date(DOB).toISOString().slice(0, 19).replace('T', ' ');
        const appointmentDateConverted = new Date(appointment_date).toISOString().slice(0, 19).replace('T', ' ');

        const sqlQuery = `
            UPDATE appointment
            SET first_name = ?, last_name = ?, sex = ?, DOB = ?, title = ?, reason_for_visit = ?, doctor_name = ?, phone = ?, appointment_date = ?
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
            appointmentDateConverted,
            id,
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
                appointment_date: appointmentDateConverted,
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
            appointment_date,
            title,
            reason_for_visit,
            doctor_name,
            phone,
            medical_history,
            medications_taken,
        } = req.body;

        const dobConverted = new Date(DOB).toISOString().slice(0, 19).replace('T', ' ');
        const appointmentDateConverted = new Date(appointment_date).toISOString().slice(0, 19).replace('T', ' ');

        const [user] = await pool.query(
            'SELECT id FROM users WHERE first_name = ? AND last_name = ? LIMIT 1',
            [first_name, last_name]
        );

        if (user.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Only users can make appointments. Please sign up.',
            });
        }

        const userId = user[0].id;

        const sqlQuery = `
            INSERT INTO appointment (user_id, first_name, last_name, sex, DOB, appointment_date, title, reason_for_visit, doctor_name, phone, medical_history, medications_taken)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.query(sqlQuery, [
            userId,
            first_name,
            last_name,
            sex,
            dobConverted,
            appointmentDateConverted,
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
                appointment_date: appointmentDateConverted,
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
