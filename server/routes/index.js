const express = require("express");
const postQuery = require("../controller/postQuery");
const getQuery = require("../controller/getQuery");
const putQuery = require("../controller/putQuery");
const deleteQuery = require("../controller/deleteQuery");
const handleSession = require("../controller/handleSession");

const createDB = require("../middlewares/databaseCreation");

const router = express.Router();

// router.use(createDB);
// createDB();
router.use("/query", postQuery);
router.use("/query", getQuery);
router.use("/query", putQuery);
router.use("/query", deleteQuery);
router.use("/query", handleSession);
router.use("/*any", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

module.exports = router;
