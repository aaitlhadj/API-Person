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

// exports.filteredOrder = async (persons, order, filePath) => {
//     let filteredData = persons;

//     for (let choice of order) {
//         switch (choice) {
//             case "age":
//                 filterByAge(filteredData);
//                 break;
//             case "lastName":
//                 filterByLastName(filteredData);
//                 break;
//             case "firstName":
//                 filterByFirstName(filteredData);
//                 break;
//             default:
//                 console.log(`Sous-traitement inconnu : ${choice}`);
//         }
//     }

//     const dataFiltered = JSON.stringify(persons, null, 2);
//     fs.writeFileSync(filePath, dataFiltered, "utf8");

//     return filteredData;
// };

exports.filteredOrder = (order) => {
    return (p1, p2) => {
        for (const critere of order) {
            if (!(critere in p1) || !(critere in p2)) continue;

            if (p1[critere] !== p2[critere]) {
                return p1[critere] > p2[critere] ? 1 : -1;
            }
        }
        return 0;
    };
}