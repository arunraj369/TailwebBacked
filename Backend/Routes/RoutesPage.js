const express = require("express");
const router = express.Router();

const {
  poststudent,
  getAllData,
  deleteData,
  postUpdateData,
} = require("../Controllers/ControllersPage");

router.post("/", poststudent);
router.get("/", getAllData);
router.delete("/:id", deleteData);
router.put("/:id", postUpdateData);

module.exports = router;
