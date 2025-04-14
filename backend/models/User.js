const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
  },
  {
    timestamps: true,
  }
);

//Hash Password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

//Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

//Generate JWT token method
userSchema.methods.generateJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
};

const User = mongoose.model("User", userSchema);
module.exports = User;
