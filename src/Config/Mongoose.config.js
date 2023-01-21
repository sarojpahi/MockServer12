const mongoose = require("mongoose");
const connet = async () => {
  mongoose.set("strictQuery", false);
  return mongoose.connect(process.env.DATABASE);
};
module.exports = connet;
