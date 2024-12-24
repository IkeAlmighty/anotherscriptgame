const net = require("net");
const ivm = require("isolated-vm");
const { gameFunctions } = require("./game-functions.js");
const auth = require("./game-auth.js");
const db = require("./db.js");

const sandboxes = {};

const MAX_RUNTIME_MS = 100;

// Sandbox function constructor
function Sandbox(id, code) {
    this.isolate = new ivm.Isolate({ memoryLimit: 1024 });
    this.code = code;
    this.id = id;
    this.owner = db.collection()[this.id]?.owner;

    this.run = () => {
        const context = this.isolate.createContextSync();

        const allowedFunctions = auth.applyPermissions(this.owner, gameFunctions);

        Object.keys(allowedFunctions).forEach((key) => {
            context.global.setSync(key, allowedFunctions[key]);
        });

        // TODO: consider whether it matters if scripts are ran at the same time.
        // context.eval might be just as good
        context.evalSync(this.code, { timeout: MAX_RUNTIME_MS });
    };

    this.dispose = (error) => {
        if (error) console.log(error); // TODO: print this to a entity specific log

        this.isolate.dispose();
    }
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

// calculate how long it takes to run every script one after another.
// Returns 500 as a minimum
function calculateCycleRate() {
    const maxTime = Object.keys(sandboxes).length * MAX_RUNTIME_MS;
    if (maxTime > 500) return maxTime;
    return 500;
}

// run each sandbox's code synchronously.
setInterval(() => {
    for (let id in sandboxes) {
        try {
            sandboxes[id].run();
        } catch (error) {
            sandboxes[id].dispose(error);
            delete sandboxes[id];
        }
    }
}, calculateCycleRate());
