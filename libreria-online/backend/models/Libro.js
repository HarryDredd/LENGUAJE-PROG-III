const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Título del libro (obligatorio)
    author: { type: [String], default: [] }, // Autor del libro (puede ser un array)
    first_publish_year: { type: Number }, // Año de publicación
    edition_count: { type: Number }, // Número de ediciones
    cover_img: { type: String }, // Ruta de la portada
});

const Libro = mongoose.model('Libro', libroSchema);

module.exports = Libro;