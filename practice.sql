DROP TABLE IF EXISTS names;

CREATE TABLE names(
    id SERIAL PRIMARY KEY,
    first VARCHAR(50) NOT NULL,
    last VARCHAR(50) NOT NULL,
    signature TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO signings(first, last)
VALUES ('Johnny', 'Depp');
