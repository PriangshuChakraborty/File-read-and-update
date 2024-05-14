const express = require('express');
const app = express();
const cors = require('cors')
const fs = require('fs')
const path = require('path')

app.use(cors())
app.use(express.json())

const port = 3000;

const filePath = path.join(__dirname, 'hello.txt');

app.get('/', async (req, res) => {
    await fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }
        res.send(data);
    });
});

app.put('/', async (req, res) => {
    const text = req.body.text;
    if (!text) {
        res.status(400).send('Text is required');
        return;
    }
    await fs.writeFile(filePath, text, (err) => {
        if (err) {
            res.status(500).send('Error writing file');
            return;
        }
        res.send('File written');
    });
});

app.listen(port, () => {
    console.log(`server is running `);
});