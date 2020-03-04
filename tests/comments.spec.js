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

const commentsDb = require('../db/comment.db');
const postsDb = require('../db/post.db');
const commentsService = require('../services/comments.service');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe('comment service', function () {
  describe('getCommentsByPostId', function () {
    // #region Preperation
    let getCommentsByPostIdStub = sinon.stub();
    beforeEach(function () {
      getCommentsByPostIdStub = sinon.stub(commentsDb, 'getCommentsByPostId');
    });

    afterEach(function () {
      getCommentsByPostIdStub.restore();
    });
    // #endregion

    it('should return an empty array if post doesnt exist', async function () {
      getCommentsByPostIdStub.resolves(null);
      const postId = 1;
      const userId = 1;

      const result = await commentsService.getCommentsByPostId(postId, userId);

      result.length.should.be.equal(0);
      getCommentsByPostIdStub.should.have.been.calledOnceWithExactly(postId, userId);
    });

    it('should return an array and the objects in it should have tags and userTags array', async function () {
      getCommentsByPostIdStub.resolves([{ }, { }]);
      const postId = 1;
      const userId = 1;

      const result = await commentsService.getCommentsByPostId(postId, userId);

      result.should.be.a('array');
      result[0].tags.should.be.a('array');
      result[0].userTags.should.be.a('array');
    });
  });

  describe('createComment', function () {
    // #region Preperation
    let getPostByIdStub = sinon.stub();
    let createCommentStub = sinon.stub();
    let getCommentByIdStub = sinon.stub();

    const commentInput = {
      creatorId: 1,
      text: faker.lorem.paragraph,
      postId: 1,
    };
    beforeEach(function () {
      getPostByIdStub = sinon.stub(postsDb, 'getPostById');
      createCommentStub = sinon.stub(commentsDb, 'createComment');
      getCommentByIdStub = sinon.stub(commentsDb, 'getCommentById');
    });

    afterEach(function () {
      getPostByIdStub.restore();
      createCommentStub.restore();
      getCommentByIdStub.restore();
    });
    // #endregion

    it('should be rejected with an error if the post doesnt exist', async function () {
      getPostByIdStub.resolves(undefined);

      await commentsService.createComment(commentInput)
        .should.be.rejectedWith('couldnt find post with the specified id.');

      getPostByIdStub.should.be.calledOnceWithExactly(commentInput.postId);
      createCommentStub.should.not.be.called;
    });

    it('should return a comment if everything works', async function () {
      getPostByIdStub.resolves({});
      const commentId = 1;
      createCommentStub.resolves(commentId);
      getCommentByIdStub.resolves({ ...commentInput, commentId });

      await commentsService.createComment(commentInput).should.be.fulfilled;

      createCommentStub.should.be.calledOnce;
      createCommentStub.args[0][0].should.include.keys(commentInput)
        .and.have.property('publishDate').that.is.a('date');
      getCommentByIdStub.should.have.been.calledAfter(createCommentStub)
        .and.calledOnceWithExactly(commentId, commentInput.creatorId);
    });
  });

  describe('addCommentLike', function () {
    // #region Preperation
    let getCommentByIdStub = sinon.stub();
    let addCommentLikeStub = sinon.stub();
    const commentId = faker.random.number();
    const userId = faker.random.number();
    beforeEach(function () {
      getCommentByIdStub = sinon.stub(commentsDb, 'getCommentById');
      addCommentLikeStub = sinon.stub(commentsDb, 'addCommentLike');
    });

    afterEach(function () {
      getCommentByIdStub.restore();
      addCommentLikeStub.restore();
    });
    // #endregion

    it('should reject with a error if the comment does not exist', async function () {
      getCommentByIdStub.resolves(null);

      await commentsService.addCommentLike(commentId, userId)
        .should.be.rejectedWith('Couldnt find the requested comment');

      getCommentByIdStub.should.have.been.calledOnceWithExactly(commentId);
      addCommentLikeStub.should.have.not.been.called;
    });

    it('should call add comment like and fulfilled', async function () {
      getCommentByIdStub.resolves({});

      await commentsService.addCommentLike(commentId, userId).should.be.fulfilled;

      addCommentLikeStub.should.have.been.calledOnceWithExactly(commentId, userId)
        .and.calledAfter(getCommentByIdStub);
    });
  });

  describe('deleteCommentLike', function () {
    // #region Preperation
    let getCommentByIdStub = sinon.stub();
    let deleteCommentLikeStub = sinon.stub();
    const commentId = faker.random.number();
    const userId = faker.random.number();

    beforeEach(function () {
      getCommentByIdStub = sinon.stub(commentsDb, 'getCommentById');
      deleteCommentLikeStub = sinon.stub(commentsDb, 'deleteCommentLike');
    });

    afterEach(function () {
      getCommentByIdStub.restore();
      deleteCommentLikeStub.restore();
    });
    // #endregion

    it('should reject with a error if the comment does not exist', async function () {
      getCommentByIdStub.resolves(null);

      await commentsService.deleteCommentLike(commentId, userId)
        .should.be.rejectedWith('Couldnt find the requested comment');

      getCommentByIdStub.should.have.been.calledOnceWithExactly(commentId);
      deleteCommentLikeStub.should.have.not.been.called;
    });

    it('should call delete comment like and fulfilled', async function () {
      getCommentByIdStub.resolves({});

      await commentsService.deleteCommentLike(commentId, userId).should.be.fulfilled;

      deleteCommentLikeStub.should.have.been.calledOnceWithExactly(commentId, userId)
        .and.calledAfter(getCommentByIdStub);
    });
  });
});
