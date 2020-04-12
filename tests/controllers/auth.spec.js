/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const faker = require('faker');

const { errorFactory, errors } = require('../../utils/errorManager');
const AuthService = require('../../services/auth.service');
const AuthController = require('../../controllers/auth.controller');
const { RequestStub, ResponseStub } = require('./controllerStubs');

chai.use(sinonChai);
chai.use(chaiAsPromised);
const should = chai.should();

describe('Auth Controller', function () {
  // #region preparation
  let authServiceStub;
  let authController;

  this.beforeEach(function () {
    authServiceStub = sinon.createStubInstance(AuthService);
    authController = new AuthController(authServiceStub);
  });

  this.afterEach(function () {
    sinon.reset();
  });

  this.afterAll(function () {
    sinon.restore();
  });
  // #endregion

  describe('login', function () {
    // #region preparation
    const email = faker.internet.email();
    const password = faker.internet.password();

    let reqStub;
    let resStub;
    let nextSpy;

    this.beforeEach(function () {
      reqStub = new RequestStub();
      reqStub.body.email = email;
      reqStub.body.password = password;
      resStub = new ResponseStub();
      nextSpy = sinon.spy();
    });

    this.afterEach(function () {
      sinon.reset();
    });
    // #endregion

    it('should call res.json with the login data if no error are thrown', async function () {
      const loginData = {};
      authServiceStub.login.resolves(loginData);

      await authController.login(reqStub, resStub, nextSpy).should.eventually.be.fulfilled;

      resStub.json.should.be.calledOnceWithExactly(loginData);
      nextSpy.should.not.be.called;
    });

    it('should call next with error and status code if email or password is incorrect', async function () {
      authServiceStub.login.rejects(errorFactory(errors.badEmail));

      await authController.login(reqStub, resStub, nextSpy).should.eventually.be.fulfilled;

      const err = nextSpy.firstCall.args[0];
      err.should.be.an.instanceOf(Error).with.property('status', 401);
      err.should.have.property('message', 'Bad email or password.');
    });

    it('should call next with error and no status code if the error is unknown', async function () {
      authServiceStub.login.rejects(new Error());

      await authController.login(reqStub, resStub, nextSpy).should.eventually.be.fulfilled;

      const err = nextSpy.firstCall.args[0];
      err.should.be.an.instanceOf(Error);
      should.equal(err.status, undefined);
    });
  });

  describe('Register', function () {
    let reqStub;
    let resStub;
    let nextSpy;

    this.beforeEach(function () {
      reqStub = new RequestStub();
      reqStub.body = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      resStub = new ResponseStub();
      nextSpy = sinon.spy();
    });

    it('should return status 201 and object with userId', async function () {
      const userId = faker.random.number();
      authServiceStub.createUser.resolves(userId);

      await authController.register(reqStub, resStub, nextSpy).should.eventually.be.fulfilled;

      authServiceStub.createUser.should.be.calledOnce;
      authServiceStub.createUser.firstCall.lastArg.should.be.eql(reqStub.body);
      resStub.status.should.be.calledOnceWithExactly(201);
      resStub.json.should.have.been.calledOnce;
      resStub.json.firstCall.lastArg.should.have.property('userId', userId);
    });

    it('should call next with error with stauts 400 if bad email', async function () {
      authServiceStub.createUser.rejects(errorFactory(errors.badEmail));

      await authController.register(reqStub, resStub, nextSpy).should.eventually.be.fulfilled;

      const err = nextSpy.firstCall.args[0];
      err.should.be.an.instanceOf(Error).with.property('status', 400);
    });

    it('should call next with error with stauts 400 if bad email', async function () {
      authServiceStub.createUser.rejects(new Error());

      await authController.register(reqStub, resStub, nextSpy).should.eventually.be.fulfilled;

      const err = nextSpy.firstCall.args[0];
      err.should.be.an.instanceOf(Error);
      should.equal(err.status, undefined);
    });
  });

  describe('IsTaken', function () {
    const email = faker.internet.email();
    let reqStub;
    let resStub;
    let nextSpy;

    this.beforeEach(function () {
      reqStub = new RequestStub();
      reqStub.query.email = email;
      resStub = new ResponseStub();
      nextSpy = sinon.spy();
    });

    it('should call res.json with the result', async function () {
      authServiceStub.checkIfEmailUsed.resolves(true);

      await authController.isTaken(reqStub, resStub, nextSpy).should.eventually.be.fulfilled;

      authServiceStub.checkIfEmailUsed.should.be.calledOnceWithExactly(email);
      resStub.json.should.have.been.calledOnceWithExactly(true);
      nextSpy.should.have.not.been.called;
    });

    it('should call next with error if service returns error', async function () {
      authServiceStub.checkIfEmailUsed.rejects(new Error());

      await authController.isTaken(reqStub, resStub, nextSpy).should.eventually.be.fulfilled;

      authServiceStub.checkIfEmailUsed.should.be.calledOnceWithExactly(email);
      resStub.json.should.have.not.been.called;
      nextSpy.firstCall.lastArg.should.have.been.an.instanceOf(Error);
    });
  });
});
