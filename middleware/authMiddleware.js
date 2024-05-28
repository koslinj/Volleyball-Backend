const jwt = require('jsonwebtoken');
const { client } = require('../db');

// async function verifyToken(req, res, next) {
//   const authHeader = req.headers['authorization']
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Access denied' })
//   }

//   const token = authHeader.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Access denied' })

//   try {
//     const decoded = jwt.verify(token, 'secret')
//     req.userId = decoded.userId;

//     const result = await client.query(
//       'SELECT role FROM users WHERE id = $1',
//       [req.userId]
//     );

//     req.userRole = result.rows[0].role
//     next()
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ message: 'Invalid token' })
//   }
// };

async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, 'secret');
    const userId = decoded.userId;

    const result = await client.query('SELECT role FROM users WHERE id = $1', [userId]);
    const userRole = result.rows[0]?.role;

    if (!userRole) {
      throw new Error('User role not found');
    }

    return { userId, userRole };
  } catch (error) {
    console.error(error);
    throw new Error('Invalid token');
  }
}

async function verifyTokenMiddleware(req, res, next) {
  try {
    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied' });
    }

    const token = authHeader.split(' ')[1];
    const { userId, userRole } = await verifyToken(token);

    req.userId = userId;
    req.userRole = userRole;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { verifyTokenMiddleware, verifyToken };
