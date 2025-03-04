import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import Libro from './models/Libro.js';
import cors from 'cors';
import fs from 'fs';
import prometheus from 'prom-client';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';


const app = express();
const PORT = 5001;

// Conectar a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/libreria', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conexión a MongoDB establecida✅');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
    }
};

// Conectar a MongoDB
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


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

//URL de la api de open LIbrary
const OPEN_LIBRARY_URL = "https://openlibrary.org/search.json?title=";
//funcion para buscar libros en openlibrary
const fetchBooks = async (searchTerm) => {
    try {
        const response = await fetch(`${OPEN_LIBRARY_URL}${searchTerm}`);
        const data = await response.json();
        const { docs } = data;

        if (docs) {
            return docs.slice(0, 10).map((bookSingle) => {
                const { key, author_name, cover_i, edition_count,
                     first_publish_year, title } = bookSingle;

                return {
                    id: key,
                    author: author_name,
                    cover_id: cover_i,
                    edition_count: edition_count,
                    first_publish_year: first_publish_year,
                    title: title
                };
            });
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error al buscar libros:', error);
        return [];
    }
};

// Función para guardar libros en MongoDB
const guardarLibrosEnBackend = async (libros) => {
    try {
        const librosGuardados = await Promise.all(
            libros.map(async (libro) => {
                const nuevoLibro = new Libro({
                    id: libro.id,
                    title: libro.title,
                    author: libro.author,
                    first_publish_year: libro.first_publish_year,
                    edition_count: libro.edition_count,
                    cover_id: libro.cover_id,
                });
                 const libroGuardado = await nuevoLibro.save();
                 console.log(`Libro guardado:"${libroGuardado.title}"✅`);

                 return libroGuardado;
            })
        );
        
    } catch (error) {
        console.error('Error al guardar libros en MongoDB:', error);
    }
};

// Función para obtener libros aleatorios de la API y guardarlos en MongoDB
const obtenerYGuardarLibrosAleatorios = async () => {
    try {
        // Términos de búsqueda aleatorios (puedes cambiarlos)
        const terminosBusqueda = ["fiction", "science", "history", "technology", "philosophy"];
        const terminoAleatorio = terminosBusqueda[Math.floor(Math.random() * terminosBusqueda.length)];

        // Obtener libros de la API
        const libros = await fetchBooks(terminoAleatorio);

        // Guardar libros en MongoDB
        if (libros.length > 0) {
            await guardarLibrosEnBackend(libros);
            console.log(`Se guardaron ${libros.length} libros en la base de datos.✅`);
        } else {
            console.log('No se encontraron libros para guardar.');
        }
    } catch (error) {
        console.error('Error al obtener y guardar libros:', error);
    }
};



// Crear métricas de Prometheus
const httpRequestDurationMicroseconds = new prometheus.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duración de las solicitudes HTTP en ms',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.1, 5, 15, 50, 100, 500],
});

// Middleware para medir el tiempo de respuesta
app.use((req, res, next) => {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
        end({ method: req.method, route: req.route?.path || req.url, status: res.statusCode });
    });
    next();
});
//
// Ruta para exponer métricas de Prometheus
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', prometheus.register.contentType);
    res.end(await prometheus.register.metrics());
});

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
                const nuevolibro = new Libro({
                    id: libro.id,
                    title: libro.title,
                    author: libro.author,
                    first_publish_year: libro.first_publish_year,
                    edition_count: libro.edition_count,
                    cover_id: libro.cover_id,
                    cover_img: libro.cover_img || "",
                });
                return await nuevolibro.save();
            }) 
        );

        res.json({ mensaje: 'Libros guardados correctamente', libros: librosGuardados });
    } catch (error) {
        console.error('Error al guardar libros', error);
        res.status(500).json({ mensaje: 'Error al guardar libros'});
    }
});

// Ruta para obtener todos los libros
app.get('/libros', async (req, res) => {
    try {
        const libros = await Libro.find();
        const librosConPortadas = libros.map((libro) => {
            // Si no hay portada personalizada ni cover_id, usar una imagen por defecto
            const cover_img = libro.cover_img 
                ? libro.cover_img 
                : libro.cover_id 
                    ? `https://covers.openlibrary.org/b/id/${libro.cover_id}-L.jpg` 
                    : "http://localhost:5001/uploads/cover_not_found.jpg";

            return {
                ...libro._doc,
                cover_img: cover_img,
            };
        });
        res.json(librosConPortadas);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

// Ruta para buscar libros
app.get('/buscar', async (req, res) => {
    const searchTerm = req.query.q; // Obtener el término de búsqueda desde la query string

    if (!searchTerm) {
        return res.status(400).json({ mensaje: 'No se proporcionó un término de búsqueda' });
    }

    try {
        const libros = await fetchBooks(searchTerm); // Usar la función fetchBooks para buscar en la API
        await guardarLibrosEnBackend(libros);
        res.json({ libros });
    } catch (error) {
        console.error('Error al buscar libros:', error);
        res.status(500).json({ mensaje: 'Error al buscar libros' });
    }
});


// Ruta para obtener un libro por su ID personalizado
app.get('/libros/:id', async (req, res) => {
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

// esta sirve para Ruta para eliminar la imagen de un libro
app.put('/libros/:id/remove-cover', async (req, res) => {
    try {
        const libro = await Libro.findById(req.params.id);
        if (!libro) {
            return res.status(404).json({ mensaje: 'Libro no encontrado' });
        }

        // Eliminar la imagen actual (si existe claro)
        if (libro.cover_img) {
            const imagePath = path.join(__dirname, libro.cover_img);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Eliminar la imagen del servidor
            }
        }
        // Establecer la imagen predeterminada
        libro.cover_img = "http://localhost:5001/uploads/cover_not_found.jpg"; // Ruta de la imagen predeterminada
        await libro.save();

        res.json(libro);
    } catch (error) {
        console.error('Error al eliminar la imagen:', error);
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

app.listen(PORT, async () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}
`);
    await obtenerYGuardarLibrosAleatorios();
});
// Obtener y guardar libros automáticamente al iniciar el servidor
