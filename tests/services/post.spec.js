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


const PostDb = require('../../db/post.db');
const CommentsService = require('../../services/comments.service');
const ImageService = require('../../services/images.service');
const PostService = require('../../services/post.service');
const SocialService = require('../../services/social.service');
const { errors } = require('../../utils/errorManager');

chai.use(chaiEvents);
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe('post service', function () {
  let postDbStubInstance = sinon.createStubInstance(PostDb);
  let socialServiceStubInstance = sinon.createStubInstance(SocialService);
  let commentsServiceStubInstance = sinon.createStubInstance(CommentsService);
  let imageServiceStubInstance = sinon.createStubInstance(ImageService);
  let postServiceInstance;
  this.beforeEach(function () {
    postDbStubInstance = sinon.createStubInstance(PostDb);
    socialServiceStubInstance = sinon.createStubInstance(SocialService);
    commentsServiceStubInstance = sinon.createStubInstance(CommentsService);
    imageServiceStubInstance = sinon.createStubInstance(ImageService);

    postServiceInstance = new PostService(postDbStubInstance, commentsServiceStubInstance,
      imageServiceStubInstance, socialServiceStubInstance);
  });

  this.afterEach(function () {
    sinon.reset();
  });

  this.afterAll(function () {
    sinon.restore();
  });
  describe('getPostById', function () {
    // #region Preperation
    const postId = faker.random.number();
    const userId = faker.random.number();

    afterEach(function () {
      postDbStubInstance.getPostById.reset();
      commentsServiceStubInstance.getCommentsByPostId.reset();
    });

    // #endregion
    it('it should return the post requested if it exists', async function () {
      const post = { postId, likedBy: [] };
      postDbStubInstance.getPostById.resolves(post);
      commentsServiceStubInstance.getCommentsByPostId.resolves([]);

      const result = await postServiceInstance.getPostById(postId, userId)
        .should.have.been.fulfilled;

      postDbStubInstance.getPostById.should.have.been.calledOnceWithExactly(postId, userId)
        .and.calledBefore(commentsServiceStubInstance.getCommentsByPostId);
      commentsServiceStubInstance.getCommentsByPostId
        .should.have.been.calledOnceWithExactly(postId, userId);
      result.should.have.property('comments').that.is.a('array');
    });

    it('should reject with an error if the post doesnt exist', async function () {
      postDbStubInstance.getPostById.resolves(null);

      await postServiceInstance.getPostById(postId, userId)
        .should.have.been.rejectedWith('a post with the specified id ws not found');

      commentsServiceStubInstance.getCommentsByPostId.should.have.not.been.called;
    });
  });

  describe('createPost', function () {
    // #region Preperation
    const image = faker.image.food();
    const postInput = {};
    const uuid = faker.random.uuid();

    afterEach(function () {
      imageServiceStubInstance.saveImage.reset();
      imageServiceStubInstance.deleteImages.reset();
      postDbStubInstance.createPost.reset();
      socialServiceStubInstance.getUserById.reset();
      socialServiceStubInstance.getUsersByIds.reset();
    });
    // #endregion

    it('should create a post and return the postId', async function () {
      imageServiceStubInstance.saveImage.resolves(uuid);
      postDbStubInstance.createPost.resolves();
      const creator = {
        userId: faker.random.number(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };
      socialServiceStubInstance.getUserById.resolves(creator);
      socialServiceStubInstance.getUsersByIds.resolves([]);

      postServiceInstance.should.emit('newPost');

      await postServiceInstance.createPost(postInput, image).should.be.fulfilled;

      imageServiceStubInstance.saveImage.should.have.been.calledOnceWithExactly(image);
      const createPostArg = postDbStubInstance.createPost.args[0][0];
      createPostArg.should.have.a.property('publishDate').that.is.a('date');
      createPostArg.should.have.a.property('imageUuid').that.is.eq(uuid);
      imageServiceStubInstance.deleteImages.should.have.not.been.called;
    });

    it('should reject with error and call delete images if create post rejects', async function () {
      imageServiceStubInstance.saveImage.resolves(uuid);
      postDbStubInstance.createPost.rejects();

      postServiceInstance.should.not.emit('newPost');

      await postServiceInstance.createPost(postInput, image).should.have.been.rejected;

      imageServiceStubInstance.deleteImages.should.have.been.calledOnceWithExactly(uuid);
    });
  });

  describe('getPosts', function () {
    // #region Preparation
    const postFilter = {};
    const userId = faker.random.number();

    afterEach(function () {
      postDbStubInstance.getPosts.reset();
    });
    // #endregion

    it('should return array of posts', async function () {
      postDbStubInstance.getPosts.resolves([{ likedBy: [] }, { likedBy: [] }]);

      await postServiceInstance.getPosts(postFilter, userId)
        .should.eventually.be.a('array').that.is.not.empty;

      postDbStubInstance.getPosts.should.have.been.calledOnceWithExactly(postFilter);
    });
  });

  describe('addPostLike', function () {
    // #region Preparation
    const postId = faker.random.number();
    const userId = faker.random.number();

    afterEach(function () {
      postDbStubInstance.addPostLike.reset();
      postDbStubInstance.getPostById.reset();
    });
    // #endregion

    it('should reject with a error if the post does not exist', async function () {
      postDbStubInstance.addPostLike.rejects(errors.docNotFound);

      postServiceInstance.should.not.emit('like');

      await postServiceInstance.addPostLike(postId, userId)
        .should.be.rejectedWith('post with the specified Id not found');

      postDbStubInstance.addPostLike.should.have.been.calledOnce;
    });

    it('should call add post like and fulfilled', async function () {
      postDbStubInstance.addPostLike.resolves();
      postDbStubInstance.getPostById.resolves({ likes: 0 });

      postServiceInstance.should.emit('like');

      await postServiceInstance.addPostLike(postId, userId).should.be.fulfilled;

      postDbStubInstance.addPostLike.should.have.been.calledOnceWithExactly(postId, userId);
    });
  });

  describe('deletePostLike', function () {
    // #region Preparation
    const postId = faker.random.number();
    const userId = faker.random.number();

    afterEach(function () {
      postDbStubInstance.deletePostLike.reset();
      postDbStubInstance.getPostById.reset();
    });
    // #endregion

    it('should reject with a error if the post does not exist', async function () {
      postDbStubInstance.deletePostLike.rejects(errors.docNotFound);

      postServiceInstance.should.not.emit('like');

      await postServiceInstance.deletePostLike(postId, userId)
        .should.be.rejectedWith('post with the specified Id not found');

      postDbStubInstance.deletePostLike.should.have.been.calledOnce;
    });

    it('should call add post and fulfilled', async function () {
      postDbStubInstance.deletePostLike.resolves();
      postDbStubInstance.getPostById.resolves({ likes: 0 });

      postServiceInstance.should.emit('like');

      await postServiceInstance.deletePostLike(postId, userId).should.be.fulfilled;

      postDbStubInstance.deletePostLike.should.have.been.calledOnceWithExactly(postId, userId);
    });
  });
});
