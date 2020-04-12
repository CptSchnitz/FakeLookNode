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

const CommentsDb = require('../../db/comment.db');
const PostsDb = require('../../db/post.db');
const CommentsService = require('../../services/comments.service');
const SocialService = require('../../services/social.service');
const { errors } = require('../../utils/errorManager');

chai.use(chaiEvents);
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe('comment service', function () {
  let commentsDbStubInstance;
  let postDbStubInstance;
  let socialServiceStubInstance;
  let commentsServiceInstance;

  this.beforeEach(function () {
    commentsDbStubInstance = sinon.createStubInstance(CommentsDb);
    postDbStubInstance = sinon.createStubInstance(PostsDb);
    socialServiceStubInstance = sinon.createStubInstance(SocialService);
    commentsServiceInstance = new CommentsService(commentsDbStubInstance,
      postDbStubInstance, socialServiceStubInstance);
  });

  this.afterEach(function () {
    sinon.reset();
  });

  this.afterAll(function () {
    sinon.restore();
  });

  describe('getCommentsByPostId', function () {
    // #region Preperation
    const postId = 1;
    const userId = 1;

    afterEach(function () {
      commentsDbStubInstance.getCommentsByPostId.reset();
    });
    // #endregion

    it('should return an error if the post doesnt exist', async function () {
      postDbStubInstance.getPostById.resolves(undefined);

      const promise = commentsServiceInstance.getCommentsByPostId(postId, userId);

      promise.should.be.rejectedWith('couldnt find post with the specified id.');
    });

    it('should return an array and the objects in it should have likedByUserBoolean', async function () {
      commentsDbStubInstance.getCommentsByPostId.resolves([{ likedBy: [] }, { likedBy: [] }]);
      postDbStubInstance.getPostById.resolves({});

      const result = await commentsServiceInstance.getCommentsByPostId(postId, userId);

      result.should.be.a('array');
      result[0].likedByUser.should.be.a('boolean');
    });
  });

  describe('createComment', function () {
    // #region Preperation
    const commentInput = {
      creatorId: 1,
      text: faker.lorem.paragraph,
      postId: 1,
    };

    afterEach(function () {
      postDbStubInstance.getPostById.reset();
      commentsDbStubInstance.createComment.reset();
      socialServiceStubInstance.getUserById.reset();
      socialServiceStubInstance.getUsersByIds.reset();
    });
    // #endregion

    it('should be rejected with an error if the post doesnt exist', async function () {
      postDbStubInstance.getPostById.resolves(undefined);

      await commentsServiceInstance.createComment(commentInput)
        .should.be.rejectedWith('couldnt find post with the specified id.');

      postDbStubInstance.getPostById.should.be.calledOnceWithExactly(commentInput.postId);
      commentsDbStubInstance.createComment.should.not.be.called;
    });

    it('should return a comment if everything works', async function () {
      postDbStubInstance.getPostById.resolves({});
      const commentId = 1;
      commentsDbStubInstance.createComment.resolves(commentId);
      const creator = {
        userId: faker.random.number(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };
      socialServiceStubInstance.getUserById.resolves(creator);
      socialServiceStubInstance.getUsersByIds.resolves([]);

      commentsServiceInstance.should.emit('newComment');

      const createdComment = await commentsServiceInstance
        .createComment(commentInput).should.be.fulfilled;

      commentsDbStubInstance.createComment.should.be.calledOnce;
      socialServiceStubInstance.getUserById.should.be.calledOnce;
      socialServiceStubInstance.getUsersByIds.should.be.calledOnce;
      createdComment.should.have.property('publishDate').that.is.a('date');
      createdComment.should.have.property('likes').that.is.eq(0);
      createdComment.should.have.property('creator').that.is.deep.eq(creator);
      createdComment.should.have.property('likedBy').that.is.a('array').that.is.empty;
    });
  });

  describe('addCommentLike', function () {
    // #region Preperation
    const commentId = faker.random.number();
    const userId = faker.random.number();

    afterEach(function () {
      commentsDbStubInstance.addCommentLike.reset();
    });
    // #endregion

    it('should reject with a error if the comment does not exist', async function () {
      commentsDbStubInstance.addCommentLike.rejects(errors.docNotFound);

      await commentsServiceInstance.addCommentLike(commentId, userId)
        .should.be.rejectedWith('comment with the specified Id not found');
    });

    it('should call add comment like and fulfilled', async function () {
      commentsDbStubInstance.addCommentLike.resolves();
      commentsDbStubInstance.getCommentById.resolves({ postId: 1, likes: 0 });

      commentsServiceInstance.should.emit('like');
      await commentsServiceInstance.addCommentLike(commentId, userId).should.be.fulfilled;

      commentsDbStubInstance.addCommentLike
        .should.have.been.calledOnceWithExactly(commentId, userId);
    });
  });

  describe('deleteCommentLike', function () {
    // #region Preperation
    const commentId = faker.random.number();
    const userId = faker.random.number();

    afterEach(function () {
      commentsDbStubInstance.deleteCommentLike.reset();
    });
    // #endregion

    it('should reject with a error if the comment does not exist', async function () {
      commentsDbStubInstance.deleteCommentLike.rejects(errors.docNotFound);

      await commentsServiceInstance.deleteCommentLike(commentId, userId)
        .should.be.rejectedWith('comment with the specified Id not found');

      commentsDbStubInstance.deleteCommentLike.should.have.been.calledOnce;
    });

    it('should call delete comment like and fulfilled', async function () {
      commentsDbStubInstance.deleteCommentLike.resolves();
      commentsDbStubInstance.getCommentById.resolves({ postId: 1, likes: 0 });

      commentsServiceInstance.should.emit('like');
      await commentsServiceInstance.deleteCommentLike(commentId, userId).should.be.fulfilled;

      commentsDbStubInstance.deleteCommentLike
        .should.have.been.calledOnceWithExactly(commentId, userId);
    });
  });
});
