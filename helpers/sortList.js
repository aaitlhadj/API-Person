const fs = require("fs");

const filterByAge = (persons) => {
    persons.sort((p1, p2) => {
        return p1.Age - p2.Age;
    });
};

const filterByLastName = (persons) => {
    persons.sort((p1, p2) => {
        return p1.LastName.localeCompare(p2.LastName);
    });
};

const filterByFirstName = (persons) => {
    persons.sort((p1, p2) => {
        return p1.FirstName.localeCompare(p2.FirstName);
    });
};

exports.filteredOrder = async (persons, order, filePath) => {
    let filteredData = persons;

    for (let choice of order) {
        switch (choice) {
            case "a":
                filterByAge(filteredData);
                break;
            case "b":
                filterByLastName(filteredData);
                break;
            case "c":
                filterByFirstName(filteredData);
                break;
            default:
                console.log(`Sous-traitement inconnu : ${choice}`);
        }
    }

    const dataFiltered = JSON.stringify(persons, null, 2);
    fs.writeFileSync(filePath, dataFiltered, "utf8");

    return filteredData;
};
