const mongoose = require("mongoose");
const slugify = require("slugify");

const FixtureSchema = mongoose.Schema(
  {
    home_team: {
      id: Object,
      name: String,
      logo: String,
    },
    away_team: {
      id: Object,
      name: String,
      logo: String,
    },
    home: {
      type: mongoose.Schema.ObjectId,
      ref: "Team",
      required: true,
    },
    away: {
      type: mongoose.Schema.ObjectId,
      ref: "Team",
      required: true,
    },
    // slug: String,
    stadium: {
      type: String,
      required: true,
    },
    playdate: {
      type: Date,
      required: true,
    },
    playtime: {
      type: String,
      required: true,
    },
    playstatus: {
      type: Boolean,
      default: 0,
    },
    score: {
      type: Object,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

FixtureSchema.pre("save", async function (next) {
  const hm = await this.model("Team").findById(this.home);
  const aw = await this.model("Team").findById(this.away);
  this.home_team = {
    id: this.home,
    name: hm.name,
    logo: hm.logo,
  };
  this.away_team = {
    id: this.home,
    name: aw.name,
    logo: aw.logo,
  };

  // Do not save home and away in DB
  this.home = undefined;
  this.away = undefined;
  next();
});
// Create fixture slug from the name
// FixtureSchema.pre("save", function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// FixtureSchema.virtual("teams", {
//   ref: "Team",
//   localField: "_id",
//   foreignField: "fixture",
//   justOne: false,
// });

module.exports = mongoose.model("Fixture", FixtureSchema);
