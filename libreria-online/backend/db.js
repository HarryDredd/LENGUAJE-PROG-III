const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/libreria', {
            useNewUrlParser: true,    // Corregido: "useNewUrlParser" en lugar de "usernewurlparser"
            useUnifiedTopology: true, // Corregido: "useUnifiedTopology" en lugar de "useunifiedtopology"
        });
        console.log('Conexión a MongoDB establecida');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
    }
};

module.exports = connectDB;