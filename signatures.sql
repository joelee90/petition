DROP TABLE IF EXISTS signings;

CREATE TABLE signings(
    id SERIAL PRIMARY KEY,
    userId INTEGER UNIQUE NOT NULL REFERENCES usersinfo(id),
    signature TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSERT INTO signings(userId, signature)
-- VALUES ('', '');

SELECT * FROM signings;

DROP TABLE IF EXISTS usersinfo;
CREATE TABLE usersinfo(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(250) NOT NULL,
    lastname VARCHAR(250) NOT NULL,
    email VARCHAR(250) UNIQUE NOT NULL,
    password VARCHAR(250) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM usersinfo;

-- INSERT INTO usersinfo(firstname, lastname, email, password)
-- VALUES ('', '', '', '');


DROP TABLE IF EXISTS user_profile;
CREATE TABLE user_profile(
    id SERIAL PRIMARY KEY,
    age INTEGER,
    city VARCHAR(250) NOT NULL,
    homepage VARCHAR(250) NOT NULL,
    userId INTEGER UNIQUE NOT NULL REFERENCES usersinfo(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM user_profile;

-- INSERT INTO user_profile(age, city, homepage, userId)
-- VALUES (null,'', '', '');
