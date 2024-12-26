// TODO: replace with real database:

const collection = {
    "54861c87-f5ea-40d4-b658-9b09de47e4fd": {
        owner: "dev",
        satelites: ["54861c87-f5ea-40d4-b658-9b09de47e4fd"],
    },
    "ac2469b7-7ea6-4edc-abb3-6c20b8f72079": {
        owner: "ikealmighty",
    },
    test: {
        owner: "dev",
        satelites: [
            "54861c87-f5ea-40d4-b658-9b09de47e4fd",
            "ac2469b7-7ea6-4edc-abb3-6c20b8f72079",
        ],
    },
};

module.exports = {
    collection: () => collection,
};
