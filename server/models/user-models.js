const mongoose = require("mongoose");
const { Schema } = mongoose;
// const bcrypt = require("bcrypt");

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
    minlength: 6,
    maxlength: 50,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.comparePassword = async function (password, cb) {
  let result;
  try {
    //result的值為true or false
    // result = await bcrypt.compare(password, this.password);
    result = password === this.password;
    return cb(null, result);
  } catch (e) {
    return cb(e, result);
  }
};

// // mongoose mmiddlewares
// // 若使用者為新用戶，或是正在更改密碼，則將密碼進行雜湊處理
// userSchema.pre("save", async function (next) {
//   //this代表mongoDB的Document
//   if (this.isNew || this.isModified("password")) {
//     //將密碼進行雜湊處理
//     const hashValue = await bcrypt.hash(this.password, 10);
//     this.password = hashValue;
//   }
//   next();
// });

module.exports = mongoose.model("User", userSchema);
