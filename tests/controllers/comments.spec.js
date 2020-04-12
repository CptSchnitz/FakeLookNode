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
const CommentsService = require('../../services/comments.service');
const CommentsController = require('../../controllers/comments.controller');
const { RequestStub, ResponseStub } = require('./controllerStubs');

chai.use(sinonChai);
chai.use(chaiAsPromised);
const should = chai.should();

describe('Comments Controller', function () {
  // #region preparation
  let commentsServiceStub;
  let commentsController;

  this.beforeEach(function () {
    commentsServiceStub = sinon.createStubInstance(CommentsService);
    commentsController = new CommentsController(commentsServiceStub);
  });

  this.afterEach(function () {
    sinon.reset();
  });

  this.afterAll(function () {
    sinon.restore();
  });
  // #endregion

  describe('getCommentsByPostId', function () {
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
      const comments = [];
      commentsServiceStub.getCommentsByPostId.resolves(comments);

      await commentsController.getCommentsByPostId(reqStub, resStub, nextSpy)
        .should.eventually.be.fulfilled;


      commentsServiceStub.getCommentsByPostId.should.have.been.calledOnceWithExactly(postId);
      resStub.json.should.be.calledOnceWithExactly(comments);
      nextSpy.should.not.been.called;
    });

    it('should call next with error with status 404 if post not found', async function () {
      commentsServiceStub.getCommentsByPostId.rejects(errorFactory(errors.postDoesntExist));

      await commentsController.getCommentsByPostId(reqStub, resStub, nextSpy)
        .should.eventually.be.fulfilled;

      resStub.json.should.have.not.been.called;
      nextSpy.firstCall.lastArg.should.have.been.an.instanceOf(Error).with.property('status', 404);
    });

    it('should call next with error with no status if error is unknown', async function () {
      commentsServiceStub.getCommentsByPostId.rejects(new Error());

      await commentsController.getCommentsByPostId(reqStub, resStub, nextSpy)
        .should.eventually.be.fulfilled;

      resStub.json.should.have.not.been.called;
      const err = nextSpy.firstCall.lastArg;
      err.should.have.been.an.instanceOf(Error);
      should.equal(err.status, undefined);
    });
  });

  describe('createComment', function () {
    // #region preparation
    const postId = faker.random.alphaNumeric();
    const text = faker.lorem.paragraph();
    let reqStub;
    let resStub;
    let nextSpy;

    this.beforeEach(function () {
      reqStub = new RequestStub();
      reqStub.params.postId = postId;
      reqStub.body.text = text;
      resStub = new ResponseStub();
      nextSpy = sinon.spy();
    });

    this.afterEach(function () {
      sinon.reset();
    });
    // #endregion

    it('should call res.json with the created comment', async function () {
      const comment = {};
      commentsServiceStub.createComment.resolves(comment);

      await commentsController.createComment(reqStub, resStub, nextSpy)
        .should.eventually.been.fulfilled;

      commentsServiceStub.createComment.should.have.been.calledOnce;
      commentsServiceStub.createComment.lastCall.lastArg.should.be.an('object').and
        .include({ ...reqStub.body, ...reqStub.params, creatorId: reqStub.user.userId });
      resStub.status.should.have.been.calledOnceWithExactly(201);
      resStub.send.should.have.been.calledOnceWithExactly(comment);
    });

    it('should call next with error with status 404 if post not found', async function () {
      commentsServiceStub.createComment.rejects(errorFactory(errors.postDoesntExist));

      await commentsController.createComment(reqStub, resStub, nextSpy)
        .should.eventually.be.fulfilled;

      resStub.send.should.have.not.been.called;
      nextSpy.firstCall.lastArg.should.have.been.an.instanceOf(Error).with.property('status', 404);
    });

    it('should call next with error with no status if error is unknown', async function () {
      commentsServiceStub.createComment.rejects(new Error());

      await commentsController.createComment(reqStub, resStub, nextSpy)
        .should.eventually.be.fulfilled;

      resStub.send.should.have.not.been.called;
      const err = nextSpy.firstCall.lastArg;
      err.should.have.been.an.instanceOf(Error);
      should.equal(err.status, undefined);
    });
  });

  describe('addCommentLike', function () {
    // #region preparation
    const commentId = faker.random.alphaNumeric();
    let reqStub;
    let resStub;
    let nextSpy;

    this.beforeEach(function () {
      reqStub = new RequestStub();
      reqStub.params.commentId = commentId;
      resStub = new ResponseStub();
      nextSpy = sinon.spy();
    });

    this.afterEach(function () {
      sinon.reset();
    });
    // #endregion

    it('should call res.sendStatus with code 204', async function () {
      commentsServiceStub.addCommentLike.resolves();

      await commentsController.addCommentLike(reqStub, resStub, nextSpy).should.be.fulfilled;

      commentsServiceStub.addCommentLike.should.have.been
        .calledOnceWithExactly(commentId, reqStub.user.userId);
      resStub.sendStatus.should.have.been.calledOnceWithExactly(204);
    });

    it('should call next with error and status 404 if comment doesnt exist', async function () {
      commentsServiceStub.addCommentLike.rejects(errorFactory(errors.commentDoesntExist));

      await commentsController.addCommentLike(reqStub, resStub, nextSpy).should.be.fulfilled;

      resStub.sendStatus.should.have.not.been.called;
      nextSpy.firstCall.lastArg.should.have.been.an.instanceOf(Error).with.property('status', 404);
    });

    it('should call next with error and status 400 if comment is already liked', async function () {
      commentsServiceStub.addCommentLike.rejects(errorFactory(errors.alreadyLiked));

      await commentsController.addCommentLike(reqStub, resStub, nextSpy).should.be.fulfilled;

      resStub.sendStatus.should.have.not.been.called;
      nextSpy.firstCall.lastArg.should.have.been.an.instanceOf(Error).with.property('status', 400);
    });
  });

  describe('deleteCommentLike', function () {
    // #region preparation
    const commentId = faker.random.alphaNumeric();
    let reqStub;
    let resStub;
    let nextSpy;

    this.beforeEach(function () {
      reqStub = new RequestStub();
      reqStub.params.commentId = commentId;
      resStub = new ResponseStub();
      nextSpy = sinon.spy();
    });

    this.afterEach(function () {
      sinon.reset();
    });
    // #endregion

    it('should call res.sendStatus with code 204', async function () {
      commentsServiceStub.deleteCommentLike.resolves();

      await commentsController.deleteCommentLike(reqStub, resStub, nextSpy).should.be.fulfilled;

      commentsServiceStub.deleteCommentLike.should.have.been
        .calledOnceWithExactly(commentId, reqStub.user.userId);
      resStub.sendStatus.should.have.been.calledOnceWithExactly(204);
    });

    it('should call next with error and status 404 if comment doesnt exist', async function () {
      commentsServiceStub.deleteCommentLike.rejects(errorFactory(errors.commentDoesntExist));

      await commentsController.deleteCommentLike(reqStub, resStub, nextSpy).should.be.fulfilled;

      resStub.sendStatus.should.have.not.been.called;
      nextSpy.firstCall.lastArg.should.have.been.an.instanceOf(Error).with.property('status', 404);
    });

    it('should call next with error and status 400 if comment is not liked', async function () {
      commentsServiceStub.deleteCommentLike.rejects(errorFactory(errors.notLiked));

      await commentsController.deleteCommentLike(reqStub, resStub, nextSpy).should.be.fulfilled;

      resStub.sendStatus.should.have.not.been.called;
      nextSpy.firstCall.lastArg.should.have.been.an.instanceOf(Error).with.property('status', 400);
    });
  });
});
