const db = require("./db.js");

const gameFunctions = {
    dev_setOrbit: (primaryId) => {},
    dev_setOwner: (ownerId) => {},
    dev_addSatelite: (sateliteId) => console.log(sateliteId),
    getEntityData: (entityId) => {
        return entityId;
    },
    engines_initHyperspace: (entityId, hyperSpaceLane) => {},
    offerTrade: (items, thisEntityId, otherEntityId = undefined) => {
        // returns a tradeOffer uuid. Entities in trade range can accept
        // this trade using acceptTrade
    },
    listTradesInRange: (entityId) => {
        // returns a object of tradeId: trade key list pairs.
    },
    acceptTrade: (tradeId) => {},
    log: (...args) => console.log(...args),
};

module.exports = { gameFunctions };
