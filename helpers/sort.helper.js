module.exports.sortObject = (obj) => {
    let sorted = {};
    let keys = Object.keys(obj).sort();

    for (let key of keys) {
        sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
    }

    return sorted;
};
