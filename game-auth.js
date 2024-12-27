function authorize(authCode) {
    return true; //TODO: implement
}

function applyPermissions(owner, functions) {
    const allowedFunctions = {};

    for (let key in functions) {
        if (owner !== "dev") {
            // if the owner is not a dev, then only add the function
            // if they function is a non-dev function.
            if (key.substring(0, 4) !== "dev_") {
                allowedFunctions[key] = functions[key];
            }
        } else {
            // if the owner is 'dev', then always add the function
            allowedFunctions[key] = functions[key];
        }
    }

    return allowedFunctions;
}

module.exports = { applyPermissions, authorize };
