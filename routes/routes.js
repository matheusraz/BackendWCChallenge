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
        elastic.getAllTeams().then((result) => {
            let lista = []
            result.hits.hits.forEach(element => {
                lista.push(element._source);
            });
            res.json(lista);
        });
    });

    server.get('/teams/:fifa_code', (req, res) => {
        elastic.getSpecificTeam(req.params.fifa_code).then((result) => {
            res.json(result.hits.hits[0]._source);
        });
    });

    server.get('/matches/:team_name', (req, res) => {
        elastic.getMatchesByTeam(req.params.team_name).then((result) => {
            let lista = []
            result.hits.hits.forEach(element => {
                let moment = element._source;
                let obj = {};
                obj.home = moment.home_team;
                obj.away = moment.away_team;
                lista.push(obj);
            });
            res.json(lista)}
        );
    });
};