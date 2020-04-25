const roomList = {};

const arrangeCustomerRoom = (nickname, mode, consultant) => {
  const trimmedName = nickname.trim();
  const customer = {};
  customer[trimmedName] = mode;
  for (let seller in roomList) {
    if (consultant === seller) {
      roomList[seller].push(customer);
      return trimmedName;
    }
  }

  roomList[consultant] = [customer];
  return trimmedName;
};

const removeCustomerRoom = (nickname, consultant) => {
  const trimmedName = nickname.trim();

  let leftCustomer = [];
  for (let seller in roomList) {
    if (consultant === seller) {
      const customers = roomList[seller];
      for (let i = 0; i < customers.length; i++) {
        if (Object.keys(customers[i])[0] === trimmedName) {
          leftCustomer = customers.splice(i, 1);
          break;
        }
      }
    }
  }

  return !leftCustomer.length ? null : Object.keys(leftCustomer[0])[0];
};

const getCustomers = (consultant) => roomList[consultant];

const arrangeConsultantRoom = (consultant) => {
  for (let seller in roomList) {
    if (consultant === seller) {
      const customer = roomList[seller].shift();
      return Object.keys(customer)[0];
    }
  }
};

module.exports = {
  roomList,
  arrangeCustomerRoom,
  removeCustomerRoom,
  getCustomers,
  arrangeConsultantRoom,
};
