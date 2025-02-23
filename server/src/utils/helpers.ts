function filterObjectByKeys(
    obj: Record<any, any>,
    keys: string[]
): Record<any, any> {
    const filteredObject = {};

    if (obj && typeof obj === "object" && Array.isArray(keys)) {
        keys.forEach((key) => {
            if (key in obj) {
                filteredObject[key] = obj[key];
            }
        });
    }

    return filteredObject;
}
