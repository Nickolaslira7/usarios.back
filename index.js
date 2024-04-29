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
    res.send('Olá Mundo');
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
        console.log("erro ao obter Usuarios", error);
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
        console.log("erro ao obter Usuario por id",error);
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
                message: 'Usuário criado com sucesso',
                usuario: rows[0],
            }
        );
    }
    catch (error) {
        console.log("erro ao criar Usuario",error);
        res.status(500).json(error);
    }
});

app.put('/Usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, sobrenome, email, datanascimento } = req.body;
    const idade = calcularIdade(new Date(datanascimento));
    const signo = CalcularSigno(new Date(datanascimento));
    try {
        const { rows } = await pool.query(
            'UPDATE Usuarios SET nome = $1, sobrenome = $2, email = $3, datanascimento = $4, idade = $5, signo = $6 WHERE id = $7 RETURNING *',
            [nome, sobrenome, email, datanascimento, idade, signo, id]
        );
        res.json(
            rows.length > 0 ? {message: 'Atualização bem-sucedida!', rows}: { message: 'Usuário não encontrado' }
        );
    }
    catch (error) {
        console.log("erro ao atualizar Usuario",error);
        res.status(500).json(error);
    }
});

app.delete('/Usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('DELETE FROM Usuarios WHERE id = $1 RETURNING *', [id]);
        res.json({
            message: rows.length > 0 ? 'Usuário excluído com sucesso' : 'Usuário não encontrado',
            usuario: rows[0],
        });
    }
    catch (error) {
        console.log("erro ao excluir Usuario",error);
        res.status(500).json(error);
    }
});

app.listen(PORT, () => {
    console.log(`O servidor está rodando na porta ${PORT}`);
});


const calcularIdade = (datanascimento) => {
    const hoje = new Date();
    const dataNascimento = new Date(datanascimento);
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mes = hoje.getMonth() - dataNascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    }
    return idade;
};

const CalcularSigno = (datanascimento) => {
    const mes = datanascimento.getMonth() + 1;
    const dia = datanascimento.getDate();

    if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) {
        return 'Áries';
    } else if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) {
        return 'Touro';
    } else if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) {
        return 'Gêmeos';
    } else if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) {
        return 'Câncer';
    } else if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) {
        return 'Leão';
    } else if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) {
        return 'Virgem';
    } else if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) {
        return 'Libra';
    } else if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) {
        return 'Escorpião';
    } else if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) {
        return 'Sagitário';
    } else if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) {
        return 'Capricórnio';
    } else if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) {
        return 'Aquário';
    } else {
        return 'Peixes';
    }
};
