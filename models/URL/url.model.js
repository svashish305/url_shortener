const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UrlSchema = new Schema({
  urlCode: {
    type: String,
  },
  longUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model("Url", UrlSchema);
