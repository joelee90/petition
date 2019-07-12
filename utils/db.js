var spicedPg = require('spiced-pg');
let db;

if(process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg('postgres:postgres:postgres@localhost:5432/signatures');
}

exports.getSignatures = function getSignatures() {
    return db.query('SELECT * FROM signings');
};

exports.addSignatures = function addSignatures(userId, signature) {
    return db.query(
        `INSERT INTO signings (userId, signature) VALUES ($1, $2) RETURNING Id`,
        [ userId, signature ]);
};

exports.getSignaturesNum = function getSignatures() {
    return db.query('SELECT COUNT(*) FROM signings');
};

exports.getSignatureImage = function getSignatureImage(id) {
    return db.query(`SELECT signature FROM signings WHERE id = $1`, [id]);
};

exports.addUsersInfo = function addUsersInfo(firstname, lastname, email, password) {
    return db.query(
        `INSERT INTO usersinfo (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id`,
        [ firstname, lastname, email, password ]);
};



exports.addUsersProfile = function addUsersProfile(age, city, homepage, userId) {
    return db.query(
        `INSERT INTO user_profile (age, city, homepage, userId) VALUES ($1, $2, $3, $4) RETURNING id`,
        [ age, city, homepage, userId ]);
};

exports.getUserProfile = function () {
    return db.query(
        `SELECT
        usersinfo.firstname AS firstname,
        usersinfo.lastname AS lastname,
        user_profile.age AS age,
        user_profile.city AS city,
        user_profile.homepage AS homepage
        FROM usersinfo
        LEFT JOIN signings
        ON signings.userId = userId
        LEFT JOIN user_profile
        ON signings.userId = user_profile.userId
        `
    );

};

exports.getSignersByCity = function (city) {
    return db.query (
        `
        SELECT
        usersinfo.firstname AS firstname,
        usersinfo.lastname AS lastname,
        user_profile.age AS age,
        user_profile.city AS city,
        user_profile.homepage AS homepage
        FROM usersinfo
        LEFT JOIN signings
        ON signings.userId = userId
        LEFT JOIN user_profile
        ON signings.userId = user_profile.userId
        WHERE LOWER(city) = LOWER($1)`,
        [city]
    );
};


exports.getEmailToCheckSignature = function (email) {
    return db.query (
        `SELECT * FROM signings LEFT JOIN usersinfo ON signings.userId = usersinfo.id WHERE usersinfo.email = $1`,
        [email]
    );
};

exports.getPassword = function getPassword(email) {
    return db.query (
        'SELECT email, password FROM usersinfo WHERE email=$1', [email]);
};

exports.addNewSignatures = function addNewSignatures(userId, signature) {
    return db.query(
        `UPDATE INTO signings (userId, signature) VALUES ($1, $2) RETURNING id`,
        [ userId, signature ]);
};
// exports.getEmailToCheckSignature = function (email) {
//     return db.query (
//         `
//         SELECT
//         signings.signature AS signature,
//         usersinfo.email AS email
//         FROM signings
//         LEFT JOIN usersinfo
//         ON signings.userId = usersinfo.id
//         WHERE email = $1,
//         `
//             [email]
//     );
// };

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
