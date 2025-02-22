const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
    id: { type: String, required: true },
    author: { type: [String], default: [] },
    cover_id: { type: String },
    edition_count: { type: Number },
    first_publish_year: { type: Number },
    title: { type: String, required: true },
})

const Libro = mongoose.model('Libro', libroSchema);

module.exports = Libro;