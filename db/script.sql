CREATE TABLE Usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    sobrenome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    datanascimento DATE NOT NULL,
    signo VARCHAR(255) NOT NULL,
    idade INT NOT NULL
);