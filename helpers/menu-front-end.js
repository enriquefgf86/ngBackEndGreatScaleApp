const { validationResult } = require("express-validator");
const user = require("../models/user");

const menuFrontEnd = (role = "USER_ROLE") => {
  // vease que se inicializa una fucnion callback en donde como parametro
  // se pasa por defecto el elemento role que no seria mas que el item
  // role que posee cada usuario al loggearse , y por defecto se le asigna el valor
  // de USER_ROLE
  const menu = [
    {
      title: "Main",
      icon: "mdi mdi-gauge",
      subMenu: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Progress Bars",
          url: "/progress",
        },
        {
          title: "Graphics",
          url: "/graphic1",
        },
        {
          title: "Promises",
          url: "/promises",
        },
        {
          title: "RXJS",
          url: "/rxjs",
        },
      ],
    },

    {
      title: "Maintenance",
      icon: "mdi mdi-folder-lock-open",
      subMenu: [
        // {
        //   title: "Users",
        //   url: "/users",
        // },
        {
          title: "Hospitals",
          url: "/hospitals",
        },
        {
          title: "Doctors",
          url: "/doctors",
        },
      ],
    },
  ]; //vease que se inicializa una constante llamda menu que contendria un array de objectos
  //se supone sean rutas con sustitulos y demas, este array seria el elemtno a mapear acorde
  //con el role del usuario , mostrandose o no elementos  de l mismo

  if (role === "ADMIN_ROLE")
    menu[1].subMenu.unshift({
      title: "Users",
      url: "/users",
    });
  //vease entonces aque se inicializa una condicional en donde se analiza si el
  //role traido por el usuario loggeado , renovado o loggeado por google
  // esde user(USER_ROLE) o de administrador(ADMIN_ROLE), en donde el caso de ser
  // de administrador se procederia entocnes a acceder al array perviamente inicializado
  // en su posicion 1, enm el aprtado de subMenu, mediante metodo unshift, a remplazar
  // o anadir un item extra al objeto

  return menu; //se retorna el array con cualesquiera su resultado
};

module.exports = { menuFrontEnd };
