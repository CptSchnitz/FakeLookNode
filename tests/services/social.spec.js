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

const SocialDb = require('../../db/social.db');
const SocialService = require('../../services/social.service');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe('social service', function () {
  let socialDbStub;
  let socialServiceInstance;

  this.beforeEach(function () {
    socialDbStub = sinon.createStubInstance(SocialDb);
    socialServiceInstance = new SocialService(socialDbStub);
  });

  this.afterEach(function () {
    sinon.reset();
  });

  this.afterAll(function () {
    sinon.restore();
  });

  describe('getUsers', function () {
    // #region Preparation
    const userFilter = {};

    afterEach(function () {
      socialDbStub.getUsers.reset();
    });

    it('should return array of users if there are any', async function () {
      socialDbStub.getUsers.resolves([{}, {}]);

      await socialServiceInstance.getUsers(userFilter).should.eventually.be.a('array').that.is.not.empty;
      socialDbStub.getUsers.should.have.been.calledOnceWithExactly(userFilter);
    });

    it('should return an empty array if there are no users that satisfy the query', async function () {
      socialDbStub.getUsers.resolves(null);

      await socialServiceInstance.getUsers(userFilter).should.eventually.be.an('array').that.is.empty;
    });
  });

  describe('getUserById', function () {
    // #region Preparation
    const userId = faker.random.number();

    afterEach(function () {
      socialDbStub.getUserById.reset();
    });

    it('should return the user if it exists', async function () {
      const user = { userId };
      socialDbStub.getUserById.resolves(user);

      await socialServiceInstance.getUserById(userId).should.eventually.be.eq(user);
      socialDbStub.getUserById.should.have.been.calledOnceWithExactly(userId);
    });

    it('should reject with an error if the user is not found', async function () {
      socialDbStub.getUserById.resolves(null);

      await socialServiceInstance.getUserById(userId).should.be.rejectedWith('user with the specified id was not found');
    });
  });

  describe('createUser', function () {
    // #region Preparation
    const userInput = {
      userId: faker.random.number(),
    };

    afterEach(function () {
      socialDbStub.getUserById.reset();
      socialDbStub.createUser.reset();
    });

    it('should reject with an error if a user with the id exists', async function () {
      socialDbStub.getUserById.resolves({});

      await socialServiceInstance.createUser(userInput)
        .should.rejectedWith('cannot create user with this Id as its already exists');
      socialDbStub.getUserById.should.have.been.calledOnceWithExactly(userInput.userId);
      socialDbStub.createUser.should.have.not.been.called;
    });

    it('should be fulfilled', async function () {
      socialDbStub.getUserById.resolves(null);

      await socialServiceInstance.createUser(userInput).should.be.fulfilled;
      socialDbStub.createUser.should.have.been.calledOnceWithExactly(userInput);
    });
  });
});
