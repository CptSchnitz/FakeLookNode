/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const TagsDb = require('../../db/tags.db');
const TagsService = require('../../services/tags.service');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe('Tags Service', function () {
  let tagsDbStub;
  let tagsServiceInstance;
  this.beforeEach(function () {
    tagsDbStub = sinon.createStubInstance(TagsDb);
    tagsServiceInstance = new TagsService(tagsDbStub);
  });

  this.afterEach(function () {
    sinon.reset();
  });
  this.afterAll(function () {
    sinon.restore();
  });

  describe('getTags', function () {
    it('should call tagsdb and return array', async function () {
      const dbCallResult = [];
      const filter = 'aaa';
      tagsDbStub.getTags.resolves(dbCallResult);

      const result = await tagsServiceInstance.getTags(filter);

      tagsDbStub.getTags.should.have.been.calledOnceWithExactly(filter);
      result.should.be.equal(dbCallResult);
    })
  });
});
