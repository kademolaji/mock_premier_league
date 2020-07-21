const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Fixture = require("../models/Fixture");

// @desc      Get all fixtures
// @route     GET /api/v1/fixtures
// @access    Public
exports.getFixtures = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single fixture
// @route     GET /api/v1/fixtures/:id
// @access    Public
exports.getFixture = asyncHandler(async (req, res, next) => {
  const fixture = await Fixture.findById(req.params.id);

  if (!fixture) {
    return next(
      new ErrorResponse(`Fixture not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: fixture });
});

// @desc      Create new fixture
// @route     POST /api/v1/fixtures
// @access    Private
exports.createFixture = asyncHandler(async (req, res, next) => {
  // Add user to req,body
  req.body.user = req.user.id;

  // Check for published fixture
  const publishedFixture = await Fixture.findOne({ user: req.user.id });

  // If the user is not an admin, they can only add one fixture
  if (publishedFixture && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a fixture`,
        400
      )
    );
  }

  const fixture = await Fixture.create(req.body);

  res.status(201).json({
    success: true,
    data: fixture,
  });
});

// @desc      Update fixture
// @route     PUT /api/v1/fixtures/:id
// @access    Private
exports.updateFixture = asyncHandler(async (req, res, next) => {
  let fixture = await Fixture.findById(req.params.id);

  if (!fixture) {
    return next(
      new ErrorResponse(`Fixture not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is fixture owner
  if (fixture.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this fixture`,
        401
      )
    );
  }

  fixture = await Fixture.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: fixture });
});

// @desc      Delete fixture
// @route     DELETE /api/v1/fixtures/:id
// @access    Private
exports.deleteFixture = asyncHandler(async (req, res, next) => {
  const fixture = await Fixture.findById(req.params.id);

  if (!fixture) {
    return next(
      new ErrorResponse(`Fixture not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is fixture owner
  if (fixture.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this fixture`,
        401
      )
    );
  }

  fixture.remove();

  res.status(200).json({ success: true, data: {} });
});
