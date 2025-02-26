const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const Libro = require('./models/Libro');
const connectDB = require('./db');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Conectar a MongoDB
connectDB();

// Middleware para parsear JSON y habilitar CORS
app.use(express.json());
app.use(cors());

// Configuración de Multer para guardar imágenes en la carpeta "uploads"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Las imágenes se guardarán en la carpeta "uploads"
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para el archivo
    },
});

const upload = multer({ storage });
//ruta para guardar multiples libros
app.post('/guardar-libros', async (req, res) => {
    const { libros } = req.body;

    if (!libros || libros.length === 0) {
        return res.status(400).json({ mensaje: 'No se proporcionaron libros para guardar'

});
    }

    try {
        const librosGuardados = await Promise.all(
            libros.map(async (libro) => {
                const nuevolibro = new Libro(libro);
                return await nuevolibro.save();
            })
        );

        res.json({ mensaje: 'Libros guardados correctamente', libros: librosGuardados });
    } catch (error) {
        console.error('Error al guardar libros', error);
        res.status(500).json({ mensaje: 'Error al guardar libros'});
    }
});

// Ruta para crear un nuevo libro
app.post('/libros', upload.single('cover'), async (req, res) => {
    try {
        const { id, title, author, first_publish_year, edition_count } = req.body;

        // Si no se subió una imagen, usar una imagen por defecto
        const cover_img = req.file ? `http://localhost:5001/uploads/${req.file.filename}` : "";

        const nuevoLibro = new Libro({
            id,
            title,
            author,
            first_publish_year,
            edition_count,
            cover_img,
        });

        await nuevoLibro.save();
        res.status(201).json(nuevoLibro);
    } catch (error) {
        console.error('Error al crear el libro:', error);
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener todos los libros
app.get('/libros', async (req, res) => {
    try {
        const libros = await Libro.find();
        const librosConPortadas = libros.map((libro) => {
            return {
                ...libro._doc,
                cover_img: libro.cover_img || "http://localhost:5001/uploads/cover_not_found.jpg", // Asigna una imagen por defecto si no hay portada
            };
        });
        res.json(librosConPortadas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener un libro por su ID personalizado
app.get('/libros/id/:id', async (req, res) => {
    try {
        const libro = await Libro.findOne({ id: req.params.id });
        if (!libro) {
            return res.status(404).json({ mensaje: 'Libro no encontrado' });
        }
        res.json(libro);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para actualizar un libro (incluyendo la portada)
app.put('/libros/:id', upload.single('cover'), async (req, res) => {
    try {
        const libro = await Libro.findById(req.params.id);
        if (!libro) {
            return res.status(404).json({ mensaje: 'Libro no encontrado' });
        }

        // Actualiza solo los campos proporcionados
        libro.id = req.body.id; //actualizar id  tambien
        libro.title = req.body.title || libro.title;
        libro.author = req.body.author || libro.author;
        libro.first_publish_year = req.body.first_publish_year || libro.first_publish_year;
        libro.edition_count = req.body.edition_count || libro.edition_count;

        // Si se subió una nueva imagen, actualiza la portada
        if (req.file) {
            libro.cover_img = `http://localhost:5001/uploads/${req.file.filename}`;
        }

        await libro.save();
        res.json(libro);
    } catch (error) {
        console.error('Error al actualizar el libro:', error);
        res.status(500).json({ error: error.message });
    }
});

// Ruta para eliminar un libro
app.delete('/libros/:id', async (req, res) => {
    try {
        await Libro.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Servir archivos estáticos desde la carpeta "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});