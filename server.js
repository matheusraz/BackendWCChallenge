const express = require('express');
const server = express();
const bodyparser = require('body-parser');
const port = process.env.PORT || 3000;
const router = require('./routes/routes');

server.use(bodyparser.json());
server.use(bodyparser.urlencoded({extended:true}));

router(server);

server.listen(port, (err) => {
    if(err) {
        console.log("Erro ao subir servidor\nlog: ", err);
    } else {
        console.log(`Servidor escutando na porta ${port}`)
    }
});