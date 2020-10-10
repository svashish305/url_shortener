const config = require("../../default.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const db = require("../../db");
const validUrl = require('valid-url');
const shortid = require('shortid');

module.exports = {
  authenticate,
  refreshToken,
  revokeToken,
  register,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  getLoggedInUser,
  shorten,
  search
};

async function authenticate({ email, password, ipAddress }) {
  const user = await db.User.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    throw "Email or password is incorrect";
  }

  const jwtToken = generateJwtToken(user);
  const refreshToken = generateRefreshToken(user, ipAddress);

  await refreshToken.save();

  return {
    ...basicDetails(user),
    jwtToken,
    refreshToken: refreshToken.token,
  };
}

async function refreshToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token);
  const { user } = refreshToken;

  const newRefreshToken = generateRefreshToken(user, ipAddress);
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.replacedByToken = newRefreshToken.token;
  await refreshToken.save();
  await newRefreshToken.save();

  const jwtToken = generateJwtToken(user);

  return {
    ...basicDetails(user),
    jwtToken,
    refreshToken: newRefreshToken.token,
  };
}

async function revokeToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token);

  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  await refreshToken.save();
}

async function register(params, origin) {
  const user = new db.User(params);

  user.verificationToken = randomTokenString();

  user.passwordHash = hash(params.password);

  await user.save();
}

async function getAll() {
  const users = await db.User.find();
  return users.map((x) => basicDetails(x));
}

async function getById(id) {
  const user = await getUser(id);
  return basicDetails(user);
}

async function create(params) {
  if (await db.User.findOne({ email: params.email })) {
    throw 'Email "' + params.email + '" is already registered';
  }

  const user = new db.User(params);
  user.verified = Date.now();

  user.passwordHash = hash(params.password);

  await user.save();

  return basicDetails(user);
}

async function update(id, params) {
  const user = await getUser(id);

  if (
    params.email &&
    user.email !== params.email &&
    (await db.User.findOne({ email: params.email }))
  ) {
    throw 'Email "' + params.email + '" is already taken';
  }

  if (params.password) {
    params.passwordHash = hash(params.password);
  }

  Object.assign(user, params);
  user.updated = Date.now();
  await user.save();

  return basicDetails(user);
}

async function _delete(id) {
  const user = await getUser(id);
  await user.remove();
}

// helper functions

async function getUser(id) {
  if (!db.isValidId(id)) throw "User not found";
  const user = await db.User.findById(id);
  if (!user) throw "User not found";
  return user;
}

async function getRefreshToken(token) {
  const refreshToken = await db.RefreshToken.findOne({ token }).populate(
    "user"
  );
  if (!refreshToken || !refreshToken.isActive) throw "Invalid token";
  return refreshToken;
}

function hash(password) {
  return bcrypt.hashSync(password, 10);
}

function generateJwtToken(user) {
  return jwt.sign({ sub: user.id, id: user.id }, config.secret, {
    expiresIn: "60m",
  });
}

function generateRefreshToken(user, ipAddress) {
  return new db.RefreshToken({
    user: user.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    createdByIp: ipAddress,
  });
}

function randomTokenString() {
  return crypto.randomBytes(40).toString("hex");
}

function basicDetails(user) {
  const { id, email, created, updated } = user;
  return { id, email, created, updated };
}

async function getLoggedInUser(id) {
  const user = await db.User.findById(id);
  return user;
}

async function shorten(id, longUrl) {
  const baseUrl = config.baseUrl;

  if(!validUrl.isUri(baseUrl)) {
    return {err: 'Invalid base url'};
  }

  const urlCode = shortid.generate();

  if(validUrl.isUri(longUrl)) {
    try {
      let url = await db.Url.findOne({longUrl});
      if(url) {
        return url;
      } else {
        const shortUrl = baseUrl + '/' + urlCode;
        url = new db.Url({ 
          longUrl,
          shortUrl,
          urlCode,
          date: new Date(),
          user: id
        });
        await url.save();
        let user = await db.User.findById(req.user.id);
        if(!user.urls.includes(url._id)) {
          user.urls.push(url);
        }
        return url;
      }
    } catch (err) {
      console.log(err);
      return {err: 'Server error'};
    }
  } else {
    return {err: 'Invalid long url'};
  }
}

async function search(id, urlCode) {
  try {
    const url = await db.Url.findOne({urlCode: urlCode, user: id});
    if(url) {
      return {longUrl: url.longUrl};
    } else {
      return {err: 'No url found'};
    }
  } catch (err) {
    console.log(err);
    return {err: 'Server error'};    
  }
}

