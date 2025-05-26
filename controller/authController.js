const express = require("express")
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } = require("../service/firebaseInit");
const router = express.Router()
const { generateToken } = require("../service/token");
var cookieSession = require('cookie-session')

const auth = getAuth();

router.post("/login", (req, res) => {
    try {
        atob(req.body.p)
    } catch {
        res.json({
            status: false,
            msg: 'Password encoding is invalid.'
        });
        return;
    }
    signInWithEmailAndPassword(auth, req.body.u, atob(req.body.p))
        .then((userCredential) => {
            if (userCredential.user.emailVerified) {
                cookieSession({
                    name: 'loginsession',
                    secure: true,
                    keys: [generateToken(userCredential.user, '1h')],
                    maxAge: 1 * 60 * 60 * 1000
                })
                if (req.body.r) {
                    cookieSession({
                        name: 'refreshsession',
                        secure: true,
                        keys: [generateToken(userCredential.user, '30d')],
                        maxAge: 720 * 60 * 60 * 1000
                    })
                    res.json({
                        status: true,
                        accessToken: generateToken(userCredential.user, '1h')
                    });
                }
                res.json({
                    status: true
                });
            } else {
                const user = userCredential.user;
                sendEmailVerification(user).then(() => {
                    res.json({
                        status: false,
                        msg: "Your Account has not been verified. Please check your email '" + userCredential.user.email + "' to verify your Email."
                    });
                });
            }
        })
        .catch((error) => {
            res.json({
                status: false,
                msg: error.message
            });
        });
});

router.post("/register", (req, res) => {
    try {
        atob(req.body.p)
    } catch {
        res.json({
            status: false,
            msg: 'Password encoding is invalid.'
        });
        return;
    }
    cookieSession({
        name: 'registersession',
        keys: ['ok'],
        secure: true,
        maxAge: 1 * 60 * 60 * 1000
    })
    createUserWithEmailAndPassword(auth, req.body.u, atob(req.body.p))
        .then((userCredential) => {
            const user = userCredential.user;
            sendEmailVerification(user).then(() => {
                res.json({
                    status: true
                });
            });
        })
        .catch((error) => {
            res.json({
                status: false,
                msg: error.message
            });
        });
});

module.exports = router;