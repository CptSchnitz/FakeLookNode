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

const socialDb = require('../db/social.db');
const socialService = require('../services/social.service');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe('social service', function () {
  describe('getUsers', function () {
    // #region Preparation
    let getUsersStub = sinon.stub();
    const userFilter = {};
    beforeEach(function () {
      getUsersStub = sinon.stub(socialDb, 'getUsers');
    });

    afterEach(function () {
      getUsersStub.restore();
    });

    it('should return array of users if there are any', async function () {
      getUsersStub.resolves([{}, {}]);

      await socialService.getUsers(userFilter).should.eventually.be.a('array').that.is.not.empty;
      getUsersStub.should.have.been.calledOnceWithExactly(userFilter);
    });

    it('should return an empty array if there are no users that satisfy the query', async function () {
      getUsersStub.resolves(null);

      await socialService.getUsers(userFilter).should.eventually.be.an('array').that.is.empty;
    });
  });

  describe('getUserById', function () {
    // #region Preparation
    let getUserByIdStub = sinon.stub();
    const userId = faker.random.number();
    beforeEach(function () {
      getUserByIdStub = sinon.stub(socialDb, 'getUserById');
    });

    afterEach(function () {
      getUserByIdStub.restore();
    });

    it('should return the user if it exists', async function () {
      const user = { userId };
      getUserByIdStub.resolves(user);

      await socialService.getUserById(userId).should.eventually.be.eq(user);
      getUserByIdStub.should.have.been.calledOnceWithExactly(userId);
    });

    it('should reject with an error if the user is not found', async function () {
      getUserByIdStub.resolves(null);

      await socialService.getUserById(userId).should.be.rejectedWith('user with the specified id was not found');
    });
  });

  describe('createUser', function () {
    // #region Preparation
    let getUserByIdStub = sinon.stub();
    let createUserStub = sinon.stub();
    const userInput = {
      userId: faker.random.number(),
    };
    beforeEach(function () {
      getUserByIdStub = sinon.stub(socialDb, 'getUserById');
      createUserStub = sinon.stub(socialDb, 'createUser');
    });

    afterEach(function () {
      getUserByIdStub.restore();
      createUserStub.restore();
    });

    it('should reject with an error if a user with the id exists', async function () {
      getUserByIdStub.resolves({});

      await socialService.createUser(userInput)
        .should.rejectedWith('cannot create user with this Id as its already exists');
      getUserByIdStub.should.have.been.calledOnceWithExactly(userInput.userId);
      createUserStub.should.have.not.been.called;
    });

    it('should be fulfilled', async function () {
      getUserByIdStub.resolves(null);

      await socialService.createUser(userInput).should.be.fulfilled;
      createUserStub.should.have.been.calledOnceWithExactly(userInput);
    });
  });
});
