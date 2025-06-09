const crypto = require('crypto');
const jwt = require('jsonwebtoken');

function generateToken(user, skey, exp) {
    return jwt.sign({ userId: user.uid, email: user.email }, skey, { expiresIn: exp });
}

function verifyToken(req) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        if (token == null) {
            return null;
        }
        jwt.verify(token, process.env.LOGIN, (err, user) => {
            if (err) {

                return null;
            }
            return user;
        });
    } catch {
        return null;
    }
}

module.exports = {
    verifyToken,
    generateToken
};