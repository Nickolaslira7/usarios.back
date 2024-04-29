const express = require('express');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'aulaback',
    password: 'ds564',
    port: 5432,
    });

const app = express();
const PORT = 3000;

app.use(express.json(''));

app.get('/', (req, res) => {
    res.send('Hello World');
    });

app.get('/Usuarios', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM Usuarios');
        res.json({
            total: rows.length,
            Usuarios: rows,
        });
        }
    catch (error) {
        console.log("error in get Usuarios", error);
        res.status(500).json(error);
        }
    });

app.get('/Usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM Usuarios WHERE id = $1', [id]);
        res.json(rows);
        }
    catch (error) {
        console.log("error in get Usuarios id",error);
        res.status(500).json(error);
        }
    });

app.post('/Usuarios', async (req, res) => {
    const { nome, sobrenome, email, datanascimento} = req.body;
    const idade = calcularIdade(new Date(datanascimento));
    const signo = CalcularSigno(new Date(datanascimento));
    try {
        const { rows } = await pool.query(
            'INSERT INTO Usuarios (nome, sobrenome, email, datanascimento, idade, signo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [nome, sobrenome, email, datanascimento, idade, signo]
            );
        res.json(
            {
                message: 'User created successfully',
                user: rows[0],
            }
        );
        }
    catch (error) {
        console.log("error in post Usuarios",error);
        res.status(500).json(error);
        }
    }
    );

app.put('/Usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, sobrenome, email, datanascimento } = req.body;
    const idade = calculateAge(new Date(datanascimento));
    const zodiac_sign = calculateZodiacSign(new Date(datanascimento));
    try {
        const { rows } = await pool.query(
            'UPDATE Usuarios SET nome = $1, sobrenome = $2, email = $3, datanascimento = $4, idade = $5, zodiac_sign = $6 WHERE id = $7 RETURNING *',
            [nome, sobrenome, email, datanascimento, idade, zodiac_sign, id]
            );
        res.json(
            rows.length > 0 ? {message: 'Update sucess!', rows}: { message: 'User not found' }
        );
        }
    catch (error) {
        console.log("error in put Usuarios",error);
        res.status(500).json(error);
        }
    });

app.delete('/Usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('DELETE FROM Usuarios WHERE id = $1 RETURNING *', [id]);
            res.json({
                message: rows.length > 0 ? 'User deleted successfully' : 'User not found',
                user: rows[0],
            });
        }
    catch (error) {
        console.log("error in delete Usuarios",error);
        res.status(500).json(error);
        }
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });


const calcularIdade = (datanascimento) => {
    const today = new Date();
    const birthDate = new Date(datanascimento);
    let idade = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        idade--;
        }
    return idade;
    };

    const CalcularSigno = (datanascimento) => {
        const mes = datanascimento.getMonth() + 1;
        const dia = datanascimento.getDate();
    
        if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) {
            return 'Aries';
        } else if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) {
            return 'Touros';
        } else if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) {
            return 'Gemeos';
        } else if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) {
            return 'Cancer';
        } else if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) {
            return 'Leão';
        } else if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) {
            return 'Virgem';
        } else if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) {
            return 'Libra';
        } else if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) {
            return 'escorpião';
        } else if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) {
            return 'Sagitario';
        } else if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) {
            return 'Capricornio';
        } else if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) {
            return 'Aquario';
        } else {
            return 'Pisces';
        }
    };