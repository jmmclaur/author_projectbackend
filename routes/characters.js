const router = require("express").Router();
const {
  createCharacter,
  getAllCharacters,
  getOneCharacter,
  updateCharacter,
} = require("../controllers/characters");
const { auth } = require("../middlewares/auth");

// Move this to the TOP - before any routes
router.use((req, res, next) => {
  console.log(`Character router: ${req.method} ${req.path}`);
  next();
});

router.get("/list", auth, getAllCharacters);
router.post("/", auth, createCharacter);
router.get("/:characterId", auth, getOneCharacter); //finds character by id
router.patch("/update/:characterId", auth, updateCharacter); //updates identified character

module.exports = router;
