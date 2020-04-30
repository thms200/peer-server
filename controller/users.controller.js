const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const Customer = require('../models/Customers');
const Consulting = require('../models/Consultings');
const  { saveAudio } = require('../middlewares/uploadAudio');
const { processConsultingList } = require('../util');
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
      if (!newUser) return res.status(400).json({ result: 'ng', errMessage: errorMsg.invalidSignup });
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
  } catch (err) {
    console.warn(err);
    return res.status(400).json({ result: 'ng', errMessage: errorMsg.invalidLogin });
  }
};

exports.getAuth = async(req, res) => {
  try {
    const token = req.headers['x-access-token'].split('Bearer')[1].trim();
    const secretKey = process.env.SECRET_KEY;
    const payload = await jwt.verify(token, secretKey);
    return res.status(200).json({ result: 'ok', token, userInfo: payload });
  } catch (err) {
    console.warn(err);
    const { name } = err;
    if (name === 'TokenExpiredError') return res.status(401).json({ result: 'ng', errMessage: errorMsg.tokenExpired });
    return res.status(400).json({ result: 'ng', errMessage: errorMsg.invalidToken });
  }
};

exports.saveAudio = async(req, res) => {
  try {
    const { buffer, originalname } = req.file;
    const { isFinal, customer } = req.body;
    const customerInfo = await Customer.findOne({ nickname: customer });
    if (!customerInfo) return res.status(400).json({ result: 'ng', errMessage: errorMsg.invalidCustomer });

    const timeStamp = Date.now().toString();
    const url = await saveAudio(buffer, originalname, isFinal, timeStamp);

    const isLastBlob = isFinal === 'true';
    if (!isLastBlob) return res.status(201).json({ result: 'ok', process: 'saving blob' });

    if (isLastBlob && url) {
      const seller = res.locals.userInfo.id;
      const newConsulting = new Consulting({
        seller,
        customer: customerInfo._id,
        contents: {},
      });
      newConsulting.contents.set(timeStamp, url);
      await newConsulting.save();

      customerInfo.consulting.push(newConsulting._id);
      await customerInfo.save();
      return res.status(201).json({ result: 'ok' });
    }
    return res.status(400).json({ result: 'ng', errMessage: errorMsg.failSaveAudio });
  } catch (err) {
    console.warn(err);
    return res.status(400).json({ result: 'ng', errMessage: errorMsg.failSaveAudio });
  }
};

exports.getConsultings = async(req, res) => {
  try {
    const { customer } = req.query;
    const seller = res.locals.userInfo.id;
    let consultings = await Consulting.find({ seller }).populate('customer');
    if (!consultings) return res.status(400).json({ result: 'ng', errMessage: errorMsg.noneConsultings });

    if (customer !== 'all') {
      const customerInfo = await Customer.findOne({ nickname: customer });
      if (!customerInfo) return res.status(400).json({ result: 'ng', errMessage: errorMsg.noneCustomer });
      consultings =
        await Consulting
          .find({ customer: { $eq: customerInfo._id }, seller })
          .populate('customer');
    }

    consultings = processConsultingList(consultings);
    return res.status(200).send(consultings);
  } catch (err) {
    console.warn(err);
    return res.status(400).json({ result: 'ng', errMessage: errorMsg.failSaveAudio });
  }
};
