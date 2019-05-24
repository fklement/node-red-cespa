module.exports = function (RED) {
    function LonLatNode(config) {
        RED.nodes.createNode(this, config);
        this.queryTimeRange = config.querytimerange;
        var node = this;
        node.on('input', function (msg) {
            const scotify = require('../scotify.js'),
                request = require('request');

            var currentTimestamp = Date.now() * 1000;

            const query = {
                "db": "tires",
                "schema": "hackaton",
                "table": "gps",
                "where": {
                    "AND": [
                        // {
                        //     "DID": {
                        //         "=": "RESTTEST"
                        //     }
                        // },
                        {
                            "TS": {
                                ">": scotify.calcTimeDiff(currentTimestamp, node.queryTimeRange)
                            }
                        }
                    ]
                }
            }

            const options = {
                url: scotify.execQuery(query),
                cert: scotify.cert,
                key: scotify.key
            };

            request.get(options, function (error, response, body) {
                node.status({
                    fill: "blue",
                    shape: "dot",
                    text: "send request"
                });

                body = JSON.parse(body);

                if (response.statusCode == 200) {
                    node.status({
                        fill: "green",
                        shape: "dot",
                        text: "received 200"
                    });

                    msg.payload = {
                        "items": body.result.data,
                        "itemsCount": body.result["items-left"]
                    };
                    node.send(msg);
                } else {
                    node.status({
                        fill: "red",
                        shape: "dot",
                        text: "error " + error
                    });

                    node.error("error", body.error);
                }
            });
        });
    }
    RED.nodes.registerType("lon-lat", LonLatNode);
}