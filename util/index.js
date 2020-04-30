const isEmail = (asValue) => {
  // eslint-disable-next-line no-useless-escape
  const regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  return regExp.test(asValue);
};

const processConsultingList = (consultings) => {
  const result = [];
  consultings.forEach(consulting => {
    const { customer, contents } = consulting;
    const { nickname, email } = customer;
    const contentsInfo = contents.entries().next().value;
    const timestamp = Number(contentsInfo[0]);
    const audio = contentsInfo[1];
    const consultingInfo = { name: nickname, email, timestamp, audio };
    result.push(consultingInfo);
  });
  return result;
};

module.exports = {
  isEmail,
  processConsultingList
};
