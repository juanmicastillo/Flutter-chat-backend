const { response } = require("express");
const bcrypt = require('bcryptjs');
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
const router = require("../routes/auth");


const crearUsuario = async(req, res = response) => {

    // destructuración 
    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email: email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado', // si estan intentando hackear igual mostrar otro tipo de error....
            })
        }

        const usuario = new Usuario(req.body);


        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        await usuario.save();


        // Generar mi JWT JSON web Token
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });



    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Pongase en contacto con el administrador'
        })

    }


}


const login = async(req, res = response) => {

    const { email, password } = req.body;


    try {

        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado' // no dar pistas xDDD
            })
        }

        // Validar el password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'La Contraseña no es válida ' // no dar pistas xDDD
            });
        }


        // Generar el JWT

        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    } catch (error) {

        console.log(error);
        return res.status(500)({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}


const renewToken = async(req, res = response) => {

    // Leer UID 
    const uid = req.uid;
    // Generar el JWT desde el UID
    const token = await generarJWT(uid);
    // Obtener el usuario por el UID, USuario.findById...
    const usuario = await Usuario.findById(uid);


    res.json({
        ok: true,
        usuario,
        token
    })
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}