const express = require('express');
const app = express();
const fs = require('fs');
const hb = require('express-handlebars');
const db = require("./utils/db");

app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

app.use(require('cookie-parser')());

app.use(express.static('./static'));
//this is where css will be stored.

app.use(express.static('./material'));
//this is where burger.jpg is stored.

app.use(require("body-parser").urlencoded({
    extended: false
}));

let imageDir = fs.readdirSync('./material');
console.log(imageDir);
//path to burger.jpg

app.get('/petition', function(req, res) {
    res.render('petition', {
        title: "No Pickles",
        material: imageDir
    });
});
//the image only shows on this page.

app.post('/petition', function(req, res) {
    // console.log(req.body);
    db.addSignatures(req.body.first, req.body.last)
        .then(() => {
            res.redirect('/petition/signed');
        })
        .catch(err => {
            console.log("err no input: ", err);
        });
});

// if(req.body.first && req.body.last == "")
// res.redirect('/petition');

app.get('/petition/signed', function(req,res) {
    db.getSignaturesNum().then(results => {console.log("results.rows.no: ", results.rows);
        res.render('signed', {
            title: "Signed",
            material: imageDir,
            signers: results.rows
        });}).catch();
});
//shows total number of people who signed up for the petition.

app.get('/petition/signers', function(req,res) {
    db.getSignatures().then(results => {console.log("results.rows: ", results.rows);
        res.render('signers', {
            title: "Signers",
            material: imageDir,
            signers: results.rows
        });}).catch();
});
//shows the list of people signed up for the petition.

app.listen(8080, console.log('listening'));
