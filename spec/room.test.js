const { expect } = require('chai');
const {
  roomList,
  arrangeCustomerRoom,
  removeCustomerRoom,
  getCustomers,
  arrangeConsultantRoom,
  disconnectCustomer,
} = require('../config/rooms');

const mockCustomerInfoOne = {
  nickname: 'ken',
  mode: 'Camera',
  consultant: 'consultantOne',
  signal: { type: 'offer', sdp: 'slekj13k4kxkxsq' },
};
const mockSocketIdOne = 'aelk2kxoa12';
const mockCustomerInfoTwo = {
  nickname: 'minsun',
  mode: 'Voice',
  consultant: 'consultantOne',
  signal: { type: 'offer', sdp: 'ake937ska' },
};
const mockSocketIdTwo = 'sk29zjwjk1223';
const mockCustomerInfoThree = {
  nickname: 'davin',
  mode: 'Voice',
  consultant: 'consultantTwo',
  signal: { type: 'offer', sdp: 'aek1029zk' },
};
const mockSocketIdThree = 'dk38xjalwo';

describe('<Room in config>', () => {
  let roomOne;
  let roomTwo;
  let roomThree;
  beforeEach(() => {
    roomOne = arrangeCustomerRoom(mockCustomerInfoOne, mockSocketIdOne);
    roomTwo = arrangeCustomerRoom(mockCustomerInfoTwo, mockSocketIdTwo);
    roomThree = arrangeCustomerRoom(mockCustomerInfoThree, mockSocketIdThree);
  });
  afterEach(() => {
    delete roomList['consultantOne'];
    delete roomList['consultantTwo'];
    roomOne = '';
    roomTwo = '';
    roomThree = '';
  });

  describe('<function arrangeConsultantRoom>', () => {
    it('should be arranged room if customer joins', () => {
      expect(roomOne).to.eql('ken');
      expect(roomTwo).to.eql('minsun');
      expect(roomThree).to.eql('davin');
    });

    it('should be updated roomList if customer join', () => {
      const consultantOneCustomers = roomList['consultantOne'];
      const consultantTwoCustomer = roomList['consultantTwo'];
      expect(consultantOneCustomers[0].nickname).to.eql('ken');
      expect(consultantOneCustomers[0].mode).to.eql('Camera');
      expect(consultantOneCustomers[1].nickname).to.eql('minsun');
      expect(consultantOneCustomers[1].consultant).to.eql('consultantOne');
      expect(consultantTwoCustomer[0].nickname).to.eql('davin');
      expect(consultantTwoCustomer[0].mode).to.eql('Voice');
    });
  });

  describe('<function removeCustomerRoom>', () => {
    it('should be removed if customer leaves', () => {
      let consultantOneCustomers = roomList['consultantOne'];
      expect(consultantOneCustomers[0].nickname).to.eql('ken');
      removeCustomerRoom('minsun', 'consultantOne');

      consultantOneCustomers = roomList['consultantOne'];
      expect(consultantOneCustomers[0].nickname).to.eql('ken');
      expect(consultantOneCustomers[1]).to.eql(undefined);
    });
  });

  describe('<function getCustomers>', () => {
    it('should get informations of customer in room', () => {
      const consultantOneCustomers = getCustomers('consultantOne');
      const consultantTwoCustomer = getCustomers('consultantTwo');
      expect(consultantOneCustomers[0].nickname).to.eql('ken');
      expect(consultantOneCustomers[0].mode).to.eql('Camera');
      expect(consultantOneCustomers[1].nickname).to.eql('minsun');
      expect(consultantOneCustomers[1].consultant).to.eql('consultantOne');
      expect(consultantTwoCustomer[0].nickname).to.eql('davin');
      expect(consultantTwoCustomer[0].mode).to.eql('Voice');
    });

    it('should be returned undefined if consultant is not exist', () => {
      expect(getCustomers('noneConsultant')).to.eql(undefined);
    });
  });

  describe('<function arrangeConsultantRoom>', () => {
    it('should get room information in order if consultant joins', () => {
      expect(arrangeConsultantRoom('consultantOne').nickname).to.eql('ken');
      expect(arrangeConsultantRoom('consultantOne').nickname).to.eql('minsun');
      expect(arrangeConsultantRoom('consultantTwo').nickname).to.eql('davin');
    });

    it('should get room name even if consultant id has spaces', () => {
      expect(arrangeConsultantRoom(' consultantOne ').nickname).to.eql('ken');
      expect(arrangeConsultantRoom(' consultantOne ').nickname).to.eql('minsun');
      expect(arrangeConsultantRoom(' consultantTwo ').nickname).to.eql('davin');
    });

    it('should be arranged next customer room if waiting customer leaves,', () => {
      removeCustomerRoom('ken', 'consultantOne');
      const { nickname } = arrangeConsultantRoom('consultantOne');
      expect(Boolean(nickname === 'ken')).to.eql(false);
      expect(Boolean(nickname === 'minsun')).to.eql(true);
    });

    it('should be retured null if waiting customer is not exist,', () => {
      removeCustomerRoom('davin', 'consultantTwo');
      expect(arrangeConsultantRoom('consultantTwo')).to.eql(null);
    });
  });

  describe('<function disconnectCustomer>', () => {
    it('should be removed if customer disconnect', () => {
      const consultantOneCustomers = roomList['consultantOne'];
      expect(consultantOneCustomers[0].nickname).to.eql('ken');
      disconnectCustomer(mockSocketIdOne);
      expect(consultantOneCustomers[0].nickname).to.eql('minsun');

      const consultantTWoCustomers = roomList['consultantTwo'];
      expect(consultantTWoCustomers[0].nickname).to.eql('davin');
      disconnectCustomer(mockSocketIdThree);
      expect(consultantTWoCustomers[0]).to.eql(undefined);
    });
  });
});
