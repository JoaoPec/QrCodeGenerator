const fs = require("fs")

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

app.post("/", function (req, res) {

    const userPost = req.body.url;
    
    console.log(userPost);

    const qrCode = qr.image(userPost, { type: "png" });
    const qrSource = "assets/qr-code-image.png"; // 

    qrCode.pipe(fs.createWriteStream(qrSource))
        .on("finish", () => {
            console.log("QR code criado com sucesso");

            res.download(qrSource, "Qr-Code.png", (err) => {
                if (err) {
                    console.error('Erro durante o download do arquivo:', err);
                } else {
                    console.log('Download concluído com sucesso.');
                }
            });
        })
        .on("error", (err) => {
            console.error('Erro ao criar o código QR:', err);
            res.status(500).send('Erro ao criar o código QR.');
        });
});
