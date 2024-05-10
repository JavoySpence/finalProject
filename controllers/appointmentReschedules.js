import { pool } from '../database/dbConnection.js';

export const getAllRescheduless = async (req, res, next) => {
    try {
        const [users] = await pool.query('SELECT * FROM appointment_reschedule');
        res.status(200).json({
            status:'success',
            results: users.length,
            data: { users },
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            status: 'error',
        });
    }
}


// export const deleteSpeciality = async (req, res, next) => {
//     try {
//         const { speciality_id } = req.params;
//         const [result] = await pool.query('DELETE FROM specialities WHERE speciality_id = ?', [speciality_id]);

//         if (result.affectedRows > 0) {
//             res.status(200).json({
//                 status: 'success',
//                 message: 'Speciality deleted successfully',
//             });
//         } else {
//             res.status(404).json({
//                 status: 'not found',
//                 message: 'Speciality not found',
//             });
//         }
//     } catch (error) {
//         console.error('Error deleting speciality:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'An error occurred while deleting the speciality',
//         });
//     }
// }


// export const createSpeciality = async (req, res, next) => {
//     try {
//         const { speciality_name } = req.body;
//         const [result] = await pool.query('INSERT INTO specialities (speciality_name) VALUES (?)', [speciality_name]);

//         res.status(201).json({
//             status: 'success',
//             message: 'Speciality created successfully',
//             data: {
//                 id: result.insertId,
//                 speciality_name,
//             },
//         });
//     } catch (error) {
//         console.error('Error creating speciality:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Failed to create speciality',
//             error: error.message,
//         });
//     }
// };
