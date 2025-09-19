const Character = require("../models/character");

//CRUD LISTED IN HERE

//CREATE
const createCharacter = async (req, res) => {
  //receives request and response objects
  try {
    const { characterName, characterAge, characterWeapon, characterBrigade } =
      req.body; //data extraction, searching for character data with destructuring
    const userId = req.user._id; //user authentication applied here, finds id of currently logged in user
    const newCharacter = await Character.create({
      //create a new document in the db
      characterName,
      characterAge,
      characterWeapon,
      characterBrigade,
      owner: userId,
    });
    res.status(201).json(newCharacter); //if successful, the new character will appear in the frontend
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating character", error: err.message }); //catch error
  }
};

//RETRIEVE
const getAllCharacters = async (req, res) => {
  try {
    let query = {}; //declare this first
    query.owner = req.user._id; //look for specific owners via id

    const allCharacters = await Character.find(query);
    res.status(200).json(allCharacters);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving characters" });
  }
};

const getOneCharacter = async (req, res) => {
  try {
    //always define query
    let query = {};
    query.owner = req.user._id;

    //extract the parameters from the query
    const characterName = req.query.characterName;
    const characterAge = req.query.characterAge;
    const characterWeapon = req.query.characterWeapon;
    const characterBrigade = req.query.characterBrigade;

    //use if to filter only when provided (these are conditional checks)
    if (characterName) {
      query.characterName = characterName;
    }
    if (characterAge) {
      query.characterAge = characterAge;
    }
    if (characterWeapon) {
      query.characterWeapon = characterWeapon;
    }
    if (characterBrigade) {
      query.characterBrigade = characterBrigade;
    }

    const characters = await Character.find(query);
    res.status(200).json(characters);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving character", error: err.message });
  }
};

//UPDATE
const updateCharacter = async (req, res) => {
  try {
    const { characterId } = req.params;
    const userId = req.user._id;
    const query = {
      _id: characterId,
      owner: userId,
    };
    const updatedCharacter = await Character.findOneAndUpdate(query, {
      new: true,
    });
    if (!updatedCharacter) {
      return res
        .status(404)
        .json({ message: "Character not found or you don't have permission" });
    }
    res.status(200).json(updatedCharacter);
  } catch (err) {
    res.status(500).json({
      message: "Error updating character tile",
      error: err.message,
    });
  }
};

//DELETE
const deleteCharacter = async (req, res) => {
  try {
    const { characterId } = req.params;
    const userId = req.user._id;
    const query = {
      _id: characterId,
      owner: userId,
    };
    const deletedCharacter = await Character.findOneAndDelete(query);
    if (!deletedCharacter) {
      return res
        .status(404)
        .json({ message: "Character not found or you don't have permission" });
    }
    res.status(200).json(deletedCharacter);
  } catch (err) {
    res.status(500).json({ message: "Error deleting character" });
  }
};

//export
module.exports = {
  createCharacter,
  getAllCharacters,
  getOneCharacter,
  updateCharacter,
  deleteCharacter,
};
