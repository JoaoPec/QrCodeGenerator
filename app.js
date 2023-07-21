const fs = require("fs")

const path = require("path");

const qr = require("qr-image")

const express = require('express');

const bodyParser = require('body-parser');

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000, function (req, res) {
    console.log("Server running on http://localhost:3000/")
})

app.get("/", function (req, res) {
    res.sendFile((__dirname + "/index.html"))
})


// Resto do código ...

app.post("/", function (req, res) {
    const userPost = req.body.url;
    console.log(userPost);

    const qrCode = qr.image(userPost, { type: "png" });
    const qrSource = "assets/qr-code-image.png"; // Defina o caminho relativo do arquivo

    qrCode.pipe(fs.createWriteStream(qrSource))
        .on("finish", () => {
            console.log("QR code criado com sucesso");
            const absolutePath = path.join(__dirname, qrSource);
            res.sendFile(absolutePath); // Envie o arquivo como resposta ao cliente
        })
        .on("error", (err) => {
            console.error('Erro ao criar o código QR:', err);
            res.status(500).send('Erro ao criar o código QR.');
        });
});
