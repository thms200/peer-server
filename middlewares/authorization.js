const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { ERROR } = require('../constants');

const ensureAuthenticated = async(req, res, next) => {
  try {
    const token = req.headers['x-access-token'].split('Bearer')[1].trim();
<<<<<<< HEAD
    if (!token) return next(createError(401), ERROR.INVALID_TOKEN);
=======
    if (!token) return next(createError(401), errorMsg.invalidToken);
>>>>>>> 66294997af0180e5e1ad5ac44f9330c828d348ca
    const secretKey = process.env.SECRET_KEY;
    const payload = await jwt.verify(token, secretKey);
    res.locals.userInfo = payload;
    next();
  } catch (err) {
    const { name } = err;
    if (name === 'TokenExpiredError') return res.status(401).json({ errMessage: ERROR.TOKEN_EXPIRED });
    return res.status(401).json({ errMessage: ERROR.INVALID_TOKEN });
  }
};

module.exports = ensureAuthenticated;
