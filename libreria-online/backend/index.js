const express = require('express');
const Libro = require('./models/Libro');
const connectDB = require('./db');
const cors = require('cors');

const app = express();
const PORT =5001;

connectDB();

app.use(express.json());
app.use(cors());

//GET /
app.get('/', async (req, res) => {
    try {
        // Obtener los libros guardados en MongoDB
        const libros = await Libro.find().limit(10); // Limita a 10 libros

        const mensaje = `
            <html>
                <head>
                    <title>Backend de la Librería</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                            padding: 0;
                            background-color: #f4f4f9;
                            color: #333;
                        }
                        h1 {
                            color: #4CAF50;
                        }
                        ul {
                            list-style-type: none;
                            padding: 0;
                        }
                        li {
                            background: #fff;
                            margin: 10px 0;
                            padding: 10px;
                            border-radius: 5px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        }
                        a {
                            color: #4CAF50;
                            text-decoration: none;
                        }
                        a:hover {
                            text-decoration: underline;
                        }
                    </style>
                </head>
                <body>
                    <h1>¡Bienvenido al backend de la librería!</h1>
                    <p>Esta es la API para buscar y guardar libros en MongoDB.</p>
                    <h2>Últimos libros guardados:</h2>
                    <ul>
                        ${libros.map(libro => `
                            <li>
                                <strong>${libro.title}</strong> - ${libro.author.join(', ')} (${libro.first_publish_year})
                            </li>
                        `).join('')}
                    </ul>
                </body>
            </html>
        `;
        res.send(mensaje);
    } catch (error) {
        console.error('Error al obtener libros:', error);
        res.status(500).send('Error al cargar la página');
    }
});

//ruta para guardar libros en mongo
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

// GET /libros para obtener todos los libros
app.get('/libros', async (req, res) => {
    try {
        const libros =await Libro.find();
        res.json(libros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /libros/:id obetner un liro por ID
app.get('/libros/:id', async(req, res) => {
    try {
        const libro = await Libro.findById(req.params.id);
        res.json(libro);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

// PUT /libros/:id - Actualizar un libro por ID
app.put('/libros/:id', async (req, res) => {
    try {
        const libroActualizado =await Libro.findByIdAndUpdate(req.params.id, req.body, { 
new: true });
        res.json(libroActualizado);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

// DELETE /libros/:id - Eliminar un libro por ID
app.delete('/libros/:id', async (req, res) => {
    try {
        await Libro.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});


app.listen(PORT, () =>{
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});


//ubicar la terminal en libreria-online ejecutar npm start para el servidor de react
//apagar localhost con crtl + c en la terminal y encender con node index.js ubicando la terminal en la carpeta 