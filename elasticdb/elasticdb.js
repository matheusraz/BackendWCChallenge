const request = require('request')
const fs = require('fs');
const elasticsearch = require('elasticsearch');

const esClient = new elasticsearch.Client({
  host: '172.17.0.2:9200',
  log: 'error'
});
  
const bulkIndex = function bulkIndex(index, type, data) {
  let bulkBody = [];
  data.forEach(item => {
    bulkBody.push({
      index: {
        _index: index,
        _type: type,
        _id: item.id
      }
    });
  
    bulkBody.push(item);
  });
  
  esClient.bulk({body: bulkBody})
  .then(response => {
    let errorCount = 0;
    response.items.forEach(item => {
      if (item.index && item.index.error) {
        console.log(++errorCount, item.index.error);
      }
    });
    console.log(`${data.length - errorCount} itens indexados com sucesso de ${data.length} itens`);
  })
 .catch(console.err);
};
  
const carga = function carga() {

  const reqBody = {
    uri: 'http://172.17.0.2:9200/wcc/teams/_search'
  }

  request(reqBody, (req, res) =>{
    let obj = JSON.parse(res.body);
    if(obj.hits == undefined || obj.hits.total == 0) {
      //const articlesRaw = fs.readFileSync('data.json');
      //const articles = JSON.parse(articlesRaw);
      const reqTeams = {
        method: 'GET',
        uri: 'https://worldcup.sfg.io/teams/'
      };
      request(reqTeams, (reqTeam, resTeam) => {
          let dados = JSON.parse(resTeam.body);
          console.log(`${dados.length} itens parseados do arquivo de dados.`);
          bulkIndex('wcc', 'teams', dados);
      });
    } else {
      console.log("O Banco ja possui dados carregados.")
    }
  });
};

exports.carga = carga;

const getAllContent = () => {
  let body = {
    query:{
      match_all:{}
    }
  };
  return esClient.search({index: "wcc", type: "teams", body: body});
};

exports.getAllContent = getAllContent;

const getMatchsByTeam = (team) => {
  let body = {
    query:{
      query_string: {
        query: team,
        fields: ["fifa_code"]
      }
    }
  };
  return esClient.search({index: "wcc", type: "teams", body: body});
};

exports.getMatchsByTeam = getMatchsByTeam;