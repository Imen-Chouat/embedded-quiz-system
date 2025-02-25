import mysql from 'mysql2';
import pool from '../config/dbConfig.js';
//| id | name     |surname         | email               | password_hash | created_at  
// IMEN : export async function create.. //other way 
class Teacher {
    static async create(name,surname,email,password_hash) {
        try {
            const [row] = await pool.execute(`INSERT INTO teachers (name , surname , email , password_hash) VALUES (?,?,?,?)`,[name , surname , email ,password_hash]);
            return row.insertId ;// Imen: After inserting we get the id of the teacher
        }catch(err) {
            console.error(err);
        }
    }
    static async updateName(id,name){
        try {
            const [result] = await pool.execute(`UPDATE teachers SET name = ? WHERE id = ?`,[name , id]);
            return result.affectedRows ;
            //Imen: this shows how many rows where affected by my query
            //Imen: We can do also result.changedRows 
        }catch {
            console.error(err);
        }
    }
    static async updatePassword(id,password){
        try {
            const [result] = await pool.execute(`UPDATE teachers SET password_hash = ? WHERE id = ?`,[password,id]);
            return result.affectedRows ;
        } catch (error) {
            console.log(error);
        }
    }
    static async updateSurname(id,surname){
        try {
            const [result] = await pool.execute(`UPDATE teachers SET surname = ? WHERE id = ?`,[surname,id]);
            return result.affectedRows ;
        } catch (error) {
            console.log(error);
        }
    }
    static async seachByemail(email){
        try{
            const [result] = await pool.execute(`SELECT * FROM tables WHERE email = ?`,[email]);
            if(result.length > 0){
                return result[0];
            }
            return null ;
        }catch(error){
            console.log(error);
        }
    }
    static async getById(id){
        try {
            const [teachers] = await pool.execute('SELECT * from teachers WHERE id = ?',[id]);
            if(teacher.length > 0 ){
                return teachers[0] ;
            }else {
                return null ;
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export default Teacher ;