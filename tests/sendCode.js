const { Socket } = require("net");
const client = new Socket();
client.setEncoding("utf8");

client.connect(8080, "localhost", () => {
    console.log("connected to localhost!");
});

client.on("data", (data) => console.log(data));

client.write(`{ "entityId": "test", "code": "log('hello');" }`);
