const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const Customer = require('../models/Customers');
const { ERROR } = require('../constants');

describe('<POST /api/customers>', function() {
  this.timeout(10000);
  it('should respond "ok" if customer is vaild', done => {
    request(app)
      .post('/api/customers')
      .send({
        nickname: 'sss',
        email: 'test@naver.com',
        consultant: 'consultantOne'
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.result).to.eql('ok');
        done();
      });
  });

  it('should respond errMessage if inputed email is not email form', done => {
    request(app)
      .post('/api/customers')
      .send({
        nickname: '111',
        email: '111',
        consultant: 'consultantOne'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.errMessage).to.eql(ERROR.INVALID_EMAIL);
        done();
      });
  });

  it('should respond errMessage if inputed data is different from the information stored in DB', done => {
    request(app)
      .post('/api/customers')
      .send({
        nickname: 'sss',
        email: 'sss@naver.com',
        consultant: 'consultantOne'
      })
      .expect('Content-Type', /json/)
      .expect(403)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.errMessage).to.eql(ERROR.FAIL_CUSTOMER);
        done();
      });
  });

  it('should save customer information if customer is new', done => {
    after(async() => {
      await Customer.deleteOne({ email: '123123@test.com' });
    });
    request(app)
      .post('/api/customers')
      .send({
        nickname: '123123',
        email: '123123@test.com',
        consultant: '5ea1c1f4e4bf16071b0640e9'
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .end(async(err, res) => {
        if (err) return done(err);
        expect(res.body.result).to.eql('ok');
        const newCustomer = await Customer.findOne({ email: '123123@test.com' });
        expect(newCustomer.nickname).to.eql('123123');
        done();
      });
  });
});
