const db = require('./DataBase/db');

async function testConnection() {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        console.log('DB Connection OK, test query result:', rows[0].result);
    } catch (error) {
        console.error('DB Connection Failed:', error.message);
    }
}

testConnection();
