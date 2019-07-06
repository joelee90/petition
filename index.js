const express = require('express');
const app = express();

const db = require('./utils/db');

app.use(express.static('./public'));

app.get('/cities',(req, res) => {
    db.getCities().then(results => {
        console.log('results.rowa from db.getCities: ', results.rows);
    });
});
// how to query from db

app.post('/add-city', (req, res) => {
    //want to add Munich, DE to our cities table
    //we will have to write the query in out db.js file
    //run it in the POST / add-city route.
    db.addCity('Munich', 'DE').then (()=> {
        console.log('working');
    }).catch(err => {
        console.log('err in addCity: ', err);
    });
});


app.listen(8080, ()=> console.log("BBBBBBAAAAAAMMMMMMMMM!"));
