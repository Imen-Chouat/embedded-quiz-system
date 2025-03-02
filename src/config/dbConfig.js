import mysql from 'mysql2/promise' ;
import dotenv from 'dotenv' ;
import envConfig from './envConfig.js';
dotenv.config();
const dbConfig = {
    host: envConfig.DB_HOST ,
    user: envConfig.DB_USER ,
    password: envConfig.DB_PASSWORD  ,
    database: envConfig.DB_NAME ,
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

async function createStudentTable() {
    try {
        const [results] = await pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                id INT PRIMARY KEY AUTO_INCREMENT,
                group_id INT,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (group_id) REFERENCES student_groups(id) ON DELETE SET NULL
            );
        `);
    } catch (error) {
        console.error('Error creating table:', error);
    }
}
async function createQuizTable() {
    try {
        const [result] = await pool.query(`
                CREATE TABLE IF NOT EXISTS quizzes (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    teacher_id INT,
                    title VARCHAR(255) NOT NULL,
                    status ENUM('draft', 'published', 'archived') NOT NULL,
                    timed_by ENUM('quiz','question') NOT NULL,
                    duration_minutes INT,
                    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
                );
            `);
    } catch (error) {
        console.error(error);
    }

}
async function createQuestionTable() {
    try {
        const [result] = await pool.query(`
                CREATE TABLE IF NOT EXISTS questions (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    quiz_id INT,
                    question_text TEXT NOT NULL,
                    duration_minutes INT,
                    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
                );
            `);
    } catch (error) {
        console.error(error);
    }
    
}
async function createAnswersTable() {
    try {
        const [result] = await pool.query(`
                CREATE TABLE IF NOT EXISTS answers (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    question_id INT,
                    answer_text VARCHAR(255) NOT NULL,
                    is_correct TINYINT(1) NOT NULL DEFAULT 0,
                    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
                );
            `);
    } catch (error) {
        console.error(error);
    }
}

async function createPromoTable() {
    try {
        const [results] = await pool.query(`
            CREATE TABLE IF NOT EXISTS  promo (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(50) NOT NULL
            );
        `);
    } catch (error) {
        console.error('Error creating the table:', error);
    }
}

async function createSectionTable() {
    try {
        const [results] = await pool.query(`
            CREATE TABLE IF NOT EXISTS sections (
                id INT PRIMARY KEY AUTO_INCREMENT,
                class_id INT,
                name VARCHAR(10),
                FOREIGN KEY (class_id) REFERENCES promo(id) ON DELETE SET NULL
            );
        `);
    } catch (error) {
        console.error('Error creating the table:', error);
    }
    
}

async function createStudent_groups() {
    try {
        const [results] = await pool.query(`
            CREATE TABLE IF NOT EXISTS student_groups (
                id INT PRIMARY KEY AUTO_INCREMENT,
                section_id INT,
                name VARCHAR(10),
                FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL
            );
        `);
    } catch (error) {
        console.error('Error creating the table:', error);
    }
    
}

async function  createQuiz_student() {
    try {
        const [result] = await pool.query(`
                CREATE TABLE IF NOT EXISTS quiz_student (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    quiz_id INT,
                    student_id INT,
                    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
                    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
                );
            `);
    } catch (error) {
        console.error(error);
    }
}

async function createQuiz_attempts() {
    try {
        const [result] = await pool.query(`
                CREATE TABLE IF NOT EXISTS quiz_attempts (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    student_id INT,
                    quiz_id INT,
                    start_time DATETIME NOT NULL,
                    end_time DATETIME,
                    status ENUM('in_progress', 'completed', 'cancelled') NOT NULL,
                    score FLOAT,
                    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
                    UNIQUE(student_id, quiz_id)
                );
            `);
    } catch (error) {
        console.error(error);
    }
}

async function createStudent_responses() {
    try {
        const [result] = await pool.query(`
                CREATE TABLE IF NOT EXISTS student_responses (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    student_id INT,
                    quiz_id INT,
                    question_id INT,
                    choice_id INT,
                    is_correct BOOLEAN,
                    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
                    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
                    FOREIGN KEY (choice_id) REFERENCES answers(id) ON DELETE CASCADE
                );
            `);
    } catch (error) {
        console.error(error);
    }
}

createTeachersTable();
createStudentTable();
createQuizTable();
createQuestionTable();
createAnswersTable();
createStudent_groups();
createSectionTable();
createPromoTable();
createQuiz_student();
createQuiz_attempts();
createStudent_responses();

export default pool ;
