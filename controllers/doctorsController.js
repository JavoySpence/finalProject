import { pool } from '../database/dbConnection.js';
import path from 'path';
import express from 'express'
import fs from 'fs';
import fileUpload from 'express-fileupload';
import { getRandomHexValues } from '../utils.js';
// import { doctorsRouter } from '../routes/doctorsRoutes.js';



const doctorsRouter = express.Router();

doctorsRouter.use(fileUpload());



// export const getAllDoctors = async (req, res, next) => {
//     try {
//         const [doctors] = await pool.query('SELECT * FROM doctors');
//         res.status(200).json({
//             status:'success',
//             results: doctors.length,
//             data: { doctors },
//         });
//     } catch (error) {
//         console.error('Error fetching doctors:', error);
//         res.status(500).json({
//             status: 'error',
//         });
//     }
// }
export const getAllDoctors = async (req, res, next) => {
    try {
         
        const query = `
        SELECT
        d.id,
        d.first_name,
        d.last_name,
        d.speciality,
        d.image,
        (
            SELECT s.id
            FROM specialities s
            WHERE s.speciality_name = d.speciality
            LIMIT 1 -- Ensures the query returns only one id from specialities
        ) AS speciality_id_from_specialities_table
    FROM
        doctors d;
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
        
        if (!first_name || !last_name || !speciality) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const newEntry = new Object();
        newEntry.first_name = req.body.first_name;
        newEntry.last_name = req.body.last_name;
        newEntry.speciality = req.body.speciality;
        newEntry.image = '';

        if (req.files && req.files.image) {
            const uploadedFile = req.files.image;
            const fileName = `${getRandomHexValues(8)}_${uploadedFile.name}`;
            const uploadPath = path.join(__dirname, 'uploads', fileName);

            if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
                fs.mkdirSync(path.join(__dirname, 'uploads'));
            }

            await uploadedFile.mv(uploadPath);
            newEntry.image = fileName;
        } else {
            newEntry.image = 'default-avatar.png';
        }

        const sqlQuery = `
            INSERT INTO doctors (first_name, last_name, speciality, image)
            VALUES (?, ?, ?, ?);
        `;
        const queryParams = [newEntry.first_name, newEntry.last_name, newEntry.speciality, newEntry.image];
        
        await pool.query(sqlQuery, queryParams);

        res.redirect('/api/v1/doctors');
    } catch (error) {
        console.error('Error in createDoctor:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
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


