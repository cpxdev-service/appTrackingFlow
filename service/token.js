const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const loginscret = process.env.LOGIN;

function generateToken(user, skey, exp) {
  return jwt.sign({ userId: user.uid, email: user.email }, skey, {
    expiresIn: exp,
  });
}

function verifyToken(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return null;

    const token = parts[1];
    if (!token) return null;
    const payload = jwt.verify(token, loginscret);

    return payload;
  } catch (err) {
    return null;
  }
}

module.exports = {
  verifyToken,
  generateToken,
};
