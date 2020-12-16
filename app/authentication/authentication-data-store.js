const Database = require('better-sqlite3');
const bcrypt = require('bcrypt'); // TODO: REMOVE

const db = new Database(process.env.DATABASE, { verbose: console.log });

const TABLENAME = 'user';

const createTable = `CREATE TABLE IF NOT EXISTS ${TABLENAME}('username' varchar PRIMARY KEY, passHash varchar );`;
db.exec(createTable);

// TODO: REMOVE
const saltRounds = 10;
const myPlaintextPassword = 'my-password';
const salt = bcrypt.genSaltSync(saltRounds);
const passHash = bcrypt.hashSync(myPlaintextPassword, salt);

db.prepare(`INSERT OR IGNORE INTO ${TABLENAME} (username, passHash) VALUES (?,?)`).run('test-user', passHash);

function getUser(username) {
  const row = db.prepare(`SELECT * FROM ${TABLENAME} WHERE username = ?`).get(username);
  return row;
}

function registerUser(username, passwordHash) {
  db.prepare(`INSERT OR IGNORE INTO ${TABLENAME} (username, passHash) VALUES (?,?)`).run(username, passwordHash);
}

function deleteUser(username) {
  db.prepare(`DELETE FROM ${TABLENAME} WHERE username = ?`).run(username);
}

module.exports = {
  getUser,
  registerUser,
  deleteUser,
};
