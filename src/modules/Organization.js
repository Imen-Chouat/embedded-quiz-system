import mysql from 'mysql2' ;
import pool from '../config/dbConfig.js';
class Organization {
    static async createModule(moduleName){
        try {
            const [rows] = await pool.execute(`INSERT INTO modules (moduleName) VALUES (?)`,[moduleName]); 
            return rows.insertId ;
        } catch (error) {
            throw new Error(`Error creating module: ${error.message}`);  
        }
    }
    static async getModuleID(moduleName){
        try {
            const [rows] = await pool.execute(`SELECT id FROM modules WHERE moduleName = ?`,[moduleName]);
            return rows.length > 0 ? rows[0].id : -1 ;
        } catch (error) {
            throw new Error(`Error finding module: ${error.message}`);  
        }
    }
    static async addLevelModule(level_id,module_id){
        try {
            const [rows] = await pool.execute(`INSERT INTO level_module (level_id,module_id) VALUES (?,?)`,[level_id,module_id]);
            return rows.affectedRows ;
        } catch (error) {
            throw new Error(`Error adding the level to the module : ${error.message}`); 
        }
    }
    static async getLevelID(levelName){
        try {
            const [rows] = await pool.execute(`SELECT id FROM levels WHERE level_name = ?`,[levelName]);
            return rows.length > 0 ? rows[0] : -1 ;
        } catch (error) {
            throw new Error(`Error fetching the level id: ${error.message}`); 
        }
    }
    static async createLevel(levelName){
        try {
            const [rows] = await pool.execute(`INSERT INTO levels (level_name) VALUES (?)`,[levelName]);
            return rows.insertId ;
        } catch (error) {
            throw new Error(`Error creating a new level: ${error.message}`); 
        }
    }
    static async deleteLevel(level_id){
        try {
            const [rows] = await pool.execute(`DELETE FROM levels WHERE id = ?`,[level_id]);
            return rows.affectedRows;
        } catch (error) {
            throw new Error(`Error deleting the level: ${error.message}`); 
        }
    }
    static async updateLevelName(level_id,levelName){
        try {
            const [rows] = await pool.execute(`UPDATE levels SET level_name = ? WHERE id = ?`,[levelName,level_id]);
            return rows.affectedRows;
        } catch (error) {
            throw new Error(`Error updating the level name: ${error.message}`); 
        }
    }
    static async updateModuleName(module_id,moduleName){
        try {
            const [rows] = await pool.execute(`UPDATE modules SET moduleName = ? WHERE id = ?`,[moduleName,module_id]);
            return rows.affectedRows;
        } catch (error) {
            throw new Error(`Error updating the module name: ${error.message}`); 
        }        
    }
    static async updateModuleLevel(module_id,level_id){
        try {
            const [rows] = await pool.execute(`UPDATE level_module SET level_id = ? WHERE module_id = ?`,[level_id,module_id]);
            return rows.affectedRows;
        } catch (error) {
            throw new Error(`Error updating the level name: ${error.message}`); 
        }
    }
}
export default Organization ;
