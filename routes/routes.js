const request = require('request');

module.exports = serverRouter = (server) => {
    
    server.get('/', (req, res) => {
        const result = {
            status: 200,
            message: 'Servidor funcionando 100%'
        };
        res.json(result);
    });
};