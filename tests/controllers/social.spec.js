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
const SocialService = require('../../services/social.service');
const SocialController = require('../../controllers/social.controller');
const { RequestStub, ResponseStub } = require('./controllerStubs');

chai.use(sinonChai);
chai.use(chaiAsPromised);
const should = chai.should();

describe('Social Controller', function () {
  // #region preparation
  let socialServiceStub;
  let socialController;

  this.beforeEach(function () {
    socialServiceStub = sinon.createStubInstance(SocialService);
    socialController = new SocialController(socialServiceStub);
  });

  this.afterEach(function () {
    sinon.reset();
  });

  this.afterAll(function () {
    sinon.restore();
  });
  // #endregion

  describe('getUsers', function () {
    // #region preparation
    const filter = faker.random.word();
    let reqStub;
    let resStub;
    let nextSpy;

    this.beforeEach(function () {
      reqStub = new RequestStub();
      reqStub.query.filter = filter;
      resStub = new ResponseStub();
      nextSpy = sinon.spy();
    });

    this.afterEach(function () {
      sinon.reset();
    });
    // #endregion
    it('should call res.json with the users', async function () {
      const users = [];
      socialServiceStub.getUsers.resolves(users);

      await socialController.getUsers(reqStub, resStub, nextSpy).should.eventually.be.fulfilled;

      socialServiceStub.getUsers.should.have.been.calledOnceWithExactly(filter);
      resStub.json.should.have.been.calledOnceWithExactly(users);
      nextSpy.should.have.not.been.called;
    });

    it('should call next with error with no status', async function () {
      socialServiceStub.getUsers.rejects(new Error());

      await socialController.getUsers(reqStub, resStub, nextSpy)
        .should.eventually.be.fulfilled;

      resStub.json.should.have.not.been.called;
      const err = nextSpy.firstCall.lastArg;
      err.should.have.been.an.instanceOf(Error);
      should.equal(err.status, undefined);
    });
  });

  describe('getUserById', function () {
    // #region preparation
    const userId = faker.random.number();
    let reqStub;
    let resStub;
    let nextSpy;

    this.beforeEach(function () {
      reqStub = new RequestStub();
      reqStub.params.userId = userId;
      resStub = new ResponseStub();
      nextSpy = sinon.spy();
    });

    this.afterEach(function () {
      sinon.reset();
    });
    // #endregion
    it('should call res.json with the user', async function () {
      const user = {};
      socialServiceStub.getUserById.resolves(user);

      await socialController.getUserById(reqStub, resStub, nextSpy).should.eventually.be.fulfilled;

      socialServiceStub.getUserById.should.have.been.calledOnceWithExactly(userId);
      resStub.json.should.have.been.calledOnceWithExactly(user);
      nextSpy.should.have.not.been.called;
    });

    it('should call next with error with status 404 if user not found', async function () {
      socialServiceStub.getUserById.rejects(errorFactory(errors.userNotFound));

      await socialController.getUserById(reqStub, resStub, nextSpy)
        .should.eventually.be.fulfilled;

      resStub.json.should.have.not.been.called;
      nextSpy.firstCall.lastArg.should.have.been.an.instanceOf(Error).with.property('status', 404);
    });
  });
});
