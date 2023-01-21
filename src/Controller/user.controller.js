const User = require("../Model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const find = await User.findOne({ email });
    if (!find) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      await User.create({
        name,
        email,
        password: hashPassword,
      });
      return res.status(201).send({
        message: "User Created Successfully",
      });
    }
    return res.status(409).send({
      message: "User already exists",
    });
  } catch (error) {
    res.status(404).send(error);
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const validate = bcrypt.compare(password, user.password);
    if (validate) {
      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
        },
        "SECRET1234",
        {
          expiresIn: "7 days",
        }
      );
      return res.status(200).send({
        message: "Login successful",
        token,
      });
    }
    return res.status(401).send({
      message: "Invalid Credentials",
    });
  } catch (error) {
    res.status(404).send(error);
  }
};
const getProfile = async (req, res) => {
  const token = req.headers.token;
  try {
    const validate = jwt.decode(token);
    if (validate) {
      const user = await User.findById(validate.id, { password: 0 });
      return res.send(user);
    }
    return res.send("Invalid Token");
  } catch (error) {
    console.log(error);
  }
};
const calculate = async (req, res) => {
  const token = req.headers.token;
  const { P, i, n } = req.body;
  console.log(P, i, n);
  try {
    const validate = jwt.decode(token);
    if (validate) {
      const user = await User.findById(validate.id, { password: 0 });
      if (user) {
        const F = P * (((1 + i) ** n - 1) / i);
        return res.send({ Maturity: ~~F });
      }
    }
    return res.send("Invalid Token");
  } catch (error) {
    console.log(error);
  }
};
module.exports = { signup, login, getProfile, calculate };
