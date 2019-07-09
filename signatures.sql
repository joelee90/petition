DROP TABLE IF EXISTS signings;

CREATE TABLE signings(
    id SERIAL PRIMARY KEY,
    first VARCHAR(100) NOT NULL,
    last VARCHAR(100) NOT NULL,
    signature TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO signings(first, last, signature)
VALUES ('Johnny', 'Depp', '');

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

INSERT INTO usersinfo(firstname, lastname, email, password)
VALUES ('Johnny', 'Depp', 'johnny@spiced.com', 'qq');
