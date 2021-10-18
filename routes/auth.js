const express = require("express");
const User = require("../models/User");
const router = express.Router();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "sainathPatilSambare";
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middlewares/fetchuser");
router.get("/", (req, res) => {
  res.json({ hi: "hello" });
});

router.post(
  "/signup",
  [
    body("email").isEmail(),
    body("name").isLength({ min: 3 }),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg+" "+errors.array()[0].param});
    }

    // checks weather user exits
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.json({ error: "Email already Being Used" });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    console.log(secPass);
    try {
      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      user
        .save()
        .then((user) => {})
        .catch((err) => {
          res.json({ error: err });
        });

      const data = {
        user: {
          id: user._id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (err) {
      res.status(400).json({ message: "Internal server Error" });
    }
  }
);

// login a user

router.post("/login", [body("email").isEmail()], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // checks weather user exits
  let user = await User.findOne({ email: req.body.email });

  let success=false;
  if (!user) {
    return res
      .status(400)
      .json({ error: "Please login with correct credentials" ,success});
  }
  try {
    const isAuth = await bcrypt.compare(req.body.password, user.password);

    if (isAuth) {
      const data = {
        user: {
          id: user._id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken ,success:true});
    } else {
      return res
        .status(400)
        .json({ error: "Please login with correct credentials" });
    }
  } catch (err) {
    res.status(400).json({ message: "Internal server Error" ,success});
  }
});

// get user by token login required

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id).select("-password");
    res.json(user)
  } catch (error) {
    res.status(400).json({ message: "Internal server Error" });
  }
});

module.exports = router;
