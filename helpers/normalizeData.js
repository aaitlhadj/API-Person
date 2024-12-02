const fs = require("fs");
const path = require('path');

const normalizeKeys = (data) => {
    const keyMapping = {
        firstname: "FirstName",
        Firstname: "FirstName",
        firstName: "FirstName",
        first_name: "FirstName",
        lastname: "LastName",
        Lastname: "LastName",
        lastName: "LastName",
        last_name: "LastName",
        age: "Age",
    };
    
    return data.map((item) => {
        const normalizedItem = {};
        for (const key in item) {
            const normalizedKey = keyMapping[key.toLowerCase()] || key;
            normalizedItem[normalizedKey] = item[key];
        }
        return normalizedItem;
    });
};

exports.normalizeData = (filePath) => {
    try {
        const rawData = fs.readFileSync(filePath, "utf8");
        const jsonData = JSON.parse(rawData);
        const normalizedData = normalizeKeys(jsonData);

        fs.writeFileSync(
            filePath,
            JSON.stringify(normalizedData, null, 2),
            "utf8"
        );

        return normalizedData;
    } catch (error) {
        console.log(error.message);
    }
};

exports.addLogs = (data) => {
    const logPath = path.join(__dirname, "../logs/errors.log");
    const logMsg = `${new Date().toISOString()} - Erreur pour la personne : ${JSON.stringify(
        data
    )}\n`;
    fs.appendFileSync(logPath, logMsg);
};
