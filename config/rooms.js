const roomList = {};

const arrangeRoom = (nickname, mode, consultant) => {
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

module.exports = { roomList, arrangeRoom };
