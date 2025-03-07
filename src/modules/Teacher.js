import mysql from 'mysql2';
import pool from '../config/dbConfig.js';
//| id | name     |surname         | email               | password_hash | created_at  
// IMEN : export async function create.. //other way 
class Teacher {
    static async create(name,surname,email,password_hash) {
        try {
            const [row] = await pool.execute(`INSERT INTO teachers (name , surname , email , password_hash) VALUES (?,?,?,?)`,[name , surname , email ,password_hash]);
            return row.insertId ;// Imen: After inserting we get the id of the teacher
        }catch(error) {
            throw new Error(`Error creating teacher by ID: ${error.message}`);
        }
    }
    static async updateName(id,name){
        try {
            const [result] = await pool.execute(`UPDATE teachers SET name = ? WHERE id = ?`,[name , id]);
            return result.affectedRows ;
            //Imen: this shows how many rows where affected by my query
            //Imen: We can do also result.changedRows 
        }catch (error){
            throw new Error(`Error fetching teacher by ID: ${error.message}`);
        }
    }
    static async updatePassword(id,password){
        try {
            const [result] = await pool.execute(`UPDATE teachers SET password_hash = ? WHERE id = ?`,[password,id]);
            return result.affectedRows ;
        } catch (error) {
            throw new Error(`Error fetching teacher by ID: ${error.message}`);
        }
    }
    static async updateSurname(id,surname){
        try {
            const [result] = await pool.execute(`UPDATE teachers SET surname = ? WHERE id = ?`,[surname,id]);
            return result.affectedRows ;
        } catch (error) {
            throw new Error(`Error fetching teacher by ID: ${error.message}`);
        }
    }
    static async searchByemail(email){
        try{
            const [result] = await pool.execute(`SELECT * FROM teachers WHERE email = ?`,[email]);
            if(result.length > 0){
                return result[0];
            }
            return null ;
        }catch(error){
            throw new Error(`Error fetching teacher by Email: ${error.message}`);
        }
    }
    static async getById(id){
        try {
            const [teachers] = await pool.execute('SELECT * from teachers WHERE id = ?',[id]);
            if(teachers.length > 0 ){
                return teachers[0] ;
            }else {
                return null ;
            }
        } catch (error) {
            throw new Error(`Error fetching teacher by ID: ${error.message}`);
            return null;
        }
    }
}

export default Teacher ;
