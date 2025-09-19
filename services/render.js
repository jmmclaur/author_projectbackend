const axios = require("axios");

exports.homeRoutes = (req, res) => {
  axios
    .get("http://localhost:3001/api/characters") //use the same port as the backend server
    .then(function (response) {
      res.render("index", { characters: response.data });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.createCharacter = (req, res) => {
  res.render("createCharacter");
};

exports.add_user = (req, res) => {
  res.render("add_user");
};

exports.update_user = (req, res) => {
  axios
    .get("http://localhost:3000/api/users", {
      //use the same port as the backend server
      params: { id: req.query.id },
    })
    .then(function (userdata) {
      res.render("update_user", { user: userdata.data });
    })
    .catch((err) => {
      res.send(err);
    });
};
