const Customer = require('../models/Customers');
const { ERROR } = require('../constants');
const { isEmail } = require('../util');


exports.getCutomer = async(req, res) => {
  try {
    const { nickname, email, consultant } = req.body;
    const trimNickname = nickname.trim();
    const trimEmail = email.trim();
    const trimconsultantId = consultant.trim();
    if (!isEmail(trimEmail)) {
      return res.status(400).json({ errMessage: ERROR.INVALID_EMAIL });
    }

    const customerByName = await Customer.findOne({ nickname: trimNickname });
    const customerByEmail = await Customer.findOne({ email: trimEmail });

    if (customerByName || customerByEmail) {
      const isSameCustomer
        = customerByName && (trimEmail === customerByName.email) ||
          customerByEmail && (trimNickname === customerByEmail.nickname);
      if (isSameCustomer) return res.status(200).json({ result: 'ok' });
      return res.status(403).json({ errMessage: ERROR.FAIL_CUSTOMER });
    }

    if (!customerByName || !customerByEmail) {
      const newCustomer = await Customer.create({
        nickname: trimNickname,
        email: trimEmail,
        consultant: trimconsultantId,
        consulting: [],
      });
      if (!newCustomer) return res.status(400).json({ errMessage: ERROR.FAIL_NEW_CUSTOMER });
      return res.status(201).json({ result: 'ok' });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ errMessage: ERROR.GENERAL_ERROR });
  }
};
