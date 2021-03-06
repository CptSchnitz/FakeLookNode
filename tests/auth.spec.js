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
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authService = require('../services/auth.service');
const authDb = require('../db/auth.db');
const socialService = require('../services/social.service');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();


describe('auth service', function () {
  describe('checkIfEmailUsed', function () {
    // #region Preperation
    let getUserStub;
    beforeEach(function () {
      getUserStub = sinon.stub(authDb, 'getUserByEmail');
    });

    afterEach(function () {
      getUserStub.restore();
    });
    // #endregion

    it('should call getUser once and return a boolean', async function () {
      getUserStub.resolves({});

      const result = await authService.checkIfEmailUsed(faker.internet.email());

      getUserStub.should.have.been.calledOnce;
      result.should.be.a('boolean');
    });

    it('should return true if the email exists', async function () {
      getUserStub.resolves({});

      const result = await authService.checkIfEmailUsed(faker.internet.email());

      result.should.be.true;
    });

    it('should return false if the email doesnt exists', async function () {
      getUserStub.resolves(null);

      const result = await authService.checkIfEmailUsed(faker.internet.email());

      result.should.be.false;
    });
  });

  describe('login', function () {
    // #region Preperation
    const authUserStubValue = {
      userId: 1,
      email: faker.internet.email(),
      passwordHash: faker.random.alphaNumeric(40),
    };
    const socialUserStubValue = {
      userId: 1,
      firstName: faker.name.firstName,
      lastName: faker.name.lastName,
    };
    let getUserByEmailStub;
    let getUserByIdStub;
    let bcryptCompareStub;
    let jwtSignStub;

    beforeEach(function () {
      getUserByEmailStub = sinon.stub(authDb, 'getUserByEmail');
      getUserByIdStub = sinon.stub(socialService, 'getUserById');
      bcryptCompareStub = sinon.stub(bcrypt, 'compare');
      jwtSignStub = sinon.stub(jwt, 'sign');
    });

    afterEach(function () {
      getUserByEmailStub.restore();
      getUserByIdStub.restore();
      bcryptCompareStub.restore();
      jwtSignStub.restore();
    });
    // #endregion

    it('should reject with an error if email is not found', async function () {
      getUserByEmailStub.resolves(undefined);

      const loginPromise = authService.login(authUserStubValue.email, faker.internet.password);

      await loginPromise.should.eventually.be.rejectedWith('the email was not found');
      getUserByEmailStub.should.have.been.calledOnceWith(authUserStubValue.email);
      bcryptCompareStub.should.have.not.been.called;
    });

    it('should reject with an error if the password doesnt match the hash', async function () {
      getUserByEmailStub.resolves(authUserStubValue);
      bcryptCompareStub.resolves(false);
      const password = faker.internet.password();

      const loginPromise = authService.login(authUserStubValue.email, password);

      await loginPromise.should.eventually.be.rejectedWith('the password is incorrect');
      getUserByEmailStub.should.have.been.calledOnceWith(authUserStubValue.email);
      bcryptCompareStub.should.have.been.calledOnceWith(password, authUserStubValue.passwordHash);
      jwtSignStub.should.have.not.been.called;
    });

    it('should return an object with token, id, firstname, lastname, and expiration', async function () {
      getUserByEmailStub.resolves(authUserStubValue);
      bcryptCompareStub.resolves(true);
      jwtSignStub.returns(faker.random.alphaNumeric(40));
      getUserByIdStub.resolves(socialUserStubValue);
      const password = faker.internet.password();

      const result = await authService.login(authUserStubValue.email, password);

      bcryptCompareStub.should.have.been.calledOnceWith(password, authUserStubValue.passwordHash);
      getUserByIdStub.should.have.been.calledOnceWith(authUserStubValue.userId);
      jwtSignStub.should.have.been.calledOnce;
      result.idToken.should.be.a('string');
      result.userId.should.be.equal(authUserStubValue.userId);
      result.firstName.should.be.equal(socialUserStubValue.firstName);
      result.lastName.should.be.equal(socialUserStubValue.lastName);
      result.expiration.should.be.a('date');
    });
  });

  describe('createUser', function () {
    // #region Preperation
    let getAuthUserStub = sinon.stub();
    let bcryptHashStub = sinon.stub();
    let createAuthUserStub = sinon.stub();
    let createUserStub = sinon.stub();
    let deleteAuthUserStub = sinon.stub();

    const userInput = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      address: faker.address.streetAddress(),
      workPlace: faker.company.companyName(),
      birthDate: faker.date.past(),
    };

    beforeEach(function () {
      getAuthUserStub = sinon.stub(authDb, 'getUserByEmail');
      bcryptHashStub = sinon.stub(bcrypt, 'hash');
      createAuthUserStub = sinon.stub(authDb, 'createAuthUser');
      createUserStub = sinon.stub(socialService, 'createUser');
      deleteAuthUserStub = sinon.stub(authDb, 'deleteAuthUser');
    });

    afterEach(function () {
      getAuthUserStub.restore();
      bcryptHashStub.restore();
      createAuthUserStub.restore();
      createUserStub.restore();
      deleteAuthUserStub.restore();
    });

    // #endregion

    it('should throw an error if the email is already user', async function () {
      getAuthUserStub.resolves({});

      const createUserPromise = authService.createUser(userInput);
      await createUserPromise.should.be.rejectedWith('the email is already used');
      bcryptHashStub.should.not.have.been.called;
    });

    it('should called delete auth user and throw error if creates user throws an error', async function () {
      const userId = faker.random.number();
      getAuthUserStub.resolves(undefined);
      bcryptHashStub.resolves(faker.random.alphaNumeric);
      createAuthUserStub.resolves(userId);
      createUserStub.rejects();

      const createUserPromise = authService.createUser(userInput);

      await createUserPromise.should.be.rejected;
      deleteAuthUserStub.should.be.calledAfter(createUserStub);
      deleteAuthUserStub.should.be.calledWith(userId);
    });

    it('should not throw an error and resolve to the user id', async function () {
      const userId = faker.random.number();
      getAuthUserStub.resolves(undefined);
      const hash = faker.random.alphaNumeric;
      bcryptHashStub.resolves(hash);
      createAuthUserStub.resolves(userId);

      const createUserPromise = authService.createUser(userInput);

      await createUserPromise.should.eventually.be.equal(userId);
      bcryptHashStub.should.be.calledOnceWith(userInput.password);
      createAuthUserStub.should.be.calledOnceWithExactly(userInput.email, hash);
      createUserStub.should.be.calledImmediatelyAfter(createAuthUserStub);
      deleteAuthUserStub.should.not.be.called;
    });
  });
});
