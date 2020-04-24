const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const { errorMsg } = require('../constants');

exports.getLoginOrSignup = async(req, res) => {
  try {
    const { email, picture_url, name } = req.body;
    const user = await User.findOne({ email });
    const secretKey = process.env.SECRET_KEY;
    const options = { expiresIn: '1d', issuer: 'minsun' };
    const payload = {};

    if (!user) {
      const newUser = await User.create({ email, picture_url, name });
      if (!newUser) return res.status(404).json({ result: 'ng', errMessage: errorMsg.invalidSignup });
      payload.name = newUser.name;
      payload.picture = newUser.picture_url;
      payload.id = newUser._id;
      const token = jwt.sign(payload, secretKey, options);
      return res.status(201).json({ result: 'ok', token, userInfo: payload });
    }

    if (user) {
      payload.name = user.name;
      payload.picture = user.picture_url;
      payload.id = user._id;
      const token = jwt.sign(payload, secretKey, options);
      return res.status(200).json({ result: 'ok', token, userInfo: payload });
    }
  } catch(err) {
    return res.status(400).json({ result: 'ng', errMessage: errorMsg.invalidLogin });
  }
};
