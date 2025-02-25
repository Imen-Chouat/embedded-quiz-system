import mysql from 'mysql2/promise' ;
import dotenv from 'dotenv' ;
dotenv.config();
const dbConfig = {
    host: process.env.DB_HOST ,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD  ,
    database: process.env.DB_NAME ,
    waitForConnections: true,                
    connectionLimit: 10,                 
    queueLimit: 0,  
};
const pool = mysql.createPool(dbConfig);

async function createTeachersTable() {
    try {
        const [results] = await pool.query(`
            CREATE TABLE IF NOT EXISTS teachers (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(20) NOT NULL,
                surname VARCHAR(20) NOT NULL ,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);
       // console.log('Teachers table created successfully:', results);
    } catch (error) {
        console.error('Error creating teachers table:', error);
    }
}

createTeachersTable();

export default pool ;
