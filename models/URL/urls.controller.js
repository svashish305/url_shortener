const express = require("express");
const router = express.Router();
const authorize = require("../../middleware/authorize");
const urlService = require("./url.service");

router.get("/", authorize(), getUrls);

module.exports = router;

function getUrls(req, res, next) {
  urlService
  .getUrls(req.user.id)
    .then((urls) => res.json(urls))
    .catch(next);
}