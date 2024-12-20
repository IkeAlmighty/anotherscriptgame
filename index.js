const net = require("net");
const ivm = require("isolated-vm");
const { devFunctions, playerFunctions } = require("./game-functions.js");
const auth = require("./game-auth.js");
const db = require("./db.js");

const sandboxes = {};

const MAX_RUNTIME_MS = 100;

// Sandbox function constructor
function Sandbox(id, code) {
    this.isolate = new ivm.Isolate({ memoryLimit: 1024 });
    this.code = code;
    this.id = id;
    this.owner = db.getOwner(this.id);

    this.run = () => {
        const context = this.isolate.createContextSync();

        Object.keys(playerFunctions).forEach((key) => {
            context.global.setSync(key, playerFunctions[key]);
        });

        if (this.owner === "dev") {
            Object.keys(devFunctions).forEach((key) => {
                context.global.setSync(key, devFunctions[key]);
            });
        }

        context.evalSync(this.code, { timeout: MAX_RUNTIME_MS });
    };
}

// SERVER
const server = net.createServer((socket) => {
    console.log("client connected");

    socket.on("data", (data) => {
        console.log(`recieved: "${data}"`);

        const dataJSON = JSON.parse(data);
        const { entityId, code } = dataJSON;

        if (!dataJSON.code || !dataJSON.entityId) {
            // throw error
            socket.write(
                `UNDEFINED ERROR: { entityId: ${entityId}, code: ${code} }`
            );
            return;
        }

        // TODO: authenticate

        // delete old isolate:
        if (sandboxes[entityId]) {
            const sandbox = sandboxes[entityId];
            sandbox.isolate.dispose();
        }

        // construct new isolate and the global script entry
        sandboxes[entityId] = new Sandbox(entityId, code);

        socket.end();
    });

    socket.on("end", () => {
        console.log("disconnected from a client.");
    });

    socket.on("error", (err) => {
        console.log("ts:", Date.now(), err);
    });
});

const port = process.env.PORT || 8080;

server.listen(port, () => {
    console.log(`starting net server on port ${port}`);
});

function calculateCycleRate() {
    const maxTime = Object.keys(sandboxes).length * MAX_RUNTIME_MS;
    if (maxTime > 500) return maxTime;
    return 500;
}

setInterval(() => {
    for (let id in sandboxes) {
        sandboxes[id].run();
    }
}, calculateCycleRate());
