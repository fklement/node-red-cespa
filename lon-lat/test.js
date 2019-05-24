const fs = require('fs'),
    path = require('path'),
    certFile = path.resolve(__dirname, '../ssl/RESTTEST_cert.pem'),
    keyFile = path.resolve(__dirname, '../ssl/RESTTEST_key.pem'),
    request = require('request');

const query = {
    "db": "tires",
    "schema": "hackaton",
    "table": "accgyr",
    "where": {
        "DID": {
            "=": "RESTTEST"
        }
    }
}

var buff = new Buffer(JSON.stringify(query)).toString("base64");

console.log(query.toString("base64"))

const options = {
    url: "https://ctpwyd.conti.de:443/data?q=" + buff,
    cert: fs.readFileSync(certFile),
    key: fs.readFileSync(keyFile)
};

request.get(options, function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
});