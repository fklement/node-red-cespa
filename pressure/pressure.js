module.exports = function (RED) {
    function PressureNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
            const fs = require('fs'),
                path = require('path'),
                certFile = path.resolve(__dirname, '../ssl/RESTTEST_cert.pem'),
                keyFile = path.resolve(__dirname, '../ssl/RESTTEST_key.pem'),
                request = require('request');

            const query = {
                "db": "tires",
                "schema": "hackaton",
                "table": "ruuvidata",
                 //"where": {
                 //    "DID": {
                 //        "=": 181812101806072401603
                 //    }
                 //}
            }

            var buff = new Buffer(JSON.stringify(query)).toString("base64");

            
            console.log(query.toString("base64"))

            const options = {
                url: "https://ctpwyd.conti.de:443/data?q=" + buff,
                cert: fs.readFileSync(certFile),
                key: fs.readFileSync(keyFile)
            };

            request.get(options, function (error, response, body) {
                if (response.statusCode == 200) {
                    node.status({
                        fill: "green",
                        shape: "dot",
                        text: "received 200"
                    });
                    var obj = JSON.parse(body);
                    var op = obj.result.data.map(function(item) {
                        return item[6];
                      });
                    console.log(op.length);
                    msg.payload = op;
                    node.send(msg);
                }  else {
                    node.error("error", response.statusCode);
                    node.status({
                        fill: "red",
                        shape: "dot",
                        text: "error " + response.statusCode
                    });
                }
                              
            });



        });
    }
    RED.nodes.registerType("pressure", PressureNode);
}