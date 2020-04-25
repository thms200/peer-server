const consultantList = {};

const addConsultants = (consultant, id) => consultantList[consultant] = id;

const findConsultant = (consultant) => consultantList[consultant] || null;

const removeConsultant = (consultant) => delete consultantList[consultant];

module.exports = { consultantList, addConsultants, findConsultant, removeConsultant };
