const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/user');


//sign up
exports.User_SignUp = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(email => {
            if (email) {
                console.log("faild");
                res.status(509).json({ message: "email is exist" })

            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ error: err });
                    } else {
                        const user = new User({
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({ message: "user created" });
                            }).catch(err => {
                                console.log(err);
                                res.status(500).json({ error: err });
                            });
                    }
                });
            }
        });
}

exports.User_Login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({ message: "Auth Failed" });
                    }
                    if (result) {
                        const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                            //validation of token
                        }, process.env.JWT_KEY, {
                                expiresIn: "1h"
                            });
                        return res.status(200).json({ message: "Auth successful", token: token });
                    }
                    return res.status(401).json({ message: "Auth Failed" });
                })

            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

//user deleting
exports.User_Deleting = (req, res, next) => {
    User.findOneAndDelete({ _id: req.params.userId })
        .exec()
        .then(() => {
            res.status(200).json({ message: "user deleted" })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
}