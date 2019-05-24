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
                    //     "AND": [
                    //         // {
                    //         //     "DID": {
                    //         //         "=": "RESTTEST"
                    //         //     }
                    //         // },
                    // {
                    "TS": {
                        ">": scotify.calcTimeDiff(currentTimestamp, node.queryTimeRange)
                    }
                    // }
                    // ]
                }
            }

            scotify.execQuery(query, node, msg, {
                x: 1,
                y: 2,
                z: 3
            });
        });
    }
    RED.nodes.registerType("lon-lat", LonLatNode);
}