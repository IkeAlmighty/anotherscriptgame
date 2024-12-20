const db = require("./db.js");

const devFunctions = {
    setOrbit: (primaryId) => {},
    setOwner: (ownerId) => {},
    addSatelite: (sateliteId) => {},
    getWorld: () => db.world,
};

const playerFunctions = {
    getEntityData: (entityId) => {
        return entityId;
    },
    log: (...args) => console.log(...args),
};

module.exports = { devFunctions, playerFunctions };
