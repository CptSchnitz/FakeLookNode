/* eslint-disable no-underscore-dangle */
const fromUnixTime = require('date-fns/fromUnixTime');
const isFuture = require('date-fns/isFuture');

module.exports = (notificationService, authService) => (io) => {
  const connectedUsers = new Map();

  io.use((socket, next) => {
    try {
      const payload = authService.verify(socket.request._query.token);
      if (payload.userId === parseInt(socket.request._query.userId, 10)) {
        connectedUsers.set(payload.userId, { socketId: socket.id, exp: fromUnixTime(payload.exp) });
        next();
      } else {
        next(new Error('user id doenst match'));
      }
    } catch (error) {
      next(error);
    }
  });

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      connectedUsers.delete(parseInt(socket.request._query.userId, 10));
    });
  });

  const emitEvent = (eventName, data, userToIgnore) => {
    connectedUsers.forEach((userInfo, userId) => {
      if (isFuture(userInfo.exp)) {
        if (userId !== userToIgnore) {
          io.to(userInfo.socketId).emit(eventName, data);
        }
      } else {
        io.sockets.sockets[userInfo.socketId].disconnect();
      }
    });
  };

  notificationService.on('newPost', (post) => {
    emitEvent('newPost', post, post.creator.userId);
  });

  notificationService.on('postLike', (likeData) => {
    emitEvent('postLike', likeData, likeData.userId);
  });

  notificationService.on('newComment', (comment) => {
    emitEvent('newComment', comment, comment.creator.userId);
  });

  notificationService.on('commentLike', (likeData) => {
    emitEvent('commentLike', likeData, likeData.userId);
  });
};
