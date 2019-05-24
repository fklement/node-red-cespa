const fs = require('fs'),
    path = require('path'),
    certFile = path.resolve(__dirname, 'ssl/RESTTEST_cert.pem'),
    keyFile = path.resolve(__dirname, 'ssl/RESTTEST_key.pem');

// Set our values that are needed to connect to the RESTapi via SSL/TLS
exports.cert = fs.readFileSync(certFile);
exports.key = fs.readFileSync(keyFile);

// const options = {
//     url: scotify.execQuery(query),
//     cert: scotify.cert,
//     key: scotify.key
// };

// Decodes the given JSON query object to an base64 string and concatinates it with our url
exports.execQuery = (queryObject) => "https://ctpwyd.conti.de:443/data?q=" + new Buffer.from(JSON.stringify(queryObject)).toString("base64");

// Returns the difference of our current timestamp and the query timestamp as an integer
exports.calcTimeDiff = (currentTimestamp, queryTimestamp) => parseInt(currentTimestamp - (queryTimestamp * 1000000));

// exports.composePayload = (body) => {
//     {
//         "items": body.result.data,
//         "itemsCount": body.result["items-left"]
//     }
// }