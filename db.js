// TODO: replace with real database:

module.exports = {
    world: { x: 1 },
    getOwner: (id) => {
        console.log(id);
        if (id == "3000") return "dev";
        else return id;
    },
};
