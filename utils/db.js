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
        [ age || null, city, homepage, userId ]);
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
        ON signings.userId = usersinfo.id
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
        ON signings.userId = usersinfo.id
        LEFT JOIN user_profile
        ON signings.userId = user_profile.userId
        WHERE LOWER(city) = LOWER($1)`,
        [city]
    );
};

exports.getEmailToCheckSignature = function (email) {
    return db.query (
        `SELECT usersinfo.email,
        usersinfo.password,
        usersinfo.id,
        signings.userid 
        FROM usersinfo
        FULL OUTER JOIN
        signings ON usersinfo.id = signings.userid WHERE usersinfo.email = $1`,
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

exports.editUserProfile = function editUserProfile(info) {
    return db.query(
        `SELECT firstname, lastname, email, age, city, homepage
        FROM usersinfo
        LEFT JOIN user_profile ON user_profile.userid = usersinfo.id WHERE userid = $1`,
        [info]
    );
};

exports.updateUserInfo = function updateUserInfo
(userid, firstname, lastname, email, password) {
    if (password) {
        return db.query(
            `UPDATE usersinfo SET firstname = $2, lastname = $3, email = $4, password = $5 WHERE id = $1`,
            [userid, firstname, lastname, email, password]
        );
    } else {
        return db.query(
            `UPDATE usersinfo SET firstname = $2, lastname = $3, email = $4 WHERE id = $1`,
            [userid, firstname, lastname, email]
        );
    }
};

exports.updateUserProfile = function updateUserProfile
(age, city, homepage, userid) {
    return db.query(
        `INSERT INTO user_profile (age, city, homepage, userid)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (userid)
        DO UPDATE SET age = $1, city = $2, homepage = $3
        RETURNING id`,
        [age, city, homepage, userid]
    );
};

exports.deleteSignature = function deleteSignature(id) {
    return db.query(
        `DELETE FROM signings WHERE id = $1`, [id]);
};
