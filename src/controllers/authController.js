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

const logIn = async (req, res) => {
  const { email, password } = req.body;
  if  (email && password) {
    const user = await pool.query(
      'SELECT * FROM usuario u WHERE u.correo = $1', [email]
    );
    if (user.rowCount === 1) {
      const isMatch = await bcrypt.compare(password, user.rows[0].contrasenia);
      if (isMatch) {
        req.session.user = {
          username: user.rows[0].alias,
          avatar: user.rows[0].foto_perfil,
        };
        return res.status(200).json({
          Message: 'User logged in successfully'
        });
      }
      return res.status(401).json({
        Message: 'Password or email is incorrect'
      });
    }
    return res.status(401).json({
      Message: 'User not found'
    });
  }
  return res.status(401).json({
    Message: 'Email and password are required'
  });
}
 
module.exports = {
  signUp,
  logIn,
} 