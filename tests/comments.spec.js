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
const socialService = require('../services/social.service');
const { errors } = require('../utils/errorManager');

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

    it('should return an array and the objects in it should have likedByUserBoolean', async function () {
      getCommentsByPostIdStub.resolves([{ likedBy: [] }, { likedBy: [] }]);
      const postId = 1;
      const userId = 1;

      const result = await commentsService.getCommentsByPostId(postId, userId);

      result.should.be.a('array');
      result[0].likedByUser.should.be.a('boolean');
    });
  });

  describe('createComment', function () {
    // #region Preperation
    let getPostByIdStub = sinon.stub();
    let createCommentStub = sinon.stub();
    let getUserById = sinon.stub();
    let getUsersByIds = sinon.stub();
    const commentInput = {
      creatorId: 1,
      text: faker.lorem.paragraph,
      postId: 1,
    };

    beforeEach(function () {
      getPostByIdStub = sinon.stub(postsDb, 'getPostById');
      createCommentStub = sinon.stub(commentsDb, 'createComment');
      getUserById = sinon.stub(socialService, 'getUserById');
      getUsersByIds = sinon.stub(socialService, 'getUsersByIds');
    });

    afterEach(function () {
      getPostByIdStub.restore();
      createCommentStub.restore();
      getUserById.restore();
      getUsersByIds.restore();
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
      const creator = {
        userId: faker.random.number(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };
      getUserById.resolves(creator);
      getUsersByIds.resolves([]);

      const createdComment = await commentsService.createComment(commentInput).should.be.fulfilled;

      createCommentStub.should.be.calledOnce;
      getUserById.should.be.calledOnce;
      getUsersByIds.should.be.calledOnce;
      createdComment.should.have.property('publishDate').that.is.a('date');
      createdComment.should.have.property('likes').that.is.eq(0);
      createdComment.should.have.property('creator').that.is.deep.eq(creator);
      createdComment.should.have.property('likedBy').that.is.a('array').that.is.empty;
    });
  });

  describe('addCommentLike', function () {
    // #region Preperation
    let addCommentLikeStub = sinon.stub();
    const commentId = faker.random.number();
    const userId = faker.random.number();
    beforeEach(function () {
      addCommentLikeStub = sinon.stub(commentsDb, 'addCommentLike');
    });

    afterEach(function () {
      addCommentLikeStub.restore();
    });
    // #endregion

    it('should reject with a error if the comment does not exist', async function () {
      addCommentLikeStub.rejects(errors.docNotFound);

      await commentsService.addCommentLike(commentId, userId)
        .should.be.rejectedWith('comment with the specified Id not found');
    });

    it('should call add comment like and fulfilled', async function () {
      addCommentLikeStub.resolves();

      await commentsService.addCommentLike(commentId, userId).should.be.fulfilled;

      addCommentLikeStub.should.have.been.calledOnceWithExactly(commentId, userId);
    });
  });

  describe('deleteCommentLike', function () {
    // #region Preperation
    let deleteCommentLikeStub = sinon.stub();
    const commentId = faker.random.number();
    const userId = faker.random.number();

    beforeEach(function () {
      deleteCommentLikeStub = sinon.stub(commentsDb, 'deleteCommentLike');
    });

    afterEach(function () {
      deleteCommentLikeStub.restore();
    });
    // #endregion

    it('should reject with a error if the comment does not exist', async function () {
      deleteCommentLikeStub.rejects(errors.docNotFound);

      await commentsService.deleteCommentLike(commentId, userId)
        .should.be.rejectedWith('comment with the specified Id not found');

      deleteCommentLikeStub.should.have.been.calledOnce;
    });

    it('should call delete comment like and fulfilled', async function () {
      deleteCommentLikeStub.resolves();

      await commentsService.deleteCommentLike(commentId, userId).should.be.fulfilled;

      deleteCommentLikeStub.should.have.been.calledOnceWithExactly(commentId, userId);
    });
  });
});
