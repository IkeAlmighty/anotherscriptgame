const db = require("./db.js");

const gameFunctions = {
    dev_setOrbit: (primaryId) => { },
    dev_setOwner: (ownerId) => { },
    dev_addSatelite: (sateliteId) => console.log(sateliteId),
    getEntityData: (entityId) => {
        return entityId;
    },
    log: (...args) => console.log(...args),
};



module.exports = { gameFunctions };
