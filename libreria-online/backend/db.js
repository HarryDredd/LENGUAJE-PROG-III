const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/libreria', {

        });
        console.log('Conexión a MongoDB establecida');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
    }
};

module.exports = connectDB;