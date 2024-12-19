const sql = require('mssql');

const dbSettings = {
  user: "admin2024",
  password: "sololetras123.",
  server: "serverdeploytaller.database.windows.net",
  database: "laCandelaDB",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  }
};

const getConnection = async () => {
  try {
    const pool = await sql.connect(dbSettings);
    return pool;
  } catch (e) {
    console.error(e);
  }
};

module.exports = { getConnection };
