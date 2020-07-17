var User = require("../models/user");
// const {getJsonWebToken}=require('../helpers/jasonWebToken')

const { response } = require("express"); //importando response de express que basicamente seria una ayuda para saber
//posibles anotaciones necesarias que por ayuda dicho plugin trigerizan

const cryptoPaswword = require("bcryptjs"); //importando el encriptador de contrasenoa de una sola via
const {getJsonWebToken} = require("../helpers/jasonWebToken");

const getAllUsers = async (request, response, next) => {
  const allUsers = await User.find({}, "name email role google img");

  response.status(201).json({
    ok: true,

    allUsers,

    userToken: request.user,
  });
};

//========================================================================================
//Creando el usuario  controller
//=====================================================================================
const createAUser = async (request, response, next) => {
  const { name, email, password } = request.body; //creandose un set de constantes que representarian
  //items del user model(email,name....), todo este
  //se le asigana el respnse que treria el bdoy en el request

  const user = new User(request.body); //vease entonces que se declara una variable llamada user a la cual se le asigna
  //el valor de la inicializacion de un nuevo User (calse modelo del user)pasando
  //sele como parametro el request body previamente asignado a las constantes
  //email,name,y password

  try {
    const existingEmail = await User.findOne({ email }); //antes de entrar en la logica se procede a determinar
    //si existe agun correo que iguale al que se pretende crear
    //junto con el usuario

    if (existingEmail) {
      //se retorna una condicion que especifica que de exitir dicho email se debe retornar un error
      return response.status(500).json({
        ok: false,
        msg: "Email Exists, cant proceed",
      });
    }

    const salt = cryptoPaswword.genSaltSync();
    user.password = cryptoPaswword.hashSync(password, salt); //creandose una variable a la cual se le asigna como valor la
    //importacion del encriptador de contrasenas asi como una de sus dependenciasgenSaltSync(), para entonces luego acceder
    //a la variable user  de tipo User, y atraves de ella a una de sus items(password)...asignandosele  entonces el encriptado
    //(salt) como tal a ese parametro (password)

    
    await user.save(); //se salva la variable de tipo user con el esquema de User  en mongo

    const token =await getJsonWebToken(user.id);//generando el token para el usuario una vez creado utilizando 
    //como parametro de generacion su id


    await response.status(201).json({
      //se devuelve un esstado positivo sobre la creacion del usuario
      ok: true,
      user,
      token,
    });
  } catch (error) {
    //de lo contrario entonces en este catch se devolveria unu error
    console.log(error);
    response.status(500).json({
      ok: false,
      msg: "Unexpected error .Check logs",
    });
  }
};
//========================================================================================
//Modificar el usuario
//=====================================================================================

const updateUser = async (request, response = response) => {
  const userId = request.params.id; //designando el id traido por el usuario en el request de sus parametros oel URL

  try {
    //proceso de logica

    const userDb = await User.findById(userId); //asiganado a la variable userDb el oid traido por el usuario en el params

    if (!userDb) {
      //validacion para saber si el id del usuario solicitado existe
      return response.status(400).json({
        ok: false,
        msg: "user doesn't exist",
      });
    }

    const { password, google, email, ...userDbFields } = request.body; //trayendo todo lo que el usuario y sus items representa en el body del request

    if (userDb.email !== email) {
      //para evitar la modificacion de un correo a un correo ya existente o no actualizado
      //lo cual duplicaria los keys de ahi su elimnacion del cuerpo modificado asigando a

      const emailExisting = await User.findOne({ email }); //inicializando variable que trae el email existente en
      //el esque,a del usuario, para posteriores validaciones

      if (emailExisting) {
        return response.status(400).json({
          ok: false,
          msg: "cant Update to this email cause already exists",
        });
      }
    }

    userDbFields.email = await email;

    // delete userDbFields.password;//borrando de los campos de actualizacion asignados a la variable userDbFields los
    // delete userDbFields.google;//iems password y google , pues los mismos no se necesitan actualizar en este ejercicio

    const userDbFieldsUpdated = await User.findByIdAndUpdate(
      userId,
      userDbFields,
      { new: true }
    );

    await response.status(201).json({
      //se devuelve un esstado positivo sobre la modificacion del usuario del usuario
      ok: true,
      userDbFieldsUpdated,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      msg: "Unexpected error .Check logs",
    });
  }
};

//========================================================================================
//borrar  el usuario
//=====================================================================================

const deleteUser = async (request, response = response) => {
  const userId = request.params.id;

  try {
    const userDb = await User.findById(userId);

    if (!userDb) {
      // validacion para saber si el id del usuario solicitado existe
      return await response.status(404).json({
        ok: false,
        msg: "user doesn't exist",
      });
    }
      await  User.findByIdAndDelete(userId);

     response.status(201).json({
      //se devuelve un esstado positivo sobre la modificacion del usuario del usuario
      ok: true,
      msg: "User has been deleted",
    });

  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      msg: "Unexpected error .Check logs",
    });
  }
};

module.exports = {
  getAllUsers,
  createAUser,
  updateUser,
  deleteUser,
};
