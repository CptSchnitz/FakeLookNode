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

const postDb = require('../db/post.db');
const commentsService = require('../services/comments.service');
const imageService = require('../services/images.service');
const postService = require('../services/post.service');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe('post service', function () {
  describe('getPostById', function () {
    // #region Preperation
    let getPostByIdStub = sinon.stub();
    let getCommentsByPostIdStub = sinon.stub();
    const postId = faker.random.number();
    const userId = faker.random.number();

    beforeEach(function () {
      getPostByIdStub = sinon.stub(postDb, 'getPostById');
      getCommentsByPostIdStub = sinon.stub(commentsService, 'getCommentsByPostId');
    });

    afterEach(function () {
      getPostByIdStub.restore();
      getCommentsByPostIdStub.restore();
    });

    // #endregion
    it('it should return the post requested if it exists', async function () {
      const post = { postId };
      getPostByIdStub.resolves(post);
      getCommentsByPostIdStub.resolves([]);

      const result = await postService.getPostById(postId, userId).should.have.been.fulfilled;

      getPostByIdStub.should.have.been.calledOnceWithExactly(postId, userId)
        .and.calledBefore(getCommentsByPostIdStub);
      getCommentsByPostIdStub.should.have.been.calledOnceWithExactly(postId, userId);
      result.should.have.property('comments').that.is.a('array');
    });

    it('should reject with an error if the post doesnt exist', async function () {
      getPostByIdStub.resolves(null);

      await postService.getPostById(postId, userId)
        .should.have.been.rejectedWith('a post with the specified id ws not found');

      getCommentsByPostIdStub.should.have.not.been.called;
    });
  });

  describe('createPost', function () {
    // #region Preperation
    let saveImageStub = sinon.stub();
    let deleteImageStub = sinon.stub();
    let createPostStub = sinon.stub();

    const image = faker.image.food();
    const postInput = {};
    const uuid = faker.random.uuid();

    beforeEach(function () {
      saveImageStub = sinon.stub(imageService, 'saveImage');
      deleteImageStub = sinon.stub(imageService, 'deleteImages');
      createPostStub = sinon.stub(postDb, 'createPost');
    });

    afterEach(function () {
      saveImageStub.restore();
      deleteImageStub.restore();
      createPostStub.restore();
    });
    // #endregion

    it('should create a post and return the postId', async function () {
      saveImageStub.resolves(uuid);
      const postId = faker.random.number();
      createPostStub.resolves(postId);

      await postService.createPost(postInput, image).should.eventually.be.eq(postId);

      saveImageStub.should.have.been.calledOnceWithExactly(image);
      const createPostArg = createPostStub.args[0][0];
      createPostArg.should.have.a.property('publishDate').that.is.a('date');
      createPostArg.should.have.a.property('imageUuid').that.is.eq(uuid);
      deleteImageStub.should.have.not.been.called;
    });

    it('should reject with error and call delete images if create post rejects', async function () {
      saveImageStub.resolves(uuid);
      createPostStub.rejects();

      await postService.createPost(postInput, image).should.have.been.rejected;

      deleteImageStub.should.have.been.calledOnceWithExactly(uuid);
    });
  });

  describe('getPosts', function () {
    // #region Preparation
    let getPostsStub = sinon.stub();
    const postFilter = {};
    const userId = faker.random.number();
    beforeEach(function () {
      getPostsStub = sinon.stub(postDb, 'getPosts');
    });

    afterEach(function () {
      getPostsStub.restore();
    });
    // #endregion

    it('should return array of posts', async function () {
      getPostsStub.resolves([{}, {}]);

      await postService.getPosts(postFilter, userId)
        .should.eventually.be.a('array').that.is.not.empty;

      getPostsStub.should.have.been.calledOnceWithExactly(postFilter, userId);
    });

    it('should return an empty array if there are no posts that satisfy the filters', async function () {
      getPostsStub.resolves(null);

      await postService.getPosts(postFilter, userId)
        .should.eventually.be.a('array').that.is.empty;
    });
  });

  describe('addPostLike', function () {
    // #region Preparation
    let getPostByIdStub = sinon.stub();
    let addPostLikeStub = sinon.stub();
    const postId = faker.random.number();
    const userId = faker.random.number();
    beforeEach(function () {
      getPostByIdStub = sinon.stub(postDb, 'getPostById');
      addPostLikeStub = sinon.stub(postDb, 'addPostLike');
    });

    afterEach(function () {
      getPostByIdStub.restore();
      addPostLikeStub.restore();
    });
    // #endregion

    it('should reject with a error if the post does not exist', async function () {
      getPostByIdStub.resolves(undefined);

      await postService.addPostLike(postId, userId)
        .should.be.rejectedWith('the post to like doesnt exist');

      getPostByIdStub.should.have.been.calledOnceWithExactly(postId, userId);
      addPostLikeStub.should.have.not.been.called;
    });

    it('should call add post like and fulfilled', async function () {
      getPostByIdStub.resolves({});

      await postService.addPostLike(postId, userId).should.be.fulfilled;

      addPostLikeStub.should.have.been.calledOnceWithExactly(postId, userId)
        .and.calledAfter(getPostByIdStub);
    });
  });

  describe('deletePostLike', function () {
    // #region Preparation
    let getPostByIdStub = sinon.stub();
    let deletePostLikeStub = sinon.stub();
    const postId = faker.random.number();
    const userId = faker.random.number();

    beforeEach(function () {
      getPostByIdStub = sinon.stub(postDb, 'getPostById');
      deletePostLikeStub = sinon.stub(postDb, 'deletePostLike');
    });

    afterEach(function () {
      getPostByIdStub.restore();
      deletePostLikeStub.restore();
    });
    // #endregion

    it('should reject with a error if the post does not exist', async function () {
      getPostByIdStub.resolves(null);

      await postService.deletePostLike(postId, userId)
        .should.be.rejectedWith('the post to like doesnt exist');

      getPostByIdStub.should.have.been.calledOnceWithExactly(postId, userId);
      deletePostLikeStub.should.have.not.been.called;
    });

    it('should call add post and fulfilled', async function () {
      getPostByIdStub.resolves({});

      await postService.deletePostLike(postId, userId).should.be.fulfilled;

      deletePostLikeStub.should.have.been.calledOnceWithExactly(postId, userId)
        .and.calledAfter(getPostByIdStub);
    });
  });
});
