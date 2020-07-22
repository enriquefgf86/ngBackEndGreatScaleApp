const { response } = require("express");
const User = require("../models/user");
const cryptoPaswword = require("bcryptjs"); //importando el encriptador de contrasenoa de una sola via
const { getJsonWebToken } = require("../helpers/jasonWebToken");

const { googleVerifyToken } = require("../helpers/googleverifying"); //importando el helper necesario para
//la confirmacion de token emitido por google

const loginUser = async (request, response = response) => {
  const { email, password } = request.body;
  try {
    const userDb = await User.findOne({ email });

    if (!userDb) {
      //checking if email is fine
      return response.status(400).json({
        ok: false,
        msg: "Email  not valid",
      });
    }

    const validPassword = await cryptoPaswword.compareSync(
      password,
      userDb.password
    ); //comparando contrasena del usuario con contrasena
    //existente para el mismo en la base de dtaos

    if (!validPassword) {
      //checking if password is fine
      return response.status(400).json({
        ok: false,
        msg: " password  not valid",
      });
    }
    const token = await getJsonWebToken(userDb.id);//generando jason web token 

    response.status(201).json({
      //se devuelve un esstado positivo sobre la modificacion del usuario del usuario
      ok: true,
      msg: "Ok logged",
      token,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      msg: "Unexpected error .Check logs",
    });
  }
};
const loginUserGoogle = async (request, response = response) => {
  const googleToken = request.body.token;

  try {
    const { name, email, picture } = await googleVerifyToken(googleToken); //all aplicar la funcion
    //kelper de googleVerifyToken, a la misma es necesario pasarle un parametro  que endria e el
    //requestbody del usuario.Por default dicho token propiciado por google traeria muchos items
    //entre ellos 3 constantes que serian de mucha importancia en nuestro proceso, de ahi que en vez de
    //traer todo el token en general , se procederia a desagregarlo en varias de los items
    //contantes que el mismo tiene{name,email,picture}, y trabajar directamente con esos elementos

    const userDb = await User.findOne({ email });
    let user;

    if (!userDb) {
      user = new User({
        name: name,
        img: picture,
        email: email,
        password: "ddfgfgfggg",
        googleToken: true,
      });
    }else{
      user=userDb;
      user.google=true 
    }
    await user.save();

    const token = await getJsonWebToken(user.id);//generando jason web token 


    response.status(201).json({
      //se devuelve un esstado positivo sobre la modificacion del usuario del usuario
      ok: true,
      msg: "Ok Google logged",
      name,
      email,
      picture,
      token
    }); //si la respuesta es positiva y el token suministrado es correcto , entonces se procederia
    //adar uun mensaje en donde se exlica el ok de la respuesta asi como el despliegue de todas las
    //constantes previamente desagregadas del token(email,name ,picture) propias por default de dicho
    //token emitido por google
  } catch (error) {
    return response.status(400).json({
      //se devuelve un esstado positivo sobre la modificacion del usuario del usuario
      ok: false,
      msg: "Token isnt correct",
    });
  }
};
module.exports = { loginUser, loginUserGoogle };
