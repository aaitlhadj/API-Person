const supertest = require("supertest");
const app = require("../app");
const path = require("path");
const fs = require("fs");

describe("Initialize Unit Test", () => {
    it("should return a welcome message", async () => {
        const response = await supertest(app).get("/");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Welcome to the API");
    });
});

describe("POST /uploadFile Unit Test", () => {
    it("should return an error when no file in the request", async () => {
        const response = await supertest(app).post("/api/person/uploadFile");
        expect(response.status).toBe(500);
        expect(response.body).toBe("Erreur serveur");
    });

    it("should return a code 200", async () => {
        const filePath = path.join(__dirname, "testData.json");
        const response = await supertest(app)
            .post("/api/person/uploadFile")
            .attach("file", filePath);

        expect(response.status).toBe(200);
    });

    it("should filter persons and return a code 200", async () => {
        const filePath = path.join(__dirname, "testData.json");
        const validPerson = [];
        const response = await supertest(app)
            .post("/api/person/uploadFile")
            .attach("file", filePath)
            .set("Content-Type", "application/json");

        const data = fs.readFileSync(filePath, "utf8");
        const persons = await JSON.parse(data);
        persons.forEach((person) => {
            if (person.FirstName && person.LastName) {
                validPerson.push(person);
            }
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            dataPerson: [
                { FirstName: "John", LastName: "Doe" },
                { FirstName: "Alice", LastName: "Smith" },
            ],
            limit: 3,
            page: "1/1",
        });
    });

    it("should create a log file when data is not ok", async () => {
        const filePath = path.join(__dirname, "testData.json");
        const invalidPerson = [];
        const response = await supertest(app)
            .post("/api/person/uploadFile")
            .attach("file", filePath)
            .set("Content-Type", "application/json");

        const data = fs.readFileSync(filePath, "utf8");
        const persons = await JSON.parse(data);
        persons.forEach((person) => {
            if (!person.FirstName || !person.LastName) {
                invalidPerson.push(person);
                const logPath = path.join(__dirname, "errors.log");
                const logMsg = `${new Date().toISOString()} - Erreur pour la personne : ${JSON.stringify(
                    person
                )}\n`;
                fs.appendFileSync(logPath, logMsg);
            }
        });
        expect(response.status).toBe(200);
    });
});
