const dayjs = require('dayjs');
const express = require('express')
const NodeCache = require("node-cache");
const myCache = new NodeCache({
    stdTTL: 60,
    checkperiod: 60
});
const app = express()
const port = 3000
let validCities = ["stockholm", "örebro"];

// mock of costly api call
const weatherInCity = async (city) => {
    console.log("weatherInCity", city);

    if (city == "stockholm") {
        return {
            city: "stockholm",
            time: dayjs("2021-04-21T09:42:22Z").unix(),
            temperature: 13.4,
            humidity: 38.2,
            wind: 4.1,
            precipitation: 1.2
        };
    } else if (city == "örebro") {
        return {
            city: "örebro",
            time: dayjs("2021-04-21T09:42:22Z").unix(),
            temperature: 10.1,
            humidity: 23.0,
            wind: 2.0,
            precipitation: 2.1
        };
    } else {
        return null;
    }
};

app.get('/', async (req, res) => {
    let city = req.query.city;

    if (!validCities.includes(city)) {
        return res.status(400).send("invalid city");
    }

    let cacheData = myCache.get(city);
    let returnData = cacheData;

    if (!cacheData) {
        let freshData = await weatherInCity(city);
        myCache.set(city, freshData);
        returnData = freshData;
    }

    return res.json(returnData);
})

app.listen(port, () => {
    console.log(`http://localhost:${port}?city=stockholm`);
    console.log(`http://localhost:${port}?city=örebro`);
})