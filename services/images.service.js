/* eslint-disable no-unused-expressions */
const sharp = require('sharp');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const { errorFactory, errors } = require('../utils/errorManager');

const resizeOptions = {
  withoutEnlargement: true,
  fit: 'contain',
  background: {
    r: 0, g: 0, b: 0, alpha: 0,
  },
};

module.exports = class ImageService {
  constructor(imagePath) {
    this.imagePath = imagePath;
  }

  getPath(uuid, isThumb) {
    return `${this.imagePath}${uuid}${isThumb ? '.thumb' : ''}.webp`;
  }

  async saveImage(image) {
    const uuid = uuidv4();
    const webpImg = await sharp(image)
      .webp();
    await webpImg
      .resize(1280, 768, resizeOptions)
      .toFile(this.getPath(uuid, false));

    await webpImg
      .resize(192, 108, resizeOptions)
      .toFile(this.getPath(uuid, true));
    return uuid;
  }

  getImageStream(uuid, isThumb) {
    if (!fs.existsSync(this.getPath(uuid, isThumb))) {
      throw errorFactory(errors.imageNotFound, 'couldnt locate image with the uuid');
    }
    return fs.createReadStream(this.getPath(uuid, isThumb));
  }

  async deleteImages(uuid) {
    const removeImagePromise = new Promise((res, rej) => {
      fs.unlink(this.getPath(uuid, false), (err) => {
        err ? rej(err) : res();
      });
    });
    const removeThumbPromise = new Promise((res, rej) => {
      fs.unlink(this.getPath(uuid, true), (err) => {
        err ? rej(err) : res();
      });
    });
    return Promise.all([removeImagePromise, removeThumbPromise]);
  }
};
