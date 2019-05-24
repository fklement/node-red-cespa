module.exports = function (RED) {
    function TempHumidityNode(config) {
        RED.nodes.createNode(this, config);
        this.requestedinfo = config.requestedinfo;        
        this.queryTimeRange = config.querytimerange;
        var node = this;
        var array = require('lodash/array');

        node.on('input', function (msg) {
            const scotify = require('../scotify.js');

            var currentTimestamp = Date.now() * 1000;
           
            const query = {
                "db": "tires",
                "schema": "hackaton",
                "table": "ruuvidata",
                "where": {
                    "AND": [
                        //         // {
                        //         //     "DID": {
                        //         //         "=": "181812101806072401603"
                        //         //     }
                        //         // },
                        {
                            "TS": {
                                ">": scotify.calcTimeDiff(currentTimestamp, node.queryTimeRange)
                            }
                        }
                    ]
                }
            }

            
            if(node.requestedinfo == 3){
                var ne = "EEE"
                scotify.execQuery(query, node, msg, array.fromPairs(ne, node.requestedinfo));
            }else{
                scotify.execQuery(query, node, msg, {
                    temp: node.requestedinfo
                });
            }

            

        });
    }
    RED.nodes.registerType("temp-humidity", TempHumidityNode);
}