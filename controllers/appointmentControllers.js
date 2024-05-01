import { pool } from '../database/dbConnection.js';


export const getAllAppointments = async (req, res, next) => {
    try {
        const [appointments] = await pool.query('SELECT * FROM appointment');
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


export const getSingleAppointment = async(req, res, next) => {
    try {
        const { id } = req.params;
        const [appointment] = await pool.query('SELECT * FROM appointment WHERE id = ?', [id]);
        res.status(200).json({
            status:'success',
            results: appointment.length,
            data: { appointment: appointment[0] },
        });
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching appointment',
        });
    }
}



export const updateAppointment = async (req, res, next) => {
    const appointmentData = {
        id: req.params.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        sex: req.body.sex,
        DOB: req.body.DOB,
        title: req.body.title,
        reason_for_visit: req.body.reason_for_visit,
        user_id: req.body.user_id,
    };

    console.log('Received id:', appointmentData.id);

    const dobConverted = new Date(appointmentData.DOB).toISOString().slice(0, 19).replace('T', ' ');

    const sqlQuery = `
        UPDATE appointment
        SET first_name = ?, last_name = ?, sex = ?, DOB = ?, title = ?, reason_for_visit = ?, user_id = ?
        WHERE id = ?
    `;

    try {
        await pool.query(sqlQuery, [
            appointmentData.first_name,
            appointmentData.last_name,
            appointmentData.sex,
            dobConverted,
            appointmentData.title,
            appointmentData.reason_for_visit,
            appointmentData.user_id,
            appointmentData.id,
        ]);

        res.status(200).json({
            status: 'success',
            message: 'Appointment updated successfully',
            data: { appointmentData: appointmentData },
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
        reason_for_visit: req.body.reason_for_visit,
        user_id: req.body.user_id,
    };

    const dobConverted = new Date(appointmentData.DOB).toISOString().slice(0, 19).replace('T', ' ');

    const sqlQuery = `
        INSERT INTO appointment (first_name, last_name, sex, DOB, title, reason_for_visit, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const result = await pool.query(sqlQuery, [
            appointmentData.first_name,
            appointmentData.last_name,
            appointmentData.sex,
            dobConverted,
            appointmentData.title,
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



export const getAllAppointmentsJoin = async (req, res, next) => {
    try {
        const [appointments] = await pool.query(`
            SELECT *, users.first_name AS user_first_name, users.last_name AS user_last_name
            FROM appointment
            JOIN users ON appointment.user_id = users.id
        `);

        res.status(200).json({
            status: 'success',
            results: appointments.length,
            data: { appointments },
        });
    } catch (error) {
        console.error('Error fetching appointments with join:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching appointments with join',
        });
    }
}






export const deleteAppointment = async(req, res, next) => {
    try {
        const { id } = req.params;
        const [appointment] = await pool.query('DELETE FROM appointment WHERE id = ?', [id]);
        res.status(200).json({
            status:'success',
            results: appointment.length,
            data: { appointment: appointment[0] },
        });
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching appointment',
        });
    }
}