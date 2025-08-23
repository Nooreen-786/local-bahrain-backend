const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
const APP_SECRET = process.env.APP_SECRET || 'default_secret'; 


const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};


const comparePassword = async (password, storedPassword) => {
  return await bcrypt.compare(password, storedPassword);
};

const createToken = (payload) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: '7d' });
};


const stripToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ status: 'Error', msg: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({ status: 'Error', msg: 'Malformed token' });
    }

    res.locals.token = token;
    next();
  } catch (err) {
    console.error('stripToken error:', err);
    res.status(401).json({ status: 'Error', msg: 'Strip Token Error' });
  }
};

const verifyToken = (req, res, next) => {
  try {
    const { token } = res.locals;

    const payload = jwt.verify(token, APP_SECRET);
    res.locals.payload = payload;
    req.user = payload;

    next();
  } catch (err) {
    console.error('verifyToken error:', err);
    res.status(401).json({ status: 'Error', msg: 'Invalid token' });
  }
};


const checkAdmin = (req, res, next) => {
  const payload = res.locals.payload;

  if (payload?.role === 'admin') {
    return next();
  }

  return res.status(403).json({ status: 'Error', msg: 'Admins only' });
};


module.exports = {
  hashPassword,
  comparePassword,
  createToken,
  stripToken,
  verifyToken,
  checkAdmin,
};
