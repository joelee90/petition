const express = require('express');
const app = (exports.app = express());
const fs = require('fs');
const hb = require('express-handlebars');
const db = require("./utils/db");
const bcrypt = require("./utils/bc");

app.engine('handlebars', hb());
app.set('view engine', 'handlebars');
app.use(require('cookie-parser')());
app.use("/favicon.ico", (req,res) => res.sendStatus(404));
const bodyParser = require('body-parser');
const csurf = require('csurf');

app.use(express.static('./static'));

app.use(function(req, res, next) {
    res.set('x-frame-options', 'deny');
    next();
});

//--------------------cookie-----------------------
let cookieSession = require('cookie-session');
app.use(cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));
//--------------------------------------------------
app.use(require("body-parser").urlencoded({
    extended: false
}));
app.use(csurf());

app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
});


app.get('/', function(req, res) {
    if(req.session.usersInformation) {
        res.redirect('/login');
    } else {
        res.redirect('/register');
    }
});

app.get('/register', function(req, res) {
    res.render('register', {
        title: "Register"
    });
});

app.post('/register', function(req, res) {
    bcrypt.hashPassword(req.body.password).then(pass => {
        return db.addUsersInfo(
            req.body.firstname,
            req.body.lastname,
            req.body.email,
            pass
        ).then(results => {
            // console.log("req.body: ",req.body);
            // console.log("results: ",results);
            req.session.usersInformation = results.rows[0].id;
            res.redirect('/profile');
        })
            .catch(err => {
                console.log("err no input: ", err.message);
            });
    });
});

app.get('/login', function(req, res) {

    if(!req.session.usersInformation) {
        res.render('login', {
            title: "Login"
        });
    } else if (req.session.usersInformation) {
        res.redirect('/petition');
    } else
        res.redirect('/petition/signed');
});

app.post("/login", (req, res) => {
    db.getEmailToCheckSignature(req.body.email)
        .then(val => {
            // console.log('val', val);
            //check if email exists in the db
            if (val.rowCount > 0) {
                bcrypt.checkPassword(req.body.password, val.rows[0].password)
                    .then(matched => {
                        if (matched) {
                            req.session.usersInformation = val.rows[0].id;
                            // console.log("login", val.rows[0].id);
                            if (!val.rows[0].signature) {
                                res.redirect("/petition");
                            } else {
                                res.redirect("/petition/signers");
                            }
                        } else {
                            res.render('login', {});
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }  else if(!val.rowAsArray) {
                res.render("register", {
                    message: true
                });
            } else {
                res.redirect("/petition");
            }
        })
        .catch(err => {
            console.log("Error Message: ", err);
        });
});

app.get('/profile', function(req, res) {
    res.render('profile', {
        title: "Profile"
    });
});

app.post('/profile', function(req, res) {
    return db.addUsersProfile(req.body.age, req.body.city, req.body.homepage, req.session.usersInformation)
        .then(results => {
            req.session.usersInformation = results.rows[0].id;
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
    db.editUserProfile(req.session.usersInformation)
        .then(results => {
            console.log(results);
            console.log("req.session.usersInformation", req.session.usersInformation);
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
        console.log("homepage:", url);
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
        .catch(function(err) {
            console.log("err in profile edit", err);
        });

});

app.get('/petition', function(req, res) {
    res.render('petition', {
        title: "No Plastic!"
    });
});

app.post('/petition', function(req, res) {
    if(req.body.signature == "") {
        res.render('petition', {
            message: true
        });
    } else {
        db.addSignatures(req.session.usersInformation, req.body.signature)
            .then(results=> {
                req.session.usersInformation = results.rows[0].id;
                res.redirect('/petition/signed');
            })
            .catch(err => {
                console.log("err no input: ", err.message);
            });
    }
});

app.get('/petition/signed', function(req,res) {
    let resultsNo;
    db.getSignaturesNum()
        .then(results => {
            resultsNo = results.rows;
            return db.getSignatureImage(req.session.usersInformation)
                .then(results => {
                    if(results.rows.length == 0) {
                        res.redirect('/petition');
                    } else {
                        res.render('signed', {
                            title: "Signed",
                            count: resultsNo[0].count,
                            sigimage: results.rows[0].signature
                        });
                    }

                });
        })
        .catch(err => {
            console.log('err in app.get petition signed: ', err.message);
        });
});

app.get('/petition/signers', function(req,res) {
    db.getUserProfile()
        .then(results => {
            res.render('signers', {
                title: "Signers",
                signers: results.rows
            });})
        .catch();
});

app.post('/deleteSignature', (req, res) => {
    db.deleteSignature(req.session.usersInformation)
        .then(()=> {
            delete req.session.usersInformation;
            res.redirect('/petition');
        })
        .catch(err => {
            console.log('err in delete: ', err);
        });
});


app.get("/logout", function(req, res) {
    req.session = null;
    res.redirect("/register");
});

//--------------------demo routes-----------------------

app.get('/home', (req, res) => {
    res.send('<h1>welcome</h1>');
});

app.get('/product', (req, res) => {
    res.send(
        `
        <html>
            <h1>buy</h1>
            <form method = 'POST'>
                <button>yes</button>
            </form>
        </html>
        `
    );
});

// <input type = 'hidden' name= '_csrf' value='${req.csrfToken()}'>

app.post('/product', (req, res) => {
    req.session.wouldLikeToBuy = true;
    res.redirect('/home');
});

if (require.main == module) {
    app.listen(process.env.PORT || 8080, () => {console.log('listening');});
}
