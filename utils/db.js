var spicedPg = require('spiced-pg');

var db = spicedPg('postgres:postgres:postgres@localhost:5432/signatures');

exports.getSignatures = function getSignatures() {
    return db.query('SELECT * FROM signings');
};

exports.addSignatures = function addSignatures(first, last) {
    return db.query(
        `INSERT INTO signings (first, last) VALUES ($1, $2)`,
        [ first, last ]);
};

exports.getSignaturesNum = function getSignatures() {
    return db.query('SELECT COUNT(*) FROM signings');
};

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
//
// //city = $1, country = $2
// //$ used to prevent a type of attack called a SQL Injection.
