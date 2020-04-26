const consultantList = {};

const addConsultants = (consultant, id) => {
  const trimmedConsultant = consultant.trim();
  consultantList[trimmedConsultant] = id;
};

const findConsultant = (consultant) => {
  const trimmedConsultant = consultant.trim();
  return consultantList[trimmedConsultant] || null;
};

const removeConsultant = (consultant) => {
  const trimmedConsultant = consultant.trim();
  delete consultantList[trimmedConsultant];
};

module.exports = { consultantList, addConsultants, findConsultant, removeConsultant };
