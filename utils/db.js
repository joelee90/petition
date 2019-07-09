var spicedPg = require('spiced-pg');

var db = spicedPg('postgres:postgres:postgres@localhost:5432/signatures');

exports.getSignatures = function getSignatures() {
    return db.query('SELECT * FROM signings');
};

exports.addSignatures = function addSignatures(first, last, signature) {
    return db.query(
        `INSERT INTO signings (first, last, signature) VALUES ($1, $2, $3) RETURNING id`,
        [ first, last, signature ]);
};

exports.getSignaturesNum = function getSignatures() {
    return db.query('SELECT COUNT(*) FROM signings');
};

exports.getSignatureImage = function getSignatures(id) {
    return db.query(`SELECT signature FROM signings WHERE id = ${id}`);
};

exports.addUsersInfo = function addUsersInfo(firstname, lastname, email, password) {
    return db.query(
        `INSERT INTO usersinfo (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id`,
        [ firstname, lastname, email, password ]);
};

exports.getUsersInfo = function getUsersInfo(email) {
    return db.query(
        'SELECT password FROM usersinfo WHERE email=$1' [email]);
};

//---------------encounter notes-----------------------------------------------
//city = $1, country = $2
//$ used to prevent a type of attack called a SQL Injection.


// var spicedPg = require('spiced-pg');
//
// var db = spicedPg('postgres:postgres:postgres@localhost:5432/cities');
//
// exports.getCities = function getCities() {
//     return db.query('SELECT * FROM cities');
// };
//
// exports.addCity = function addCity(city, country) {
//     return db.query(
//         `INSERT INTO cities (city, country) VALUES ($1, $2)`,
//         [ city, country ]);
// };

//city = $1, country = $2
//$ used to prevent a type of attack called a SQL Injection.
