const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("正在接收一個跟auth有關的請求");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("成功連結auth route...");
});

router.post("/register", async (req, res) => {
  //確認資料是否符合規範
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //檢查用戶名是否被使用
  const foundUser = await User.findOne({ username: req.body.username });
  if (foundUser) return res.status(400).send("此用戶名已被使用");

  //檢查信箱是否被註冊過
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("此信箱已經被註冊過了");

  //如果都沒問題
  let { email, username, password } = req.body;
  let newUser = new User({ email, username, password });
  try {
    //儲存資料到mongoDB
    let savedUser = await newUser.save();
    return res.send({
      msg: "註冊成功",
      savedUser,
    });
  } catch (e) {
    return res.status(500).send("無法儲存使用者");
  }
});

router.post("/login", async (req, res) => {
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser) return res.status(401).send("找不到使用者");

  foundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send(err);

    if (isMatch) {
      //製作json web token
      const tokenObject = {
        _id: foundUser._id,
        email: foundUser.email,
      };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        message: "成功登入",
        token: "JWT " + token,
        user: foundUser,
      });
    } else {
      return res.status(401).send("密碼錯誤");
    }
  });
});

module.exports = router;
