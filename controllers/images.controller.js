const imageService = require('../services/images.service');
const { isSpecificError, errors } = require('../utils/errorManager');


const getImage = (isThumb) => (req, res, next) => {
  res.set('Content-Type', 'image/webp');
  try {
    const stream = imageService.getImageStream(req.params.imageUuid, isThumb);
    stream.pipe(res);
  } catch (error) {
    if (isSpecificError(error, errors.imageNotFound)) {
      error.status = 404;
    }
    next(error);
  }
};

module.exports = { getImage };
