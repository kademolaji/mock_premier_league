const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Team = require("../models/Team");

// @desc      Get all teams
// @route     GET /api/v1/teams
// @access    Public
exports.getTeams = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single team
// @route     GET /api/v1/teams/:id
// @access    Public
exports.getTeam = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    return next(
      new ErrorResponse(`Team not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: team });
});

// @desc      Create new team
// @route     POST /api/v1/teams
// @access    Private
exports.createTeam = asyncHandler(async (req, res, next) => {
  // Add user to req,body
  req.body.user = req.user.id;

  // Check for published team
  const publishedTeam = await Team.findOne({ user: req.user.id });

  // If the user is not an admin, they can only add one team
  if (publishedTeam && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a team`,
        400
      )
    );
  }

  const team = await Team.create(req.body);

  res.status(201).json({
    success: true,
    data: team,
  });
});

// @desc      Update team
// @route     PUT /api/v1/teams/:id
// @access    Private
exports.updateTeam = asyncHandler(async (req, res, next) => {
  let team = await Team.findById(req.params.id);

  if (!team) {
    return next(
      new ErrorResponse(`Team not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is team owner
  if (team.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this team`,
        401
      )
    );
  }

  team = await Team.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: team });
});

// @desc      Delete team
// @route     DELETE /api/v1/teams/:id
// @access    Private
exports.deleteTeam = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    return next(
      new ErrorResponse(`Team not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is team owner
  if (team.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this team`,
        401
      )
    );
  }

  team.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc      Upload logo for team
// @route     PUT /api/v1/teams/:id/logo
// @access    Private
exports.teamLogoUpload = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    return next(
      new ErrorResponse(`Team not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is team owner
  if (team.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this team`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;
  // Make sure the logo is an image
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `logo_${team._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Team.findByIdAndUpdate(req.params.id, { logo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
