const express = require('express');
const app = express();
const fs = require('fs');
const hb = require('express-handlebars');
const db = require("./utils/db");

app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

app.use(require('cookie-parser')());
app.use("/favicon.ico", (req,res) => res.sendStatus(404));


app.use(express.static('./material'));
//this is where burger.jpg is stored.

app.use(express.static('./static'));
//this is where css will be stored.

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

let imageDir = fs.readdirSync('./material');
//path to burger.jpg

app.get('/', function(req, res) {
    res.redirect('/petition');
});

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
            console.log("req.session.sigId:", req.session.sigId);
            //figured out the id of the new signer.
            res.redirect('/petition/signed');
        })
        .catch(err => {
            console.log("err no input: ", err);
        });
});


app.get('/petition/signed', function(req,res) {
    let resultsNo;
    db.getSignaturesNum()
        .then(results => {
            resultsNo = results.rows;
            // console.log("results.rows.no: ", results.rows);
            return db.getSignatureImage(req.session.sigId).then(results => {
                console.log("urlresults:", results);
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
