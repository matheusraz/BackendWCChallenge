const request = require('request');
const elastic = require('../elasticdb/elasticdb');

module.exports = serverRouter = (server) => {
    
    server.get('/', (req, res) => {
        const result = {
            status: 200,
            message: 'Servidor funcionando 100%'
        };
        res.json(result);
    });

    server.get('/teams', (req, res) => {
        elastic.getAllContent().then((result) => {res.json(result)});
    });

};