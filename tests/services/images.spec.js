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
const chaiEvents = require('chai-events');
const sharp = require('sharp');

const { errors } = require('../../utils/errorManager');
const ImageService = require('../../services/images.service');

chai.use(chaiEvents);
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe('Images Service', function () {
  const path = faker.system.directoryPath();
  let imageServiceInstance = new ImageService();

  this.beforeEach(function () {
    imageServiceInstance = new ImageService(path);
  });
  this.afterEach(function () {
    sinon.reset();
  });
  this.afterAll(function () {
    sinon.restore();
  });

  describe('getPath', function () {
    const uuid = faker.random.uuid();
    it('should return path with thumb', function () {
      const result = imageServiceInstance.getPath(uuid, true);
      result.should.be.equal(`${path}${uuid}.thumb.webp`);
    });

    it('should return path without thumb', function () {
      const result = imageServiceInstance.getPath(uuid, false);
      result.should.be.equal(`${path}${uuid}.webp`);
    });
  });

  describe('getImageStream', function () {

  });

  describe('deleteImages', function () {

  });
});
