const express = require('express');
const Libro = require('./models/Libro');
const connectDB = require('./db');
const cors = require('cors');

const app = express();
const PORT =5000;

connectDB();

app.use(express.json());
app.use(cors());

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

app.listen(PORT, () =>{
    console.log('Servidor backend corriendo en http://localhost:${PORT}');
});
