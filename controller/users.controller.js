const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const Customer = require('../models/Customers');
const Consulting = require('../models/Consultings');
const  { saveAudio } = require('../middlewares/uploadAudio');
const { processConsultingList } = require('../util');
const { ERROR } = require('../constants');

exports.getLoginOrSignup = async(req, res) => {
  try {
    const { email, picture_url, name } = req.body;
    const user = await User.findOne({ email });
    const secretKey = process.env.SECRET_KEY;
    const options = { expiresIn: '1d', issuer: 'minsun' };
    const payload = {};

    if (!user) {
      const newUser = await User.create({ email, picture_url, name });
      if (!newUser) return res.status(400).json({ errMessage: ERROR.INVALID_SIGNUP });
      payload.name = newUser.name;
      payload.picture = newUser.picture_url;
      payload.id = newUser._id;
      const token = jwt.sign(payload, secretKey, options);
      return res.status(201).json({ token, userInfo: payload });
    }

    if (user) {
      payload.name = user.name;
      payload.picture = user.picture_url;
      payload.id = user._id;
      const token = jwt.sign(payload, secretKey, options);
      return res.status(200).json({ token, userInfo: payload });
    }
  } catch (err) {
    return res.status(400).json({ errMessage: ERROR.INVALID_LOGIN });
  }
};

exports.getAuth = async(req, res) => {
  try {
    const token = req.headers['x-access-token'].split('Bearer')[1].trim();
    const secretKey = process.env.SECRET_KEY;
    const payload = await jwt.verify(token, secretKey);
    return res.status(200).json({ userInfo: payload });
  } catch (err) {
    const { name } = err;
    if (name === 'TokenExpiredError') return res.status(401).json({ errMessage: ERROR.TOKEN_EXPIRED });
    return res.status(400).json({ errMessage: ERROR.INVALID_TOKEN });
  }
};

exports.saveAudio = async(req, res) => {
  try {
    const { buffer, originalname } = req.file;
    const { customer, isFinal, isVoice } = req.body;
    const customerInfo = await Customer.findOne({ nickname: customer });
    if (!customerInfo) return res.status(400).json({ errMessage: ERROR.INVALID_CUSTOMER });

    const timeStamp = Date.now().toString();
    const url = await saveAudio(buffer, originalname, isFinal, timeStamp);

    const isLastBlob = isFinal === 'true';
    if (!isLastBlob) return res.status(201).json({ result: 'saving blob' });

    if (isLastBlob && url) {
      const seller = res.locals.userInfo.id;
      const newConsulting = new Consulting({
        seller,
        customer: customerInfo._id,
        contents: {},
        isVoice,
      });
      newConsulting.contents.set(timeStamp, url);
      await newConsulting.save();

      customerInfo.consulting.push(newConsulting._id);
      await customerInfo.save();
      return res.status(201).json({ result: 'ok' });
    }
    return res.status(400).json({ errMessage: ERROR.FAIL_SAVE_AUDIO });
  } catch (err) {
    return res.status(400).json({  errMessage: ERROR.FAIL_SAVE_AUDIO });
  }
};

exports.getConsultings = async(req, res) => {
  try {
    const { customer } = req.query;
    const seller = res.locals.userInfo.id;
    let consultings = await Consulting.find({ seller }).populate('customer');
    if (!consultings) return res.status(400).json({ errMessage: ERROR.NONE_CONSULTINGS });

    if (customer !== 'all') {
      const customerInfo = await Customer.findOne({ nickname: customer });
      if (!customerInfo) return res.status(400).json({ errMessage: ERROR.NONE_CUSTOMER });
      consultings =
        await Consulting
          .find({ customer: { $eq: customerInfo._id }, seller })
          .populate('customer');
    }

    consultings = processConsultingList(consultings);
    return res.status(200).send(consultings);
  } catch (err) {
    return res.status(400).json({ errMessage: ERROR.GENERAL_ERROR });
  }
};
