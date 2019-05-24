module.exports = function (RED) {
    function AccelerationNode(config) {
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
                "table": "accgyr",
            }

            var buff = new Buffer(JSON.stringify(query)).toString("base64");

            console.log(query.toString("base64"))

            const options = {
                url: "https://ctpwyd.conti.de:443/data?q=" + buff,
                cert: fs.readFileSync(certFile),
                key: fs.readFileSync(keyFile)
            };

            request.get(options, function (error, response, body) {
                var obj = JSON.parse(body);
                var op = obj.result.data.map(function(item) {
                    var x = "acx :" +item[2];
                    var y = " acy :" +item[3];
                    var z = " acz :" +item[4];

                    return x + y + z;
                })
                msg.payload = op;
                node.send(msg);
            });



        });
    }
    RED.nodes.registerType("acceleration", AccelerationNode);
}