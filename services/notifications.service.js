const EventEmitter = require('events');

module.exports = class NotificationService extends EventEmitter {
  constructor(postService, commentsService) {
    super();
    postService.on('newPost', (post) => this.emit('newPost', post));
    postService.on('like', (likeData) => this.emit('postLike', likeData));
    commentsService.on('newComment', (comment) => this.emit('newComment', comment));
    commentsService.on('like', (likeData) => this.emit('commentLike', likeData));
  }
};
