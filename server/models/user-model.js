const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    require: true,
    minlength: 6,
    maxlength: 50,
  },
  password: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["buyer", "seller"],
    require: true,
  },
});

userSchema.method.comparePassword = async function (password, cb) {
  let result = await bcrypt.compare(password, this.password);
  return cb(null, result);
};

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);