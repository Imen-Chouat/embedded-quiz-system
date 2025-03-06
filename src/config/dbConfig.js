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

async function createStudentsTable() {
    try {
        const [results] = await pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                id INT PRIMARY KEY AUTO_INCREMENT,
                group_id INT,
                Last_name VARCHAR(100) NOT NULL,
                First_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (group_id) REFERENCES student_groups(id) ON DELETE SET NULL
            );
        `);
    } catch (error) {
        console.error('Error creating table:', error);
    }
}
async function createQuizzesTable() {
    try {
        const [result] = await pool.query(`
                CREATE TABLE IF NOT EXISTS quizzes (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    teacher_id INT,
                    Module VARCHAR(255) NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    status ENUM('draft', 'published') NOT NULL,
                    timed_by ENUM('quiz','question') NOT NULL,
                    duration_minutes INT,
                    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
                );
            `);
    } catch (error) {
        console.error(error);
    }

}
async function createQuestionsTable() {
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

async function createlevelsTable() {
    try {
        const [results] = await pool.query(`
            CREATE TABLE IF NOT EXISTS  levels (
                id INT PRIMARY KEY AUTO_INCREMENT,
                level_name VARCHAR(50) NOT NULL
            );
        `);
    } catch (error) {
        console.error('Error creating the table:', error);
    }
}

async function createSectionsTable() {
    try {
        const [results] = await pool.query(`
            CREATE TABLE IF NOT EXISTS sections (
                id INT PRIMARY KEY AUTO_INCREMENT,
                level_id INT,
                section_name VARCHAR(10),
                FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE SET NULL
            );
        `);
    } catch (error) {
        console.error('Error creating the table:', error);
    }
    
}

async function createstudent_groupsTable() {
    try {
        const [results] = await pool.query(`
            CREATE TABLE IF NOT EXISTS student_groups (
                id INT PRIMARY KEY AUTO_INCREMENT,
                section_id INT,
                group_name VARCHAR(10),
                FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL
            );
        `);
    } catch (error) {
        console.error('Error creating the table:', error);
    }
    
}

async function  createQuizParticipants() {
    try {
        const [result] = await pool.query(`
                CREATE TABLE IF NOT EXISTS QuizParticipants (
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
                CREATE TABLE IF NOT EXISTS Quiz_attempts (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    student_id INT,
                    quiz_id INT,
                    start_time DATETIME NOT NULL,
                    end_time DATETIME,
                    status ENUM('not_submitted', 'completed') NOT NULL,
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
                    answer_id INT,
                    is_correct BOOLEAN,
                    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
                    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
                    FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE
                );
            `);
    } catch (error) {
        console.error(error);
    }
}

createTeachersTable();
createStudentsTable();
createQuizzesTable();
createQuestionsTable();
createAnswersTable();
createstudent_groupsTable();
createSectionsTable();
createlevelsTable();
createQuizParticipants();
createQuiz_attempts();
createStudent_responses();

export default pool ;


