const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_CNN);
        //     {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        //     // useCreateIndex: true,
        // }


        console.log('DB Online');
    } catch {
        console.log(error);
        throw new Error('Error en la base de datos - Contacte con el Administrador');
    }
}


module.exports = {
    dbConnection
}