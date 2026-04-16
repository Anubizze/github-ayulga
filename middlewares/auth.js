const jwt = require('jsonwebtoken');

/**
 * Middleware: require valid JWT. Sets req.user from token payload.
 * Use on admin-only routes (create/update/delete).
 */
function requireAuth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { requireAuth };
