module.exports = function (RED) {
    function torqueNode(config) {
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
                "table": "vehicle",
            }

            var buff = new Buffer(JSON.stringify(query)).toString("base64");
            var jsonobj = query.toString("base64");

            const options = {
                url: "https://ctpwyd.conti.de:443/data?q=" + buff,
                cert: fs.readFileSync(certFile),
                key: fs.readFileSync(keyFile)
            };

            request.get(options, function (error, response, body) {
                var obj = JSON.parse(body);
                var op = obj.result.data.map(function(item) {
                    return item[15];
                })
                msg.payload = op;
                node.send(msg);
            });

        });
    }
    RED.nodes.registerType("torque", torqueNode);
}