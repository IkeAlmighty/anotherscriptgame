function auth(authCode) {
    return true; //TODO: implement
}

function applyPermissions(owner, functions) {
    const allowedFunctions = {};

    for (let key in functions) {
        if (owner !== 'dev') {
            if (key.substring(0, 4) !== 'dev_') {
                allowedFunctions[key] = functions[key];
            }
        } else {
            allowedFunctions[key] = functions[key];
        }
    }

    return allowedFunctions;
}

module.exports = { applyPermissions };
