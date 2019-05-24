const fs = require('fs'),
    path = require('path'),
    request = require('request'),
    certFile = path.resolve(__dirname, 'ssl/RESTTEST_cert.pem'),
    keyFile = path.resolve(__dirname, 'ssl/RESTTEST_key.pem');

// Set our values that are needed to connect to the RESTapi via SSL/TLS
cert = fs.readFileSync(certFile);
key = fs.readFileSync(keyFile);

// Decodes the given JSON query object to an base64 string and concatinates it with our url
getApiUrl = (queryObject) => "https://ctpwyd.conti.de:443/data?q=" + new Buffer.from(JSON.stringify(queryObject)).toString("base64");

getOptions = (query) => {
    return {
        url: getApiUrl(query),
        cert: cert,
        key: key
    }
}

// Returns the difference of our current timestamp and the query timestamp as an integer
exports.calcTimeDiff = (currentTimestamp, queryTimestamp) => parseInt(currentTimestamp - (queryTimestamp * 1000000));

// exports.composePayload = (body) => {
//     {
//         "items": body.result.data,
//         "itemsCount": body.result["items-left"]
//     }
// }

exports.execQuery = (query, node, msg, requestedColumns) => {

    request.get(getOptions(query), function (error, response, body) {
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
                "items": body.result.data.map(function (item) {
                    var array = {};

                    Object.keys(requestedColumns).forEach(function (key) {
                        // array.push({
                        //     : item[requestedColumns[key]]
                        // })
                        [key] = item[requestedColumns[key]]
                    });

                    return array
                }),
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
}