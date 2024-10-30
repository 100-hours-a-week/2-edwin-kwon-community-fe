import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import colors from 'colors';
import moment from 'moment';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 10,
});

const logQuery = (query, params, result) => {
    console.log(colors.gray('\n─────────────────────────────'));
    console.log(colors.yellow(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`));

    console.log(colors.cyan('Query:'), query);
    if (params) {
        console.log(colors.green('Params:'), params);
    }

    console.log(colors.magenta('Result:'), JSON.stringify(result, null, 2));

    // 배열인 경우에만 행 수 표시
    if (Array.isArray(result)) {
        console.log(colors.gray(`Total rows: ${result.length}`));
    }

    console.log(colors.gray('─────────────────────────────\n'));
};

const dbConnectionMiddleware = async (req, res, next) => {
    try {
        const connection = await pool.getConnection();

        const originalQuery = connection.query.bind(connection);
        connection.query = async (...args) => {
            const [rows] = await originalQuery(...args); // 구조분해할당으로 rows만 가져오기
            logQuery(args[0], args[1], rows); // rows 직접 전달
            return [rows];
        };

        req.db = connection;

        res.on('finish', () => {
            if (req.db) req.db.release();
        });

        next();
    } catch (error) {
        console.error(colors.red('DB Error:'), error);
        res.status(500).json({ error: 'Database connection failed' });
    }
};

export default dbConnectionMiddleware;
