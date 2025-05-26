const crypto = require('crypto');

const jwt = require('jsonwebtoken');

function generateToken(user, skey, exp) {
    return jwt.sign({ userId: user.id }, skey, { expiresIn: exp });
}

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

module.exports = {
    verifyToken,
    generateToken
};