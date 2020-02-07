const imageService = require('../services/images.service');

const getImage = (isThumb) => (req, res, next) => {
  res.set('Content-Type', 'image/webp');
  try {
    const stream = imageService.getImageStream(req.params.imageUuid, isThumb);
    stream.pipe(res);
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

module.exports = { getImage };
