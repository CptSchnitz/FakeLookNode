const { isSpecificError, errors } = require('../utils/errorManager');

module.exports = class ImageController {
  constructor(imageService) {
    this.imageService = imageService;
  }

  getImage(isThumb) {
    return (req, res, next) => {
      res.set('Content-Type', 'image/webp');
      try {
        const stream = this.imageService.getImageStream(req.params.imageUuid, isThumb);
        stream.pipe(res);
      } catch (error) {
        if (isSpecificError(error, errors.imageNotFound)) {
          error.status = 404;
        }
        next(error);
      }
    };
  }
};
