const ioClient = require('socket.io-client');
const { expect } = require('chai');
const { roomList, removeCustomerRoom } = require('../config/rooms');

const mockCustomerData = {
  nickname: 'hoho',
  mode: 'Camera',
  consultant: 'consultantOne',
  signal: { type: 'offer', sdp: 'slekj13k4kxkxsq' },
};

describe('<Socket>', function() {
  let mockCustomer;
  let mockConsultant;
  beforeEach(() => {
    mockCustomer = ioClient.connect('http://localhost:5000');
    mockConsultant = ioClient.connect('http://localhost:5000');
  });
  afterEach((done) => {
    mockCustomer.disconnect();
    mockConsultant.disconnect();
    done();
  });

  describe('<onConsulting, joinCustomer, currentCustomers>', function() {
    it('should be passed customer information when consultant connects and the customer waits in the room.', (done) => {
      mockConsultant.emit('onConsulting', 'consultantOne', (massage) => {
        expect(massage).to.eql('상담모드가 시작되었습니다. Start를 누르시면 상담이 시작됩니다.');
      });
      mockCustomer.emit('joinCustomer', mockCustomerData, (meesage) => {
        expect(meesage).to.eql('hoho님, 잠시만 기다려주시면 상담을 시작하겠습니다.');
      });
      mockConsultant.on('currentCustomers', (currentCustomers) => {
        const { nickname, consultant, mode } = currentCustomers[0];
        expect(nickname).to.eql('hoho');
        expect(consultant).to.eql('consultantOne');
        expect(mode).to.eql('Camera');
        done();
      });
    });
    after((done) => {
      expect(roomList['consultantOne'][0].nickname).to.eql('hoho');
      removeCustomerRoom('hoho', 'consultantOne');
      done();
    });
  });

  describe('<leaveCustomer>', function() {
    it('should be updated roomList when a customer leaves', (done) => {
      mockCustomer.emit('joinCustomer', mockCustomerData, (meesage) => {
        expect(meesage).to.eql('hoho님, 잠시만 기다려주시면 상담을 시작하겠습니다.');
        expect(roomList['consultantOne'][0].nickname).to.eql('hoho');
      });
      mockCustomer.emit('leaveCustomer', 'hoho', 'consultantOne', (meesage) => {
        expect(meesage).to.eql('hoho님, 이용해 주셔서 감사합니다.');
        expect(roomList['consultantOne'].length).to.eql(0);
        done();
      });
    });
  });

  describe('<startConsulting, endConsulting, offConsulting>', function() {
    it('should be delivered appropriate comment depending on the event', (done) => {
      mockConsultant.emit('startConsulting', 'consultantOne', (data) => {
        expect(data.message).to.eql('더이상 대기 중인 고객이 없습니다.');
      });

      mockConsultant.emit('endConsulting', 'hoho', (massage) => {
        expect(massage).to.eql('hoho님과의 상담이 종료되었습니다. 다음 상담을 진행하시려면 Start를 클릭하세요.');
      });

      mockConsultant.emit('offConsulting', 'consultantOne', (massage) => {
        expect(massage).to.eql('상담 모드가 종료되었습니다. on 버튼을 누르시면 다시 상담 모드가 됩니다.');
        done();
      });
    });
  });
});

