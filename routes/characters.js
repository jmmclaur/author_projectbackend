const router = require("express").Router();
const {
  createCharacter,
  getAllCharacters,
  getOneCharacter,
  updateCharacter,
} = require("../controllers/characters");

// Move this to the TOP - before any routes
router.use((req, res, next) => {
  console.log(`Character router: ${req.method} ${req.path}`);
  next();
});

router.get("/list", getAllCharacters);
router.post("/", createCharacter);
router.get("/:characterId", getOneCharacter); //finds character by id
router.patch("/update/:characterId", updateCharacter); //updates identified character

module.exports = router;
