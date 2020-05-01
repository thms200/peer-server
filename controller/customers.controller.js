const Customer = require('../models/Customers');
const { errorMsg } = require('../constants');
const { isEmail } = require('../util');


exports.getCutomer = async(req, res) => {
  try {
    const { nickname, email, consultant } = req.body;
    const trimNickname = nickname.trim();
    const trimEmail = email.trim();
    const trimConsultant = consultant.trim();

    if (!isEmail(trimEmail)) {
      return res.status(400).json({ result: 'ng', errMessage: errorMsg.invalidEmail });
    }

    const customerByName = await Customer.findOne({ nickname: trimNickname });
    const customerByEmail = await Customer.findOne({ email: trimEmail });

    if (customerByName || customerByEmail) {
      const isSameCustomer
        = customerByName && (trimEmail === customerByName.email) ||
          customerByEmail && (trimNickname === customerByEmail.nickname);
      if (isSameCustomer) return res.status(200).json({ result: 'ok' });
      return res.status(403).json({ result: 'ng', errMessage: errorMsg.failCustomer });
    }

    if (!customerByName || !customerByEmail) {
      const newCustomer = await Customer.create({
        nickname: trimNickname,
        email: trimEmail,
        consultant: trimConsultant,
        consulting: [],
      });
      if (!newCustomer) return res.status(400).json({ result: 'ng', errMessage: errorMsg.failNewCustomer });
      return res.status(201).json({ result: 'ok' });
    }
  } catch (err) {
    return res.status(400).json({ result: 'ng', errMessage: errorMsg.generalError });
  }
};
