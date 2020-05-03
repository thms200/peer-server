const jwt = require('jsonwebtoken');
const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const User = require('../models/Users');
const { ERROR } = require('../constants');
const { tempBuffers } = require('../middlewares/uploadAudio');

describe('<POST /api/users/login>', function() {
  this.timeout(10000);
  it('should respond with token, userInfo If joined customer requests login', done => {
    request(app)
      .post('/api/users/login')
      .send({
        name: 'minsun',
        email: 'orange@gmail.com',
        picture_url: 'www.aeerk.com/efjeke/12kek4',
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(async(err, res) => {
        if (err) return done(err);
        const { userInfo, token } = res.body;
        const secretKey = process.env.SECRET_KEY;
        const payload = await jwt.verify(token, secretKey);
        expect(userInfo.name).to.eql(payload.name);
        expect(userInfo.id).to.eql(payload.id);
        expect(userInfo.picture).to.eql(payload.picture);
        expect(payload.iss).to.eql('minsun');
        done();
      });
  });

  it('should add new user if non-joined user login, and should respond with token, userInfo.', done => {
    after(async() => {
      await User.deleteOne({ email: 'testcode@code.com' });
    });
    request(app)
      .post('/api/users/login')
      .send({
        name: 'code',
        email: 'testcode@code.com',
        picture_url: 'testcode@code.com/code',
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .end(async(err, res) => {
        if (err) return done(err);
        const { userInfo } = res.body;
        const newUser = await User.findOne({ email: 'testcode@code.com' });
        expect(newUser.name).to.eql(userInfo.name);
        done();
      });
  });
});

describe('<ensureAuthenticated>', function() {
  this.timeout(10000);
  let token = '';
  let userId = '';
  before((done) => {
    request(app)
      .post('/api/users/login')
      .send({
        name: 'MinSun Cho',
        email: 'thms200@naver.com',
        picture_url: 'www.aeerk.com/efjeke/12kek4',
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        token = res.body.token;
        userId = res.body.userInfo.id;
        done();
      });
  });
  after(() => {
    token = '';
    userId = '';
  });

  describe('<POST /api/users/auth>', function() {
    it('should respond with token and userInfo, If token is valid', done => {
      request(app)
        .post('/api/users/auth')
        .set('x-access-token', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.userInfo.name).to.eql('MinSun Cho');
          done();
        });
    });

    it('should respond errMessage, If token is invalid', done => {
      request(app)
        .post('/api/users/auth')
        .set('x-access-token', 'Bearer invalidtoken')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(async(err, res) => {
          if (err) return done(err);
          expect(res.body.errMessage).to.eql(ERROR.INVALID_TOKEN);
          done();
        });
    });

    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWluU3VuIENobyIsInBpY3R1cmUiOiJodHRwczovL3BsYXRmb3JtLWxvb2thc2lkZS5mYnNieC5jb20vcGxhdGZvcm0vcHJvZmlsZXBpYy8_YXNpZD0yODg0NzcxNTExNTkyMzYyJmhlaWdodD01MCZ3aWR0aD01MCZleHQ9MTU5MDI1MTI1MCZoYXNoPUFlUy1PVVhPVzl2YmVIN2IiLCJpZCI6IjVlYTFjMWY0ZTRiZjE2MDcxYjA2NDBlOSIsImlhdCI6MTU4ODIzNTk0MSwiZXhwIjoxNTg4MzIyMzQxLCJpc3MiOiJtaW5zdW4ifQ.H8gTYnEr7vxscrgTtDZ1gdlG1xz-9ufJSSHfdSR2scE';
    it('should respond errMessage, If token is expired', done => {
      request(app)
        .post('/api/users/auth')
        .set('x-access-token', `Bearer ${expiredToken}`)
        .expect('Content-Type', /json/)
        .expect(401)
        .end(async(err, res) => {
          if (err) return done(err);
          expect(res.body.errMessage).to.eql(ERROR.TOKEN_EXPIRED);
          done();
        });
    });
  });

  describe('<GET /api/users/:user_id/consultings>', function() {
    describe('should respond informaiton of consultings', function() {
      it('Case1) customer=all', done => {
        request(app)
          .get(`/api/users/${userId}/consultings?customer=all`)
          .set('x-access-token', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            const consultings = res.body;
            expect(Boolean(consultings.length > 0)).to.eql(true);
            done();
          });
      });

      it('Case2) customer=<selected>', done => {
        request(app)
          .get(`/api/users/${userId}/consultings?customer=hoho`)
          .set('x-access-token', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            const consultings = res.body;
            const isAllSameEmail = consultings.every((consulting) => consulting.email === 'yellow@gmail.com');
            expect(Boolean(consultings.length === 2)).to.eql(true);
            expect(isAllSameEmail).to.eql(true);
            done();
          });
      });
    });
  });

  describe('<POST /api/users/:user_id/consultings>', function() {
    it('should save blob(buffer) during consulting', done => {
      const testBufferOne = Buffer.from('Happy');
      const testBufferTwo = Buffer.from(' Coding');
      request(app)
        .post(`/api/users/${userId}/consultings`)
        .set('x-access-token', `Bearer ${token}`)
        .field('Content-Type', 'multipart/form-data')
        .field('customer', 'codetest')
        .field('isFanal', 'false')
        .field('isVoice', 'true')
        .attach('audio', testBufferOne, 'codetest')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.result).to.eql('saving blob');
          expect(tempBuffers.codetest.toString()).to.eql('Happy');

          request(app)
            .post(`/api/users/${userId}/consultings`)
            .set('x-access-token', `Bearer ${token}`)
            .field('Content-Type', 'multipart/form-data')
            .field('customer', 'codetest')
            .field('isFanal', 'false')
            .field('isVoice', 'true')
            .attach('audio', testBufferTwo, 'codetest')
            .expect(201)
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body.result).to.eql('saving blob');
              expect(tempBuffers.codetest.toString()).to.eql('Happy Coding');
              done();
            });
        });
    });
  });
});
