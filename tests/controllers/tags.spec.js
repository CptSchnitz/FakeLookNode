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

const TagsService = require('../../services/tags.service');
const TagsController = require('../../controllers/tags.controller');
const { RequestStub, ResponseStub } = require('./controllerStubs');

chai.use(sinonChai);
chai.use(chaiAsPromised);
const should = chai.should();

describe('Tags Controller', function () {
  // #region preparation
  let tagsServiceStub;
  let tagsController;

  this.beforeEach(function () {
    tagsServiceStub = sinon.createStubInstance(TagsService);
    tagsController = new TagsController(tagsServiceStub);
  });

  this.afterEach(function () {
    sinon.reset();
  });

  this.afterAll(function () {
    sinon.restore();
  });
  // #endregion

  describe('getTags', function () {
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
    it('should call res.json with the tags', async function () {
      const tags = [];
      tagsServiceStub.getTags.resolves(tags);

      await tagsController.getTags(reqStub, resStub, nextSpy).should.eventually.be.fulfilled;

      tagsServiceStub.getTags.should.have.been.calledOnceWithExactly(filter);
      resStub.json.should.have.been.calledOnceWithExactly(tags);
      nextSpy.should.have.not.been.called;
    });

    it('should call next with error with no status', async function () {
      tagsServiceStub.getTags.rejects(new Error());

      await tagsController.getTags(reqStub, resStub, nextSpy)
        .should.eventually.be.fulfilled;

      resStub.json.should.have.not.been.called;
      const err = nextSpy.firstCall.lastArg;
      err.should.have.been.an.instanceOf(Error);
      should.equal(err.status, undefined);
    });
  });
});
