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

const AuthService = require('../../services/auth.service');
const authDb = require('../../db/auth.db');
const socialService = require('../../services/social.service');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();


describe('auth service', function () {
  let authDbStubInstance;
  let socialServiceStubInstance;
  const jwtSecret = faker.random.alphaNumeric;
  let authInstance;

  this.beforeEach(function () {
    authDbStubInstance = sinon.createStubInstance(authDb, {
      createAuthUser: sinon.stub(),
      deleteAuthUser: sinon.stub(),
      getUserByEmail: sinon.stub(),
    });

    socialServiceStubInstance = sinon.createStubInstance(socialService, {
      createUser: sinon.stub(),
      getUserById: sinon.stub(),
    });

    authInstance = new AuthService(authDbStubInstance, socialServiceStubInstance, jwtSecret);
  });

  this.afterAll(function () {
    sinon.restore();
  });


  describe('checkIfEmailUsed', function () {
    // #region Preperation

    afterEach(function () {
      authDbStubInstance.getUserByEmail.reset();
    });
    // #endregion

    it('should call getUser once and return a boolean', async function () {
      authDbStubInstance.getUserByEmail.resolves({});

      const result = await authInstance.checkIfEmailUsed(faker.internet.email());

      authDbStubInstance.getUserByEmail.should.have.been.calledOnce;
      result.should.be.a('boolean');
    });

    it('should return true if the email exists', async function () {
      authDbStubInstance.getUserByEmail.resolves({});

      const result = await authInstance.checkIfEmailUsed(faker.internet.email());

      result.should.be.true;
    });

    it('should return false if the email doesnt exists', async function () {
      authDbStubInstance.getUserByEmail.resolves(null);

      const result = await authInstance.checkIfEmailUsed(faker.internet.email());

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
    let bcryptCompareStub;
    let jwtSignStub;

    beforeEach(function () {
      bcryptCompareStub = sinon.stub(bcrypt, 'compare');
      jwtSignStub = sinon.stub(jwt, 'sign');
    });

    afterEach(function () {
      bcryptCompareStub.restore();
      jwtSignStub.restore();
      sinon.reset();
    });
    // #endregion

    it('should reject with an error if email is not found', async function () {
      authDbStubInstance.getUserByEmail.resolves(undefined);

      const loginPromise = authInstance.login(authUserStubValue.email, faker.internet.password);

      await loginPromise.should.eventually.be.rejectedWith('the email was not found');
      authDbStubInstance.getUserByEmail.should.have.been.calledOnceWith(authUserStubValue.email);
      bcryptCompareStub.should.have.not.been.called;
    });

    it('should reject with an error if the password doesnt match the hash', async function () {
      authDbStubInstance.getUserByEmail.resolves(authUserStubValue);
      bcryptCompareStub.resolves(false);
      const password = faker.internet.password();

      const loginPromise = authInstance.login(authUserStubValue.email, password);

      await loginPromise.should.eventually.be.rejectedWith('the password is incorrect');
      authDbStubInstance.getUserByEmail.should.have.been.calledOnceWith(authUserStubValue.email);
      bcryptCompareStub.should.have.been.calledOnceWith(password, authUserStubValue.passwordHash);
      jwtSignStub.should.have.not.been.called;
    });

    it('should return an object with token, id, firstname, lastname, and expiration', async function () {
      authDbStubInstance.getUserByEmail.resolves(authUserStubValue);
      bcryptCompareStub.resolves(true);
      jwtSignStub.returns(faker.random.alphaNumeric(40));
      socialServiceStubInstance.getUserById.resolves(socialUserStubValue);
      const password = faker.internet.password();

      const result = await authInstance.login(authUserStubValue.email, password);

      bcryptCompareStub.should.have.been.calledOnceWith(password, authUserStubValue.passwordHash);
      socialServiceStubInstance.getUserById
        .should.have.been.calledOnceWith(authUserStubValue.userId);
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
    let bcryptHashStub = sinon.stub();

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
      bcryptHashStub = sinon.stub(bcrypt, 'hash');
    });

    afterEach(function () {
      sinon.reset();
      bcryptHashStub.restore();
    });

    // #endregion

    it('should throw an error if the email is already user', async function () {
      authDbStubInstance.getUserByEmail.resolves({});

      const createUserPromise = authInstance.createUser(userInput);

      await createUserPromise.should.be.rejectedWith('the email is already used');
      bcryptHashStub.should.not.have.been.called;
    });

    it('should called delete auth user and throw error if creates user throws an error', async function () {
      const userId = faker.random.number();
      authDbStubInstance.getUserByEmail.resolves(undefined);
      bcryptHashStub.resolves(faker.random.alphaNumeric);
      authDbStubInstance.createAuthUser.resolves(userId);
      socialServiceStubInstance.createUser.rejects();

      const createUserPromise = authInstance.createUser(userInput);

      await createUserPromise.should.be.rejected;
      authDbStubInstance.deleteAuthUser.should.be.calledAfter(socialServiceStubInstance.createUser);
      authDbStubInstance.deleteAuthUser.should.be.calledWith(userId);
    });

    it('should not throw an error and resolve to the user id', async function () {
      const userId = faker.random.number();
      authDbStubInstance.getUserByEmail.resolves(undefined);
      const hash = faker.random.alphaNumeric;
      bcryptHashStub.resolves(hash);
      authDbStubInstance.createAuthUser.resolves(userId);

      const createUserPromise = authInstance.createUser(userInput);

      await createUserPromise.should.eventually.be.equal(userId);
      bcryptHashStub.should.be.calledOnceWith(userInput.password);
      authDbStubInstance.createAuthUser.should.be.calledOnceWithExactly(userInput.email, hash);
      socialServiceStubInstance.createUser
        .should.be.calledImmediatelyAfter(authDbStubInstance.createAuthUser);
      authDbStubInstance.deleteAuthUser.should.not.be.called;
    });
  });

  describe('verify', function () {
    // #region Preperation
    let jwtVerifyStub = sinon.stub();
    const payload = {};
    const token = faker.random.alphaNumeric();

    this.beforeEach(function () {
      jwtVerifyStub = sinon.stub(jwt, 'verify');
    });

    afterEach(function () {
      jwtVerifyStub.restore();
    });
    // #endregion

    it('should return the payload if token is valid', function () {
      jwtVerifyStub.returns(payload);

      const result = authInstance.verify(token);

      jwtVerifyStub.should.be.calledOnceWithExactly(token, jwtSecret);
      result.should.be.equal(payload);
    });

    it('should throw an error if the verification fails', function () {
      jwtVerifyStub.throws();

      (() => authInstance.verify(token)).should.throw('token verification failed');
    });
  });
});
