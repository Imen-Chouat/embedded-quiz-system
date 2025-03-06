
import mysql from 'mysql2';
import pool from '../config/dbConfig.js';
import bcryptjs from 'bcryptjs';

class Student {
    static async create(first_name, last_name, email, password, group_id = null) {
        try {
            const [row] = await pool.execute(
                `INSERT INTO students (first_name, last_name, email, password, group_id) VALUES (?, ?, ?, ?, ?)`,
                [first_name, last_name, email, password, group_id]
            );
            return row.insertId;
        } catch (error) {
            console.error(`Error creating student: ${error.message}`);
            throw new Error("Failed to create student");
        }
    }

    static async update_Password(studentId , password) {
        try {
           const password_hash = await bcryptjs.hash(password, 8);
            const [result] = await pool.execute(`UPDATE students SET password = ? WHERE id = ?`, [password_hash, studentId ]);
            return result.affectedRows;
        } catch (error) {
            console.log(error);
        }
    }

    static async update_LastName( studentId, last_name) {
        try {
            const [result] = await pool.execute(`UPDATE students SET Last_name = ? WHERE id = ?`, [last_name, studentId ]);
            return result.affectedRows;
        } catch (error) {
            console.log(error);
        }
    }

    static async update_FirstName(id, first_name) {
        try {
            const [result] = await pool.execute(`UPDATE students SET First_name = ? WHERE id = ?`, [first_name, id]);
            return result.affectedRows;
        } catch (error) {
            console.log(error);
        }
    }

    static async update_groupid(id, group_id) {
        try {
            const [result] = await pool.execute(`UPDATE students SET group_id = ? WHERE id = ?`, [group_id, id]);
            return result.affectedRows;
        } catch (error) {
            console.log(error);
        }
    }

    static async getById(id) {
        try {
            const [students] = await pool.execute(
                "SELECT * FROM students WHERE id = ?",
                [id]
            );

            if (students.length === 0) {
                throw new Error(`Student with ID ${id} not found`);
            }

            return students[0];
        } catch (error) {
            console.error(`Error fetching student by ID: ${error.message}`);
            throw new Error("Failed to fetch student");
        }
    }

    static async searchByEmail(email) {
        try {
            const [result] = await pool.execute(
                `SELECT * FROM students WHERE email = ?`,
                [email]
            );

            if (result.length > 0) {
                return result[0];
            }
            return null;
        } catch (error) {
            console.error(`Error searching student by email: ${error.message}`);
            throw new Error("Failed to search student by email");
        }
    }
}

export default Student;



