const config = require("./default.json");
const mongoose = require("mongoose");
const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
mongoose.connect(
  config.mongoURI || config.connectionString,
  connectionOptions
);
// mongoose.Promise = global.Promise;
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established");
});

module.exports = {
  User: require("./models/User/user.model"),
  Url: require("./models/URL/url.model"),
  RefreshToken: require("./models/User/refresh-token.model"),
  isValidId,
};

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
