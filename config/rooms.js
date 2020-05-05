const roomList = {};

const arrangeCustomerRoom = (customerInfo, id) => {
  const { nickname, mode, consultant, signal } = customerInfo;
  const trimmedName = nickname.trim();
  const trimmedConsultant = consultant.trim();
  const newCustomer = {
    nickname: trimmedName,
    consultant: trimmedConsultant,
    mode,
    signal,
    id,
  };
  for (let seller in roomList) {
    if (trimmedConsultant === seller) {
      roomList[seller].push(newCustomer);
      return trimmedName;
    }
  }
  roomList[trimmedConsultant] = [newCustomer];
  return trimmedName;
};

const removeCustomerRoom = (nickname, consultant) => {
  const trimmedName = nickname.trim();
  const trimmedConsultant = consultant.trim();

  let leftCustomer = [];
  for (let seller in roomList) {
    if (trimmedConsultant === seller) {
      const customers = roomList[seller];
      for (let i = 0; i < customers.length; i++) {
        if (customers[i].nickname === trimmedName) {
          leftCustomer = customers.splice(i, 1);
          break;
        }
      }
    }
  }

  return !leftCustomer.length ? null : leftCustomer[0].nickname;
};

const getCustomers = (consultant) => {
  const trimmedConsultant = consultant.trim();
  return roomList[trimmedConsultant];
};

const arrangeConsultantRoom = (consultant) => {
  const trimmedConsultant = consultant.trim();
  for (let seller in roomList) {
    if (trimmedConsultant === seller) {
      const customer = roomList[seller].shift();
      if (!customer) return null;
      return customer;
    }
  }
  return null;
};

const disconnectCustomer = (customerId) => {
  let leftCustomer = [];
  for (let seller in roomList) {
    const customers = roomList[seller];
    for (let i = 0; i < customers.length; i++) {
      if (customers[i].id === customerId) {
        leftCustomer = customers.splice(i, 1);
        break;
      }
    }
  }
  return !leftCustomer.length ? null : leftCustomer[0].consultant;
};

module.exports = {
  roomList,
  arrangeCustomerRoom,
  removeCustomerRoom,
  getCustomers,
  arrangeConsultantRoom,
  disconnectCustomer,
};
