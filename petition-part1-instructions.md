How to start:
createdb signature in terminal.
create signatures.sql and make a table where users input can be stored and used.


pet.js
const db = require("/utils/db"); To access db and fetch db from sql.

app.use(express.static('./material')); This is where I stored my burger.jpg
problem is that the image only renders on the petition page and not others. :(

app.post('/petition', function(req, res) {
    db.addSignatures(req.body.first, req.body.last)
        .then(() => {
            res.redirect('/petition/signed');
        })
        .catch(err => {
            console.log("err no input: ", err);
        });

});

To save first and last name into the db, need to use addSignatures(in db.js).
    db.addSignatures(req.body.first, req.body.last) and redirect the user to the signed page. (I think I need to make if condition when input field is empty, give users the message that they need to try again.

Once the users have input their first and last name, need to use the db to render on the browser(list of people who have signed)

app.get('/petition/signers', function(req,res) {
    db.getSignatures().then(results => {console.log("results.rows: ", results.rows);
        res.render('signers', {
            title: "Signers",
            material: imageDir,
            signers: results.rows
        });}).catch();
});

To get access to db of the list, use 'db.getSignatures()', and render them back to the browser.

Same idea for the signed page, where it only shows number of people who have signed.
For this I made another db.getSignatureNum() which only has total number of people signed
up for the petition.


db.js

This is where db into sql can be accessed and to the pet.js.


Things I need to work on:
1.'sth went wrong message" if the input is empty and redirect to the the petition.
2.canvas
3.CSS