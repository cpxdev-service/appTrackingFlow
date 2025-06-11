const express = require("express")
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } = require("../service/firebaseInit");
const router = express.Router()
const { generateToken, verifyToken } = require("../service/token");
const { verifyCf } = require("../service/cfCheck");
const { MongoClient, ServerApiVersion } = require("mongodb");
const client = new MongoClient(process.env.DB, {
    serverApi: {
        version: ServerApiVersion.v1,
    },
});

const auth = getAuth();

router.post("/login", (req, res, next) => {
    try {
        atob(req.body.p)
    } catch {
        res.json({
            status: false,
            msg: 'Password encoding is invalid.'
        });
        return;
    }
    if (verifyCf(req) == false) {
        res.json({
            status: false,
            msg: 'Token invalid'
        });
        return;
    }
    signInWithEmailAndPassword(auth, req.body.u, atob(req.body.p))
        .then(async (userCredential) => {
            if (userCredential.user.emailVerified) {
                const db = client.db('management');
                const collection = db.collection('user');

                const checkacct = await collection.find({ userId: userCredential.user.uid }).toArray();
                if (checkacct.length == 0) {
                    await collection.insertOne({
                        userId: userCredential.user.uid,
                        email: userCredential.user.email,
                        appQuota: 10,
                        jobLimit: 100,
                    });
                }
                res.json({
                    status: true,
                    token: generateToken(userCredential.user, process.env.LOGIN, '3h')
                });
            } else {
                const user = userCredential.user;
                sendEmailVerification(user).then(() => {
                    res.status(401).json({
                        status: false,
                        msg: "Your Account has not been verified. Please check your email '" + userCredential.user.email + "' to verify your Email."
                    });
                });
            }
        })
        .catch((error) => {
            res.status(403).json({
                status: false,
                msg: error.message
            });
        });
});

router.post("/register", (req, res, next) => {
    try {
        atob(req.body.p)
    } catch {
        res.json({
            status: false,
            msg: 'Password encoding is invalid.'
        });
        return;
    }
    verifyCf(req, res, next);
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

router.post("/resetpass", (req, res, next) => {
    verifyCf(req, res, next);
    sendPasswordResetEmail(auth, req.body.u)
        .then((userCredential) => {
            res.json({
                status: true
            });
        })
        .catch((error) => {
            res.json({
                status: false,
                msg: error.message
            });
        });
});

router.delete("/signout", (req, res, next) => {
    if (verifyToken(req) == null) {
        res.status(403).json({
            status: false
        });
        return;
    }
    res.json({
        status: true
    });
});

module.exports = router;