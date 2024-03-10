SET client_encoding = 'UTF8';

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    age INTEGER NOT NULL
);

INSERT INTO users (name, age) VALUES ('testuser', 20);