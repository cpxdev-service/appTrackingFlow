const crypto = require('crypto');

const jwt = require('jsonwebtoken');

function generateToken(user, skey, exp) {
    return jwt.sign({ userId: user.id }, skey, { expiresIn: exp });
}

function verifyToken(req) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return false;
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return false;
        }
        req.user = user;
        return true;
    });
}

module.exports = {
    verifyToken,
    generateToken
};