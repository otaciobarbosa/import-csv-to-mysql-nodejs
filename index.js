const express = require('express');
const md5 = require('md5');
const fileUpload = require('express-fileupload');
const csvtojson = require('csvtojson')
const app = express();;
const mysql = require("mysql");


app.use(fileUpload());

app.post('/upload', function (req, res) {
    let arquivo;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    arquivo = req.files.arquivo;
    const dataAgora = new Date().getTime();
    uploadPath = __dirname + '/uploads/' + md5(arquivo.name + dataAgora) + '.csv';

    const nomeFinal = 'uploads/' + md5(arquivo.name + dataAgora) + '.csv';
    arquivo.mv(uploadPath, function (err) {
        if (err) {
            return res.status(500).send(err);
        } else {

            // --------------------------------------------------------
            const hostname = "localhost",
                username = "root",
                password = "",
                databsename = "base_teste"

            let con = mysql.createConnection({
                host: hostname,
                user: username,
                password: password,
                database: databsename,
            });
            con.connect((err) => {
                if (err) {
                    return console.error('error: ' + err.message);
                } else {
                    console.log('Conectado ao banco!')
                }
            });

            csvtojson().fromFile(nomeFinal).then(source => {
                console.log(source)
                for (var i = 0; i < source.length; i++) {
                    var nome = source[i]["nome"],
                        telefone = source[i]["telefone"],
                        email = source[i]["email"]

                    var insertStatement =
                        `INSERT INTO agenda () values(?, ?, ?)`;
                    var items = [nome, telefone, email];

                    con.query(insertStatement, items,
                        (err, results, fields) => {
                            if (err) {
                                console.log(
                                    "Unable to insert item at row ", i + 1);
                                return console.log(err);
                            }
                        });
                }
                res.send('File uploaded!');
            });
            // --------------------------------------------------------            
            
        }
    });
});

app.listen(5000, () => {
    console.log(`Server started: 5000`);
});