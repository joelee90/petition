DROP TABLE IF EXISTS signings;
CREATE TABLE signings(
    id SERIAL PRIMARY KEY,
    first VARCHAR(50) NOT NULL,
    last VARCHAR(50) NOT NULL,
    signature TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO signings(first, last)
VALUES ('Hairy', 'Otter');

INSERT INTO signings(first, last)
VALUES ('Stephen', 'Durant');

INSERT INTO signings(first, last)
VALUES ('Kevin', 'Curry');

INSERT INTO signings(first, last)
VALUES ('Char', 'Mander');

SELECT * FROM signings;
