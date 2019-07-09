const express = require('express');
const app = express();
const fs = require('fs');
const hb = require('express-handlebars');
const db = require("./utils/db");
const bcrypt = require("./utils/bc");

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
            console.log("req.body: ",req.body);
            console.log("results: ",results);
            req.session.usersInformation = results.rows[0].id;
            res.redirect('/petition');
        })
            .catch(err => {
                console.log("err no input: ", err.message);
            });
    });
});

app.get('/login', function(req, res) {

    // if(!req.session.usersInformation) {
    res.render('login', {
        title: "Login",
        material: imageDir
    });
    // } else if (!req.session.sigId) {
    //     res.redirect('/petition');
    // } else
    //     res.redirect('/petition/signed');
});

app.post('/login', function(req, res) {
    if(!req.session.usersInformation) {

    } else {
    
        db.getUsersInfo(req.body.email)
            .then(passcheck => {
                console.log("req.body.email", req.body.email);
                return bcrypt.checkPassword(
                    req.body.password,
                    passcheck.rows[0].password)
                    .then(results => {
                        if(results) {
                            res.redirect('/petition');
                        } else {
                            res.render('/login', {
                                invalid: true
                            });
                        }
                    })
                    .catch(err => {
                        console.log("err.message", err.message);
                    });
            });
    }
});
//in login, when user inputs email and password, should login.

//-------------------------part 3----------------------------------------------

app.get('/petition', function(req, res) {
    res.render('petition', {
        title: "No Pickles",
        material: imageDir
    });
});

app.post('/petition', function(req, res) {

    db.addSignatures(req.body.first, req.body.last, req.body.signature)
        .then(results => {
            req.session.sigId = results.rows[0].id;
            // console.log("req.session.sigId:", req.session.sigId);
            //figured out the id of the new signer.
            res.redirect('/petition/signed');
        })
        .catch(err => {
            console.log("err no input: ", err.message);
        });
});


app.get('/petition/signed', function(req,res) {
    let resultsNo;
    db.getSignaturesNum()
        .then(results => {
            resultsNo = results.rows;
            // console.log("results.rows.no: ", results.rows);
            return db.getSignatureImage(req.session.sigId).then(results => {
                // console.log("urlresults:", results);
                res.render('signed', {
                    title: "Signed",
                    material: imageDir,
                    count: resultsNo[0].count,
                    sigimage: results.rows[0].signature
                });
            });
        })
        .catch();
});
//shows total number of people who signed up for the petition.

app.get('/petition/signers', function(req,res) {
    db.getSignatures()
        .then(results => {
            res.render('signers', {
                title: "Signers",
                material: imageDir,
                signers: results.rows
            });})
        .catch();
});
//shows the list of people signed up for the petition.

// for(let i = 0; i < results.rows.length; i++) {
//     req.session.sigId = results.rows[i].id;
//     console.log("req.session.sigId: ", req.session.sigId);
// } I was looping through just to see if id's were matching new users.

app.listen(8080, console.log('listening'));
