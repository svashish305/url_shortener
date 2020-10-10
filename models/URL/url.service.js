const db = require("../../db");

module.exports = {
  getUrls
}

async function getUrls(user_id) {
  const urls = await db.Url.find({user: user_id});
  return urls;
}