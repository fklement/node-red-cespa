module.exports = function (RED) {
    function LonLatNode(config) {
        RED.nodes.createNode(this, config);
        this.queryTimeRange = config.querytimerange;
        var node = this;
        node.on('input', function (msg) {
            const scotify = require('../scotify.js');

            var currentTimestamp = Date.now() * 1000;

            const query = {
                "db": "tires",
                "schema": "hackaton",
                "table": "gps",
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

            scotify.execQuery(query, node, msg, {
                did: 0,
                altitude: 1,
                lat: 5,
                lon: 6,
                speed: 7
            });
        });
    }
    RED.nodes.registerType("lon-lat", LonLatNode);
}