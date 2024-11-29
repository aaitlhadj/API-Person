const mongoose = require('mongoose');

const personSchema = mongoose.Schema({
    FirstName: { type: String, default: "Inconnu" },
    LastName: { type: String, default: "Inconnu" },
    Age: { type: Number }
}, {
    versionKey: false
})

module.exports = mongoose.model('Person', personSchema);