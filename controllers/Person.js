const fs = require("fs");
const path = require("path");
const Person = require("../models/Person");
const { filterByAge, filterByLastName, filterByFirstName, filteredOrder } = require("../helpers/sortList");

exports.uploadFile = async (req, res, next) => {
    try {
        const filePath = req.file.path;
        const validPerson = [];
        const invalidPerson = [];

        // Gérer les données du fichier de la requête
        const data = fs.readFileSync(filePath, "utf8");
        const persons = await JSON.parse(data);
        console.log(persons);

        //Créer les listes valide et non valide des personnes
        persons.forEach((person) => {
            if (person.FirstName && person.LastName) {
                validPerson.push(person);
            } else {
                invalidPerson.push(person);
                const logPath = path.join(__dirname, "../logs/errors.log");
                const logMsg = `${new Date().toISOString()} - Erreur pour la personne : ${JSON.stringify(
                    person
                )}\n`;
                fs.appendFileSync(logPath, logMsg);
            }
        });
        console.log("Liste des personnes invalides", invalidPerson);
        console.log("Liste des personnes valides", validPerson);

        // Créer la pagination
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 3;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const personMax = validPerson.length;
        console.log(personMax);

        const totalPages = Math.round(personMax / limit);
        const dataPerson = validPerson.slice(startIndex, endIndex);

        return res
            .status(200)
            .json({ dataPerson, limit: limit, page: `${page}/${totalPages}` });
    } catch (error) {
        console.error(error);
        return res.status(500).json("Erreur serveur");
    }
};

exports.savePerson = async (req, res, next) => {
    try {
        const filePath = req.file.path;
        const validPerson = [];
        const invalidPerson = [];

        // Gérer les données du fichier de la requête
        const data = fs.readFileSync(filePath, "utf8");
        const persons = await JSON.parse(data);
        console.log(persons);

        // Boucle sur la liste
        for (const person of persons) {
            if (person.Age < 40) {
                invalidPerson.push(person);

                // On ajoute une ligne dans le fichier de log
                const logPath = path.join(__dirname, "../logs/errors.log");
                const logMsg = `${new Date().toISOString()} - Erreur pour la personne : ${JSON.stringify(
                    person
                )}\n`;
                fs.appendFileSync(logPath, logMsg);
            } else {
                validPerson.push(person);
                const personDB = new Person({
                    FirstName: person.FirstName,
                    LastName: person.LastName,
                    Age: person.Age,
                });
                // On envoie en base chaque personne ayant un age > 40
                await personDB.save();
            }
        }
        console.log("Liste des personnes valides", validPerson);
        console.log("Liste des personnes invalides", invalidPerson);

        //Création du fichier trié
        const newFilePath = req.body.path || "../output/persons.txt";

        // Tri en fonction de l'age puis du lastName
        validPerson.sort((p1, p2) => {
            if (p1.Age !== p2.Age) {
                return p1.Age - p2.Age;
            }
            if (p1.LastName !== p2.LastName) {
                return p1.LastName.localeCompare(p2.LastName);
            }
            return p1.FirstName.localeCompare(p2.FirstName);
        });

        const filteredData = validPerson
            .map(
                (person) =>
                    `Age: ${person.Age}, Nom de famille: ${person.LastName}, Prénom: ${person.FirstName}`
            )
            .join("\n");

        // On vérifie si le dossier existe avant de le créer
        const dirFile = path.dirname(newFilePath);
        if (!fs.existsSync(dirFile)) {
            fs.mkdirSync(dirFile, { recursive: true });
        }

        // On passe les données de la liste filtrée
        fs.writeFileSync(newFilePath, filteredData, "utf8");
        return res.status(200).json({ validPerson, newFilePath });
    } catch (error) {
        console.log(error);
        return res.status(500).json("Erreur serveur");
    }
};

exports.sortList = async (req, res, next) => {
    try {
        const dataDb = await Person.find();
        const newFile = path.join(__dirname, "../output/sortedPersons.txt");
        const { order } = req.query;

        await filteredOrder(dataDb, order, newFile);
        return res.status(200).json({ file: newFile });
    } catch (error) {
        console.log(error);
        res.status(500).json("Erreur serveur");
    }
};
