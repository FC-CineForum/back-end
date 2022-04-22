const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'password',
  database: 'cineforum',
  port: 5432
})

const signUp = async (req, res) => {
  const { 
    nickname, email, country, birthDate, isPublic, avatar, password, 
    name, firstLastname, secondLastname
  } = req.body;

  const userExists = await pool.query(
    'SELECT * FROM usuario WHERE correo = $1', [email] 
    );
  if (userExists.rowCount === 0) {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await pool.query(`INSERT INTO usuario 
    (alias, correo, residencia, publico, fecha_nacimiento, 
      foto_perfil, contrasenia, nombre, paterno, materno) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, 
    [nickname, email, country, isPublic, birthDate, avatar, hash, 
      name, firstLastname, secondLastname]);
    return res.status(200).json({ 
      Message: 'User was created successfully' 
    }); 
  }
  return res.status(401).json({ 
    Message: 'The email is already taken!' 
  });
}
 
module.exports = {
  signUp,
} 