DROP TABLE IF EXISTS signings;

CREATE TABLE signings(
    id SERIAL PRIMARY KEY,
    first VARCHAR(50) NOT NULL,
    last VARCHAR(50) NOT NULL,
    signature TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO signings(first, last, signature)
VALUES ('Johnny', 'Depp', '');

-- INSERT INTO signings(first, last, signature)
-- VALUES ('Al', 'Pacino');
--
-- INSERT INTO signings(first, last, signature)
-- VALUES ('Robert', 'De Niro');
--
-- INSERT INTO signings(first, last, signature)
-- VALUES ('Kevin', 'Spacey');
--
-- INSERT INTO signings(first, last, signature)
-- VALUES ('Brat', 'Pit');
--
-- INSERT INTO signings(first, last, signature)
-- VALUES ('Angelina', 'Jolie');
--
-- INSERT INTO signings(first, last, signature)
-- VALUES ('Leonardo', 'DiCaprio');
--
-- INSERT INTO signings(first, last, signature)
-- VALUES ('Tom', 'Cruise');
--
-- INSERT INTO signings(first, last, signature)
-- VALUES ('Arnold', 'Schwarzenegger');
--
-- INSERT INTO signings(first, last, signature)
-- VALUES ('Sylvester', 'Stallone');
--
-- INSERT INTO signings(first, last, signature)
-- VALUES ('Charlize', 'Theron');

SELECT * FROM signings;
