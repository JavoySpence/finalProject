import { pool } from '../database/dbConnection.js';
import path from 'path';
import express from 'express'
import fs from 'fs';
import fileUpload from 'express-fileupload';
import { getRandomHexValues } from '../utils.js';
// import { doctorsRouter } from '../routes/doctorsRoutes.js';



const doctorsRouter = express.Router();

doctorsRouter.use(fileUpload());




export const getAllDoctors = async (req, res, next) => {
    try {
         
        const query = `
     SELECT * FROM doctors ;
        `;

        const [doctors] = await pool.query(query);

        res.status(200).json({
            status: 'success',
            results: doctors.length,
            data: { doctors },
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching doctors',
            error: error.message,
        });
    }
};

export const createDoctor = async (req, res) => {
    try {
        const { first_name, last_name, speciality } = req.body;

        // Validate required fields
        if (!first_name || !last_name || !speciality) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Create new doctor entry
        const newEntry = {
            first_name,
            last_name,
            speciality,
            image: '',
        };

        // Handle image upload
        if (req.files && req.files.image) {
            const uploadedFile = req.files.image;
            const fileName = `${getRandomHexValues(8)}_${uploadedFile.name}`;
            const uploadPath = path.join(__dirname, 'uploads', fileName);

            // Create the uploads directory if it doesn't exist
            if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
                fs.mkdirSync(path.join(__dirname, 'uploads'));
            }

            // Move the uploaded file to the designated path
            await uploadedFile.mv(uploadPath);
            newEntry.image = fileName;
        } else {
            newEntry.image = 'default-avatar.png';
        }

        // Insert the new doctor entry into the database
        const sqlQuery = `
            INSERT INTO doctors (first_name, last_name, speciality, image)
            VALUES (?, ?, ?, ?);
        `;
        const queryParams = [newEntry.first_name, newEntry.last_name, newEntry.speciality, newEntry.image];
        
        const [result] = await pool.query(sqlQuery, queryParams);

        // Return a success response with information about the newly created doctor
        res.status(201).json({
            success: true,
            message: 'Doctor created successfully',
            data: {
                doctorId: result.insertId,
                ...newEntry,
            },
        });
    } catch (error) {
        console.error('Error in createDoctor:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};
export const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const sqlQuery = `
            DELETE FROM doctors
            WHERE id = ?;
        `;
        const [result] = await pool.query(sqlQuery, [id]);

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Doctor deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Doctor not found' });
        }
    } catch (error) {
        console.error('Error in deleteDoctor:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export const getSingleDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const sqlQuery = `
            SELECT * FROM doctors
            WHERE id = ?;
        `;
        const [doctorRows] = await pool.query(sqlQuery, [id]);

        if (doctorRows.length > 0) {
            const doctor = doctorRows[0];
            res.status(200).json({
                success: true,
                message: 'Doctor found successfully.',
                data: doctor
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Doctor not found.'
            });
        }
    } catch (error) {
        console.error('Error retrieving doctor:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving the doctor.',
            error: error.message
        });
    }
};


export const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, speciality } = req.body;

        let newEntry = {
            first_name,
            last_name,
            speciality
        };

        if (req.files && req.files.image) {
            const uploadedFile = req.files.image;
            const fileName = `${getRandomHexValues(8)}_${uploadedFile.name}`;
            const uploadPath = path.join(__dirname, 'uploads', fileName);
            if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
                fs.mkdirSync(path.join(__dirname, 'uploads'));
            }
            await uploadedFile.mv(uploadPath);
            newEntry.image = fileName;
        }

        let sqlQuery;
        let queryParams;

        if (newEntry.image) {
            sqlQuery = `
                UPDATE doctors
                SET first_name = ?, last_name = ?, speciality = ?, image = ?
                WHERE id = ?;
            `;
            queryParams = [newEntry.first_name, newEntry.last_name, newEntry.speciality, newEntry.image, id];
        } else {
            sqlQuery = `
                UPDATE doctors
                SET first_name = ?, last_name = ?, speciality = ?
                WHERE id = ?;
            `;
            queryParams = [newEntry.first_name, newEntry.last_name, newEntry.speciality, id];
        }

        const [result] = await pool.query(sqlQuery, queryParams);

        if (result.affectedRows > 0) {
            res.status(200).json({
                success: true,
                message: 'Doctor information updated successfully.',
                data: newEntry
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Doctor not found.'
            });
        }
    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the doctor.',
            error: error.message
        });
    }
};


