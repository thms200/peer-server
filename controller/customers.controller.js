const Customer = require('../models/Customers');
const { errorMsg } = require('../constants');

exports.getCutomer = async(req, res) => {
  try {
    const { nickname, email, consultant } = req.body;
    const customerByName = await Customer.findOne({ nickname });
    const customerByEmail = await Customer.findOne({ email });

    if (customerByName || customerByEmail) {
      const isSameCustomer
        = customerByName && (email.trim() === customerByName.email) ||
          customerByEmail && (nickname.trim() === customerByEmail.nickname);
      if (isSameCustomer) return res.status(200).json({ result: 'ok' });
      return res.status(403).json({ result: 'ng', errMessage: errorMsg.failCustomer });
    }

    if (!customerByName || !customerByEmail) {
      const trimNickname = nickname.trim();
      const trimEmail = email.trim();
      const newCustomer = await Customer.create({ nickname: trimNickname, email: trimEmail, consultant });
      if (!newCustomer) return res.status(404).json({ result: 'ng', errMessage: errorMsg.failNewCustomer });
      return res.status(201).json({ result: 'ok' });
    }
  } catch(err) {
    return res.status(400).json({ result: 'ng', errMessage: errorMsg.generalError });
  }
};
