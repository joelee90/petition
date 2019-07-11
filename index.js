const express = require('express');
const app = express();
const fs = require('fs');
const hb = require('express-handlebars');
const db = require("./utils/db");
const bcrypt = require("./utils/bc");

// const {requireSigniture} = require("./middleware");

app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

app.use(require('cookie-parser')());
app.use("/favicon.ico", (req,res) => res.sendStatus(404));
const bodyParser = require('body-parser');
// const csurf = require('csurf');


app.use(express.static('./material'));
//this is where burger.jpg is stored.

app.use(express.static('./static'));
//this is where css will be stored.

app.use(function(req, res, next) {
    res.set('x-frame-options', 'deny');
    // res.locals.csrfToken = req.csrfToken();
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

// app.use(csurf());

let imageDir = fs.readdirSync('./material');
//path to burger.jpg


app.get('/', function(req, res) {
    if(req.session.usersInformation) {
        res.redirect('/login');
    } else {
        res.redirect('/register');
    }
});

//-------------------------part 3----------------------------------------------
app.get('/register', function(req, res) {
    res.render('register', {
        title: "Register",
        material: imageDir
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
            title: "Login",
            material: imageDir
        });
    } else if (!req.session.sigId) {
        res.redirect('/petition');
    } else
        res.redirect('/petition/signed');
});

app.post('/login', function(req, res) {

    db.getPassword(req.body.email)
        .then(passcheck => {
            if(passcheck.rows[0].usersInformation){
                req.session.usersInformation = passcheck.rows[0].id;
            }
            else if(passcheck.rows[0].length == 0) {
                res.render('login', {
                    message: true
                });
            } else {
                return bcrypt.checkPassword(
                    req.body.password,
                    passcheck.rows[0].password)
                    .then(results => {
                        if(results) {
                            req.session.sigId = passcheck.rows[0].id;
                            if(passcheck.rows[0].signature) {
                                res.redirect('/petition/signers');
                            } else {
                                res.render('login', {
                                    message: true
                                });
                            }
                        }
                    });
            }
        })
        .catch(err => {
            console.log("err.message", err.message);
            res.render('login', {
                message: true
            });

        });
});
//in login, when user inputs email and password, should login.
// db.getEmailToCheckSignature(req.body.email)
//     .then(val => {
//         if(val.rows[0].length > 0) {
//             bcrypt.checkPassword(
//                 req.body.password,
//                 val.rows[0].password)
//                 .then(results => {
//                     if(results) {
//                         req.session.sigId = val.rows[0].id;
//                         if(val.rows[0].signature) {
//                             res.redirect('/petition/signers');
//                         } else {
//                             res.render('login', {
//                                 message: true
//                             });
//                         }
//                     } else {
//                         res.render('login', {
//                             message: true
//                         });
//                     }
//                 });
//         }
//     }) trial

//-------------------------part 3----------------------------------------------

//-------------------------part 4 (1/2)-----------------------------------------
app.get('/profile', function(req, res) {
    res.render('profile', {
        title: "Profile"
    });
});

app.post('/profile', function(req, res) {
    return db.addUsersProfile(req.body.age, req.body.city, req.body.homepage, req.session.usersInformation)
        .then(() => {
            // req.session.sigId = results.rows[0].id;
            res.redirect('/petition');
        })
        .catch(err => {
            console.log("err in app.post profile: ", err.message);
        });
});
//-------------------------part 4 (1/2)-----------------------------------------


//-------------------------part 4 (2/2)-----------------------------------------

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

//-------------------------part 4 (2/2)-----------------------------------------

app.get('/petition', function(req, res) {
    res.render('petition', {
        title: "No Pickles",
        material: imageDir
    });
});

app.post('/petition', function(req, res) {

    if(req.body.signature == "") {
        res.render('petition', {
            message: true
        });
    } else {
        db.addSignatures(req.session.usersInformation, req.body.signature)
            .then(results => {
                req.session.sigId = results.rows[0].id;
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
            return db.getSignatureImage(req.session.sigId)
                .then(results => {
                    if(results.rows.length == 0) {
                        res.redirect('/petition');
                    } else {
                        res.render('signed', {
                            title: "Signed",
                            material: imageDir,
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
//shows total number of people who signed up for the petition.

app.get('/petition/signers', function(req,res) {
    db.getUserProfile()
        .then(results => {
            res.render('signers', {
                title: "Signers",
                material: imageDir,
                signers: results.rows
            });})
        .catch();
});
//shows the list of people signed up for the petition.

// db.getEmailToCheckSignature().then(email => console.log("getEmailToCheckSignature", email));
// db.getSignersByCity().then(results => {console.log("getSignersByCity: ", results);});
// db.getUserProfile().then(results => { console.log(results);});
app.listen(process.env.PORT || 8080, () => {console.log('listening');});
