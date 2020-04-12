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
const ImagesService = require('../../services/images.service');
const ImagesController = require('../../controllers/images.controller');
const { RequestStub, ResponseStub } = require('./controllerStubs');

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Images Controller', function () {
  // #region preparation
  let imageServiceStub = sinon.createStubInstance(ImagesService);
  let imagesController = new ImagesController(imageServiceStub);

  this.beforeEach(function () {
    imageServiceStub = sinon.createStubInstance(ImagesService);
    imagesController = new ImagesController(imageServiceStub);
  });

  this.afterEach(function () {
    sinon.reset();
  });

  this.afterAll(function () {
    sinon.restore();
  });
  // #endregion

  describe('GetImage', function () {
    // #region preparation
    const uuid = faker.random.uuid();

    let reqStub;
    let resStub;
    let nextSpy;

    this.beforeEach(function () {
      reqStub = new RequestStub();
      reqStub.params.imageUuid = uuid;
      resStub = new ResponseStub();
      nextSpy = sinon.spy();
    });

    this.afterEach(function () {
      sinon.reset();
    });
    // #endregion

    it('should call stream.pipe with the response object', function () {
      const stream = { pipe: sinon.spy() };
      imageServiceStub.getImageStream.returns(stream);

      const func = imagesController.getImage(true);
      func(reqStub, resStub, nextSpy);

      resStub.set.should.be.calledOnceWithExactly('Content-Type', 'image/webp');
      imageServiceStub.getImageStream.should.have.been.calledOnceWithExactly(uuid, true);
      stream.pipe.calledOnceWithExactly(resStub);
    });

    it('should call next with error with status code 404 if image is not found', function () {
      imageServiceStub.getImageStream.throws(errorFactory(errors.imageNotFound));

      const func = imagesController.getImage(true);
      func(reqStub, resStub, nextSpy);

      nextSpy.firstCall.lastArg.should.have.been.an.instanceOf(Error).with.property('status', 404);
    });
  });
});
