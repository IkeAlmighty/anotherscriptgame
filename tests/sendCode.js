const { Socket } = require("net");

const client = new Socket();
client.setEncoding("utf8");

client.connect(8080, "localhost", () => {
    console.log("connected to localhost!");
});

client.on("data", (data) => console.log(data));

client.write(`{ "entityId": "54861c87-f5ea-40d4-b658-9b09de47e4fd", "code": "dev_addSatelite('hello');" }`);
