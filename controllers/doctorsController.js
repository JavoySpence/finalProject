import { pool } from '../database/dbConnection.js';

export const getAllDoctors = async (req, res, next) => {
    try {
        const [doctors] = await pool.query('SELECT * FROM doctors');
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


export const createDoctor = async (req, res, next) => {
    try {
        const newEntry = new Object();
        newEntry.first_name = req.body.first_name;
        newEntry.last_name = req.body.last_name;
        newEntry.speciality = req.body.speciality;
        newEntry.image = req.body.image;

        const [result] = await pool.query(
            'INSERT INTO doctors (first_name, last_name, speciality, image) VALUES (?, ?, ?, ?)',
            [newEntry.first_name, newEntry.last_name, newEntry.speciality, newEntry.image]
        );

        res.status(201).json({
            status: 'success',
            message: 'Doctor created successfully',
            data: {
                doctor_id: result.insertId,
                first_name: newEntry.first_name,
                last_name: newEntry.last_name,
                specialty: newEntry.specialty,
                image: newEntry.image
            }
        });
    } catch (error) {
        console.error('Error creating doctor:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while creating the doctor',
        });
    }
};



