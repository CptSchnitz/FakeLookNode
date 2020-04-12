/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
const chai = require('chai');
const chaiEvents = require('chai-events');
const EventEmitter = require('events');

const NotificationService = require('../../services/notifications.service');

chai.use(chaiEvents);
chai.should();

describe('Notification Service', function () {
  const payload = {};
  let postServiceStub;
  let commentServiceStub;
  let notifcationServiceInstance;
  this.beforeEach(function () {
    postServiceStub = new EventEmitter();
    commentServiceStub = new EventEmitter();
    notifcationServiceInstance = new NotificationService(postServiceStub, commentServiceStub);
  });

  it('should emit newPost event when postService emits', async function () {
    const eventArgs = notifcationServiceInstance.should.emit('newPost');

    postServiceStub.emit('newPost', payload);

    (await eventArgs)[0].should.be.equal(payload);
  });

  it('should emit newPost event when postService emits', async function () {
    const eventArgs = notifcationServiceInstance.should.emit('postLike');

    postServiceStub.emit('like', payload);

    (await eventArgs)[0].should.be.equal(payload);
  });

  it('should emit newPost event when postService emits', async function () {
    const eventArgs = notifcationServiceInstance.should.emit('newComment');

    commentServiceStub.emit('newComment', payload);

    (await eventArgs)[0].should.be.equal(payload);
  });

  it('should emit newPost event when postService emits', async function () {
    const eventArgs = notifcationServiceInstance.should.emit('commentLike');

    commentServiceStub.emit('like', payload);

    (await eventArgs)[0].should.be.equal(payload);
  });
});
