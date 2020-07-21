const express = require("express");
const {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  teamLogoUpload,
} = require("../controllers/team");

const Team = require("../models/Team");

const router = express.Router();

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/:id/logo")
  .put(protect, authorize("admin", "admin"), teamLogoUpload);

router
  .route("/")
  .get(advancedResults(Team, ""), getTeams)
  .post(protect, authorize("admin", "admin"), createTeam);

router
  .route("/:id")
  .get(getTeam)
  .put(protect, authorize("admin", "admin"), updateTeam)
  .delete(protect, authorize("admin", "admin"), deleteTeam);

module.exports = router;
