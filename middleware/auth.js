const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET; // Ensure JWT_SECRET is set in your environment

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }

        req.user = decoded; // decoded token payload
        next();
    });
};

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({ message: 'Unauthorized.' });
        }

        const { role } = req.user;
        if (allowedRoles.includes(role)) {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden. Insufficient privileges.' });
        }
    };
};

module.exports = { authenticateToken, authorizeRoles };
