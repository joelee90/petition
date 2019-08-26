const express = require('express');
const app = (exports.app = express());
const hb = require('express-handlebars');
const db = require("./utils/db");
const bcrypt = require("./utils/bc");
const csurf = require('csurf');
// const helmet = require("helmet");

app.engine('handlebars', hb());
app.set('view engine', 'handlebars');
app.use(require('cookie-parser')());
app.use("/favicon.ico", (req,res) => res.sendStatus(404));
app.use(express.static('./static'));
// app.use(helmet());

app.use((req, res, next) => {
    res.set('x-frame-options', 'deny');
    next();
});

let cookieSession = require('cookie-session');
app.use(cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.use(require("body-parser").urlencoded({
    extended: false
}));

app.use(csurf());

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.get('/', (req, res) => {
    if(req.session.usersInformation) {
        res.redirect('/login');
    } else {
        res.redirect('/register');
    }
});

app.get('/register', (req, res) => {
    if(req.session.usersInformation) {
        res.redirect('/petition');
    } else {
        res.render('register', {
            title: "Register"
        });
    }
});

app.post('/register', (req, res) => {
    bcrypt.hashPassword(req.body.password).then(pass => {
        return db.addUsersInfo(
            req.body.firstname,
            req.body.lastname,
            req.body.email,
            pass
        ).then(results => {
            req.session.usersInformation = results.rows[0].id;
            req.session.name = req.body.firstname;
            res.redirect('/profile');
        })
            .catch(err => {
                console.log("err no input: ", err.message);
            });
    });
});

app.get('/login', (req, res) => {
    if(!req.session.usersInformation) {
        res.render('login', {
            title: "Login"
        });
    } else {
        res.redirect('/petition');
    }
});

app.post("/login", (req, res) => {
    db.getEmailToCheckSignature(req.body.email)
        .then(val => {
            console.log("val in login", val.rows[0]);
            if(!val.rows[0]) {
                return res.render('login', {});
            }
            return bcrypt.checkPassword(req.body.password, val.rows[0].password)
                .then(match => {
                    if(match === true) {
                        console.log("val.rows[0].id in login", val.rows[0].id);
                        req.session.usersInformation = val.rows[0].id;
                        req.session.sign_id = val.rows[0].signature;
                        req.session.name = val.rows[0].firstname;
                    }
                    if(req.session.sign_id) {
                        res.redirect('/petition/signers');
                    } else {
                        res.redirect('/petition');
                    }
                })
                .catch(err => {
                    console.log("Error Message in post login: ", err);
                });
        });
});

app.get('/profile', (req, res) => {
    res.render('profile', {
        title: "Profile",
        name: req.session.name
    });
});

app.post('/profile', (req, res) => {
    return db.addUsersProfile(
        req.body.age,
        req.body.city,
        req.body.homepage,
        req.session.usersInformation
    )
        .then(() => {
            res.redirect('/petition');
        })
        .catch(err => {
            console.log("err in app.post profile: ", err.message);
        });
});

app.get("/petition/signers/:city", (req, res) => {
    db.getSignersByCity(req.params.city)
        .then(results => {
            console.log("req.params.city", req.params.city);
            res.render("signers", {
                signers: results.rows
            });
        })
        .catch(error =>  {
            console.log("error:", error);
        });
});

app.get('/profile/edit', (req, res) => {
    console.log("req.session.usersInformation profile/edit", req.session.usersInformation);
    db.editUserProfile(req.session.usersInformation)
        .then(results => {
            console.log("results in edit", results);
            res.render('edit', {
                title: "Edit",
                profile : results.rows[0]
            });
        })
        .catch(err => {
            console.log("err in edit:", err);
        });
});

app.post('/profile/edit', (req, res) => {
    let url;
    if (!req.body.homepage.startsWith("http")) {
        url = "http://" + req.body.homepage;
    } else {
        url = req.body.homepage;
    }
    let edit;
    if(req.body.password != "") {
        edit = [
            bcrypt.hashPassword(req.body.password)
                .then(password =>
                    db.updateUserInfo(
                        req.session.usersInformation,
                        req.body.firstname,
                        req.body.lastname,
                        req.body.email,
                        password
                    )
                ),
            db.updateUserProfile(
                req.body.age,
                req.body.city,
                url,
                req.session.usersInformation
            )
        ];
    } else {
        edit = [
            db.updateUserInfo(
                req.session.usersInformation,
                req.body.firstname,
                req.body.lastname,
                req.body.email
            ),
            db.updateUserProfile(
                req.body.age,
                req.body.city,
                url,
                req.session.usersInformation
            )
        ];
    }

    Promise.all(edit)
        .then(()=> {
            res.redirect('/petition/signers');
        })
        .catch((err) => {
            console.log("err in profile edit", err);
        });

});

app.get('/petition', (req, res) => {
    if(req.session.sign_id) {
        res.redirect('/petition/signed');
    } else {
        res.render('petition', {
            title: "No Plastic!"
        });
    }
});

app.post('/petition', (req, res) => {
    if(req.body.signature == "") {
        res.render('petition', {
            message: true
        });
    } else {
        db.addSignatures(req.session.usersInformation, req.body.signature)
            .then(results=> {
                req.session.sign_id = results.rows[0].id;
                res.redirect('/petition/signed');
            })
            .catch(err => {
                console.log("err no input: ", err.message);
            });
    }
});

app.get('/petition/signed', (req,res) => {
    let resultsNo;
    db.getSignaturesNum()
        .then(results => {
            resultsNo = results.rows;
            return db.getSignatureImage(req.session.sign_id)
                .then(results => {
                    if(results.rows.length == 0) {
                        res.redirect('/petition');
                    } else {
                        res.render('signed', {
                            title: "Signed",
                            count: resultsNo[0].count,
                            sigimage: results.rows[0].signature,
                            name: req.session.name
                        });
                    }
                });
        })
        .catch(err => {
            console.log('err in app.get petition signed: ', err.message);
        });
});

app.get('/petition/signers', (req,res) => {
    db.getUserProfile()
        .then(results => {
            res.render('signers', {
                title: "Signers",
                signers: results.rows
            });})
        .catch(err => {
            console.log('err in petition/signers', err);
        });
});

app.post('/deleteSignature', (req, res) => {
    db.deleteSignature(req.session.usersInformation)
        .then(()=> {
            delete req.session.sign_id;
            res.redirect('/petition');
        })
        .catch(err => {
            console.log('err in delete: ', err);
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
});

if (require.main == module) {
    app.listen(process.env.PORT || 8080, () => {console.log('listening');});
}
