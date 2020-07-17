const { response } = require("express");
const User = require("../models/user");
const cryptoPaswword = require("bcryptjs"); //importando el encriptador de contrasenoa de una sola via
const { getJsonWebToken } = require("../helpers/jasonWebToken");

const loginUser = async (request, response = response) => {
  const { email, password } =  request.body;
  try {
    const userDb = await User.findOne({ email });
    
    if (!userDb) {
      //checking if email is fine
      return  response.status(400).json({
        ok: false,
        msg: "Email  not valid",
      });
    }

    const validPassword =await  cryptoPaswword.compareSync(password, userDb.password); //comparando contrasena del usuario con contrasena
    //existente para el mismo en la base de dtaos

    if (!validPassword) {
      //checking if password is fine
      return response.status(400).json({
        ok: false,
        msg: " password  not valid",
      });
    }
    const token =await getJsonWebToken(userDb.id)

    response.status(201).json({
      //se devuelve un esstado positivo sobre la modificacion del usuario del usuario
      ok: true,
      msg: "Ok logged",
      token
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      msg: "Unexpected error .Check logs",
    });
  }
};
module.exports = { loginUser };
