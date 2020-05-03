const { expect } = require('chai');
const { isEmail, processConsultingList } = require('../util');

describe('<function isEmail>', () => {
  it('should be checked the inputed value email form', () => {
    expect(isEmail('123')).to.eql(false);
    expect(isEmail('123@naver.com')).to.eql(true);
  });
});

describe('<function processConsultingList>', () => {
  const newContents = new Map();
  newContents.set('1588242957683', 'https://aer.ekdk349.com/ken_1588242957683');
  const mockData = [{
    _id: 'aelrkjaelkrj1234',
    seller: 'ekjralke1998332',
    customer: {
      consulting: ['aekjrlaekx', '1kk2jj129d', 'eklekc09383'],
      _id: 'slkeke102938',
      nickname: 'ken',
      email: '123@naver.com',
      consultant: '12kjlkaejrkjaekr',
    },
    contents: newContents,
    isVoice: true,
  }];

  it('should be processed with the necessary information.', () => {
    const result = processConsultingList(mockData).pop();
    expect(result.name).to.eql('ken');
    expect(result.email).to.eql('123@naver.com');
    expect(result.timestamp).to.eql(1588242957683);
    expect(result.audio).to.eql('https://aer.ekdk349.com/ken_1588242957683');
    expect(result.isVoice).to.eql(true);
    expect(result.customer).to.eql(undefined);
    expect(result.seller).to.eql(undefined);
  });
});
