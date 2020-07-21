const express = require("express");
const {
  getFixtures,
  getFixture,
  createFixture,
  updateFixture,
  deleteFixture,
} = require("../controllers/fixture");

const Fixture = require("../models/Fixture");

const router = express.Router();

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(advancedResults(Fixture, "teams"), getFixtures)
  .post(protect, authorize("admin", "admin"), createFixture);

router
  .route("/:id")
  .get(getFixture)
  .put(protect, authorize("admin", "admin"), updateFixture)
  .delete(protect, authorize("admin", "admin"), deleteFixture);

module.exports = router;
