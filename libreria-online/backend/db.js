const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/libreria', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conexión a MongoDB establecida');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
    }
};

module.exports = connectDB;