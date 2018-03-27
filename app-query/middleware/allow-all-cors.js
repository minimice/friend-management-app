'use strict';

module.exports = function allowAllCors(req, res, next) {
    var origin = req.headers["origin"] || "";
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === 'OPTIONS') res.send();
    else next();
}
