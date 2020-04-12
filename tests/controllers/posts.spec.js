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
const PostService = require('../../services/post.service');
const PostController = require('../../controllers/posts.controller');
const { RequestStub, ResponseStub } = require('./controllerStubs');

chai.use(sinonChai);
chai.use(chaiAsPromised);
const should = chai.should();

describe('Posts Controller', function () {
  // #region preparation
  let postServiceStub;
  let postController;

  this.beforeEach(function () {
    postServiceStub = sinon.createStubInstance(PostService);
    postController = new PostController(postServiceStub);
  });

  this.afterEach(function () {
    sinon.reset();
  });

  this.afterAll(function () {
    sinon.restore();
  });
  // #endregion

  describe('getPosts', function () {
    // #region preparation
    let reqStub;
    let resStub;
    let nextSpy;

    this.beforeEach(function () {
      reqStub = new RequestStub();
      resStub = new ResponseStub();
      nextSpy = sinon.spy();
    });

    this.afterEach(function () {
      sinon.reset();
    });
    // #endregion
    it('call res.json with the result from the service', async function () {
      const posts = [];
      postServiceStub.getPosts.resolves(posts);

      await postController.getPosts(reqStub, resStub, nextSpy).should.eventually.be.fulfilled;

      postServiceStub.getPosts.should.be.calledOnceWithExactly(reqStub.query, reqStub.user.userId);
      resStub.json.should.be.calledOnceWithExactly(posts);
      nextSpy.should.not.been.called;
    });

    it('should call next with error with no status', async function () {
      postServiceStub.getPosts.rejects(new Error());

      await postController.getPosts(reqStub, resStub, nextSpy)
        .should.eventually.be.fulfilled;

      resStub.json.should.have.not.been.called;
      const err = nextSpy.firstCall.lastArg;
      err.should.have.been.an.instanceOf(Error);
      should.equal(err.status, undefined);
    });
  });

  describe('gePostById', function () {
    // #region preparation
    const postId = faker.random.alphaNumeric();

    let reqStub;
    let resStub;
    let nextSpy;

    this.beforeEach(function () {
      reqStub = new RequestStub();
      reqStub.params.postId = postId;
      resStub = new ResponseStub();
      nextSpy = sinon.spy();
    });

    this.afterEach(function () {
      sinon.reset();
    });
    // #endregion

    it('should call res.json with the result from the service', async function () {
      const post = {};
      postServiceStub.getPostById.resolves(post);

      await postController.getPostById(reqStub, resStub, nextSpy)
        .should.eventually.be.fulfilled;


      postServiceStub.getPostById.should.have.been
        .calledOnceWithExactly(postId, reqStub.user.userId);
      resStub.json.should.be.calledOnceWithExactly(post);
      nextSpy.should.not.been.called;
    });

    it('should call next with error with status 404 if post not found', async function () {
      postServiceStub.getPostById.rejects(errorFactory(errors.postDoesntExist));

      await postController.getPostById(reqStub, resStub, nextSpy)
        .should.eventually.be.fulfilled;

      resStub.json.should.have.not.been.called;
      nextSpy.firstCall.lastArg.should.have.been.an.instanceOf(Error).with.property('status', 404);
    });

    it('should call next with error with no status if error is unknown', async function () {
      postServiceStub.getPostById.rejects(new Error());

      await postController.getPostById(reqStub, resStub, nextSpy)
        .should.eventually.be.fulfilled;

      resStub.json.should.have.not.been.called;
      const err = nextSpy.firstCall.lastArg;
      err.should.have.been.an.instanceOf(Error);
      should.equal(err.status, undefined);
    });
  });

  describe('createPost', function () {
    // #region preparation
    const mimetype = 'image/jpeg';
    const buffer = {};
    let reqStub;
    let resStub;
    let nextSpy;

    this.beforeEach(function () {
      reqStub = new RequestStub();
      reqStub.file.mimetype = mimetype;
      reqStub.file.buffer = buffer;
      resStub = new ResponseStub();
      nextSpy = sinon.spy();
    });

    this.afterEach(function () {
      sinon.reset();
    });
    // #endregion

    it('should call next with error and stauts code 400 if mimetype is unsupported', async function () {
      reqStub.file.mimetype = 'application/json';

      await postController.createPost(reqStub, resStub, nextSpy)
        .should.eventually.be.fulfilled;

      resStub.send.should.have.not.been.called;
      nextSpy.firstCall.lastArg.should.have.been.an.instanceOf(Error).with.property('status', 400);
    });

    it('should call res.send with message created and the created post Id', async function () {
      const postId = faker.random.number();
      const text = faker.lorem.paragraph();
      reqStub.body.text = text;
      reqStub.protocol = faker.internet.protocol();
      reqStub.get = sinon.stub().returns('localhost');
      reqStub.originalUrl = '/api/posts';
      postServiceStub.createPost.resolves(postId);

      await postController.createPost(reqStub, resStub, nextSpy).should.eventually.be.fulfilled;

      postServiceStub.createPost.should.have.been
        .calledOnceWithExactly({ text, creatorId: reqStub.user.userId }, reqStub.file.buffer);
      resStub.set.should.have.been.calledOnceWithExactly('Location',
        `${reqStub.protocol}://localhost/api/posts/${postId}`);
      resStub.status.should.have.been.calledOnceWithExactly(201);
      resStub.send.should.have.been.calledOnceWithExactly({ message: 'created', postId });
      nextSpy.should.have.not.been.called;
    });

    it('should call next with error with no status if the service returns error', async function () {
      postServiceStub.createPost.rejects(new Error());

      await postController.createPost(reqStub, resStub, nextSpy)
        .should.eventually.be.fulfilled;

      resStub.send.should.have.not.been.called;
      const err = nextSpy.firstCall.lastArg;
      err.should.have.been.an.instanceOf(Error);
      should.equal(err.status, undefined);
    });
  });

  describe('addPostLike', function () {
    // #region preparation
    const postId = faker.random.alphaNumeric();
    let reqStub;
    let resStub;
    let nextSpy;

    this.beforeEach(function () {
      reqStub = new RequestStub();
      reqStub.params.postId = postId;
      resStub = new ResponseStub();
      nextSpy = sinon.spy();
    });

    this.afterEach(function () {
      sinon.reset();
    });
    // #endregion

    it('should call res.sendStatus with code 204', async function () {
      postServiceStub.addPostLike.resolves();

      await postController.addPostLike(reqStub, resStub, nextSpy).should.be.fulfilled;

      postServiceStub.addPostLike.should.have.been
        .calledOnceWithExactly(postId, reqStub.user.userId);
      resStub.sendStatus.should.have.been.calledOnceWithExactly(204);
    });

    it('should call next with error and status 404 if post doesnt exist', async function () {
      postServiceStub.addPostLike.rejects(errorFactory(errors.postDoesntExist));

      await postController.addPostLike(reqStub, resStub, nextSpy).should.be.fulfilled;

      resStub.sendStatus.should.have.not.been.called;
      nextSpy.firstCall.lastArg.should.have.been.an.instanceOf(Error).with.property('status', 404);
    });

    it('should call next with error and status 400 if post is already liked', async function () {
      postServiceStub.addPostLike.rejects(errorFactory(errors.alreadyLiked));

      await postController.addPostLike(reqStub, resStub, nextSpy).should.be.fulfilled;

      resStub.sendStatus.should.have.not.been.called;
      nextSpy.firstCall.lastArg.should.have.been.an.instanceOf(Error).with.property('status', 400);
    });
  });

  describe('deletePostLike', function () {
    // #region preparation
    const postId = faker.random.alphaNumeric();
    let reqStub;
    let resStub;
    let nextSpy;

    this.beforeEach(function () {
      reqStub = new RequestStub();
      reqStub.params.postId = postId;
      resStub = new ResponseStub();
      nextSpy = sinon.spy();
    });

    this.afterEach(function () {
      sinon.reset();
    });
    // #endregion

    it('should call res.sendStatus with code 204', async function () {
      postServiceStub.deletePostLike.resolves();

      await postController.deletePostLike(reqStub, resStub, nextSpy).should.be.fulfilled;

      postServiceStub.deletePostLike.should.have.been
        .calledOnceWithExactly(postId, reqStub.user.userId);
      resStub.sendStatus.should.have.been.calledOnceWithExactly(204);
    });

    it('should call next with error and status 404 if post doesnt exist', async function () {
      postServiceStub.deletePostLike.rejects(errorFactory(errors.postDoesntExist));

      await postController.deletePostLike(reqStub, resStub, nextSpy).should.be.fulfilled;

      resStub.sendStatus.should.have.not.been.called;
      nextSpy.firstCall.lastArg.should.have.been.an.instanceOf(Error).with.property('status', 404);
    });

    it('should call next with error and status 400 if post is not liked', async function () {
      postServiceStub.deletePostLike.rejects(errorFactory(errors.notLiked));

      await postController.deletePostLike(reqStub, resStub, nextSpy).should.be.fulfilled;

      resStub.sendStatus.should.have.not.been.called;
      nextSpy.firstCall.lastArg.should.have.been.an.instanceOf(Error).with.property('status', 400);
    });
  });
});
