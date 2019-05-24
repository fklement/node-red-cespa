module.exports = function (RED) {
    function LonLat(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {

        });
    }
    RED.nodes.registerType("lon-lat", LonLatNode);
}