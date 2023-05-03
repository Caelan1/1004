const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/scores', (req, res) => {
    fs.readFile('scores.json', 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading scores.');
        } else {
            res.send(data);
        }
    });
});

app.post('/scores', (req, res) => {
    const newScore = req.body;
    fs.readFile('scores.json', 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading scores.');
        } else {
            const scores = JSON.parse(data);
            scores.push(newScore);
            scores.sort((a, b) => b.score - a.score);
            scores.splice(10);

            fs.writeFile('scores.json', JSON.stringify(scores, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error writing scores.');
                } else {
                    res.status(200).send('Score saved successfully.');
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});