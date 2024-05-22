const express = require('express');
const app = express();
const cors = require('cors')
const fs = require('fs')

app.use(cors())
app.use(express.json())

const port = 3000;

const secret = []

app.get('/', async (req, res) => {
    const filePath = req.body.fileName;
    const password = req.body.password;

    const findFile = secret.find((file) => file.fileName === filePath && file.password === password)
    if (!findFile) {
        res.status(404).send('File not found or password is incorrect');
        return;
    }
    await fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }
        res.send(data);
    });
});

app.post('/', async (req, res) => {
    const fileName = req.body.fileName;
    const text = req.body.text;
    const password = req.body.password;

    const includesFileName = secret.some(obj => obj.fileName === fileName);
    const includesPassword = secret.some(obj => obj.password === password);

    if (includesFileName || includesPassword) {
        res.status(400).send('File already exists or password is already used');
        return;
    }
    await fs.writeFile(fileName, text, (err) => {
        if (err) throw err;
        secret.push({ fileName: fileName, password: password })
        res.send(`File ${fileName} created and its text is ${text}`);
    });
});

app.put('/', async (req, res) => {
    const text = req.body.text;
    const filePath = req.body.fileName;
    const password = req.body.password;
    if (!text) {
        res.status(400).send('Text is required');
        return;
    }
    const findFile = secret.find((file) => file.fileName === filePath && file.password === password)
    if (!findFile) {
        res.status(404).send('File not found or password is incorrect');
        return;
    }
    await fs.writeFile(filePath, text, (err) => {
        if (err) {
            res.status(500).send('Error writing file');
            return;
        }
        res.send(`File written`);
    });
});

app.listen(port, () => {
    console.log(`server is running `);
});