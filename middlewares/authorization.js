const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { errorMsg } = require('../constants');

const ensureAuthenticated = async(req, res, next) => {
  try {
    const token = req.headers['x-access-token'].split('Bearer')[1].trim();
    if (!token) return next(createError(400), errorMsg.invalidToken);
    const secretKey = process.env.SECRET_KEY;
    const payload = await jwt.verify(token, secretKey);
    res.locals.userInfo = payload;
    next();
  } catch(err) {
    const { name } = err;
    if (name === 'TokenExpiredError') return res.status(401).json({ errMessage: errorMsg.tokenExpired });
    return res.status(401).json({ errMessage: errorMsg.invalidToken });
  }
};

module.exports = ensureAuthenticated;
