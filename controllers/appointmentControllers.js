import { pool } from '../database/dbConnection.js';


export const getAllAppointments = async (req, res, next) => {
    try {
        
        const [appointments] = await pool.query(`
        SELECT
        a.first_name,
        a.last_name,
        a.sex,
        a.DOB,
        a.title,
        a.reason_for_visit,
        a.phone,
        a.doctor_name,
       
        (
            SELECT u.id
            FROM users u
            WHERE u.first_name = a.first_name
            AND u.last_name = a.last_name
            LIMIT 1 -- Ensures the query returns only one id from users
        ) AS user_id_from_users_table
    FROM
        appointment a;
    
    
        `);

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
        const [appointment] = await pool.query('SELECT * FROM appointment WHERE id = ?', [id]);

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
    const appointmentData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        sex: req.body.sex,
        DOB: req.body.DOB,
        title: req.body.title,
        phone: req.body.phone,
        doctor_name: req.body.doctor_name,
        reason_for_visit: req.body.reason_for_visit,
        // user_id: req.body.user_id,
    };

    const dobConverted = new Date(appointmentData.DOB).toISOString().slice(0, 19).replace('T', ' ');

    const sqlQuery = `
    INSERT INTO appointment (first_name, last_name, sex, DOB, title, phone, doctor_name, reason_for_visit)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    
    `;

    try {
        const result = await pool.query(sqlQuery, [
            appointmentData.first_name,
            appointmentData.last_name,
            appointmentData.sex,
            dobConverted,
            appointmentData.title,
            appointmentData.phone,
            appointmentData.doctor_name,
            appointmentData.reason_for_visit,
            appointmentData.user_id,
        ]);

        res.status(201).json({
            status: 'success',
            message: 'Appointment created successfully',
            data: {
                appointmentId: result.insertId,
                appointmentData: {
                    ...appointmentData,
                    id: result.insertId,
                    DOB: dobConverted,
                },
            },
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while creating the appointment',
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
