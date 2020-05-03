const { expect } = require('chai');
const { consultantList, addConsultants, findConsultant, removeConsultant } = require('../config/consultant');
const mockConsultantOne = 'ekek123so0k';
const mockSocketIdOne = 'ekjl123xxaa';
const mockConsultantTwo = '23xkek123so0k';
const mockSocketIdTwo = 'ekx9wj20s';
const mockConsultantThree = ' 2938skwk0sk ';
const mockSocketIdThree = 'al12k09zka';

describe('<function addConsultants>', () => {
  before(() => {
    addConsultants(mockConsultantOne, mockSocketIdOne);
    addConsultants(mockConsultantTwo, mockSocketIdTwo);
    addConsultants(mockConsultantThree, mockSocketIdThree);
  });

  after(() => {
    delete consultantList[mockConsultantOne];
    delete consultantList[mockConsultantTwo];
    const mockTrim = mockConsultantThree.trim();
    delete consultantList[mockTrim];
  });

  it('should be added the inputed consultant with socket id', () => {
    expect(Object.keys(consultantList)[0]).to.eql('ekek123so0k');
    expect(consultantList[mockConsultantOne]).to.eql('ekjl123xxaa');

    expect(Object.keys(consultantList)[1]).to.eql('23xkek123so0k');
    expect(consultantList[mockConsultantTwo]).to.eql('ekx9wj20s');
  });

  it('should be added the inputed consultant even if consultant id has spaces', () => {
    const mockTrim = mockConsultantThree.trim();
    expect(Object.keys(consultantList)[2]).to.eql('2938skwk0sk');
    expect(consultantList[mockConsultantThree]).to.eql(undefined);
    expect(consultantList[mockTrim]).to.eql('al12k09zka');
  });
});

describe('<function findConsultant>', () => {
  before(() => {
    addConsultants(mockConsultantOne, mockSocketIdOne);
    addConsultants(mockConsultantTwo, mockSocketIdTwo);
  });

  after(() => {
    delete consultantList[mockConsultantOne];
    delete consultantList[mockConsultantTwo];
  });

  it('should be returned socket id of the inputed consultant', () => {
    expect(findConsultant(mockConsultantOne)).to.eql('ekjl123xxaa');
    expect(findConsultant(mockConsultantTwo)).to.eql('ekx9wj20s');
  });

  it('should be retured null if consultant is not exist', () => {
    expect(findConsultant('invaildConsultant')).to.eql(null);
  });
});

describe('<function removeConsultant>', () => {
  before(() => {
    addConsultants(mockConsultantOne, mockSocketIdOne);
    addConsultants(mockConsultantTwo, mockSocketIdTwo);
    addConsultants(mockConsultantThree, mockSocketIdThree);
  });

  it('should be removed the inputed consultant', () => {
    expect(consultantList[mockConsultantOne]).to.eql('ekjl123xxaa');
    removeConsultant(mockConsultantOne);
    expect(consultantList[mockConsultantOne]).to.eql(undefined);

    expect(consultantList[mockConsultantTwo]).to.eql('ekx9wj20s');
    removeConsultant(mockConsultantTwo);
    expect(consultantList[mockConsultantTwo]).to.eql(undefined);
  });

  it('should be removed the inputed consultant even if consultant id has spaces', () => {
    const mockTrim = mockConsultantThree.trim();
    expect(consultantList[mockTrim]).to.eql('al12k09zka');
    removeConsultant(mockConsultantThree);
    expect(consultantList[mockTrim]).to.eql(undefined);
    expect(Object.keys(consultantList).length).to.eql(0);
  });
});
