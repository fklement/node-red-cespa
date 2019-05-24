module.exports = function (RED) {
    function LonLatNode(config) {
        RED.nodes.createNode(this, config);
        this.queryTimeRange = config.querytimerange;
        var node = this;
        node.on('input', function (msg) {
            const fs = require('fs'),
                path = require('path'),
                certFile = path.resolve(__dirname, '../ssl/RESTTEST_cert.pem'),
                keyFile = path.resolve(__dirname, '../ssl/RESTTEST_key.pem'),
                request = require('request');

            var hrTime = process.hrtime();
            var currentTimestamp = hrTime[0] * 1000000 + hrTime[1] / 1000;

            const query = {
                "db": "tires",
                "schema": "hackaton",
                "table": "gps",
                "where": {
                    "AND": [{
                            "DID": {
                                "=": "RESTTEST"
                            }
                        },
                        {
                            "TS": {
                                ">": currentTimestamp - (node.queryTimeRange * 1000000)
                            }
                        }
                    ]
                }
            }

            var buff = new Buffer.from(JSON.stringify(query)).toString("base64");

            const options = {
                url: "https://ctpwyd.conti.de:443/data?q=" + buff,
                cert: fs.readFileSync(certFile),
                key: fs.readFileSync(keyFile)
            };

            request.get(options, function (error, response, body) {
                node.status({
                    fill: "blue",
                    shape: "dot",
                    text: "send request"
                });
                if (response.StatusCode == 200) {
                    node.status({
                        fill: "green",
                        shape: "dot",
                        text: "received 200"
                    });
                    // TODO: Strip out body data
                    msg.payload = body;
                    node.send(msg);
                } else {
                    node.error("error", response.StatusCode);
                    node.status({
                        fill: "red",
                        shape: "dot",
                        text: "error " + response.StatusCode
                    });
                }
            });
        });
    }
    RED.nodes.registerType("lon-lat", LonLatNode);
}