const router = require("express").Router();

router.get("/", (req, res) => {
  res.json("Helloaa");
});

module.exports = router;
