const sharp = require('sharp');
const config = require('config');
const appRoot = require('app-root-path');
const uuidv4 = require('uuid/v4');
const fs = require('fs');

const imagePaths = config.get('server.imagesPath');

const resizeOptions = {
  withoutEnlargement: true,
  fit: 'contain',
  background: {
    r: 0, g: 0, b: 0, alpha: 0,
  },
};

const getPath = (uuid, isThumb) => `${appRoot}${imagePaths}${uuid}${isThumb ? '.thumb' : ''}.webp`;

const saveImage = async (image) => {
  const uuid = uuidv4();
  const webpImg = await sharp(image)
    .webp();
  await webpImg
    .resize(1280, 768, resizeOptions)
    .toFile(getPath(uuid, false));

  await webpImg
    .resize(192, 108, resizeOptions)
    .toFile(getPath(uuid, true));
  return uuid;
};

const getImageStream = (uuid, isThumb) => {
  if (!fs.existsSync(getPath(uuid, isThumb))) {
    throw new Error('File not found');
  }
  return fs.createReadStream(getPath(uuid, isThumb));
};

const deleteImages = (uuid) => {
  const removeImagePromise = new Promise((res, rej) => {
    fs.unlink(getPath(uuid, false), (err) => {
      // eslint-disable-next-line no-unused-expressions
      err ? rej(err) : res();
    });
  });
  const removeThumbPromise = new Promise((res, rej) => {
    fs.unlink(getPath(uuid, true), (err) => {
      // eslint-disable-next-line no-unused-expressions
      err ? rej(err) : res();
    });
  });
  return Promise.all(removeImagePromise, removeThumbPromise);
};

module.exports = { saveImage, getImageStream, deleteImages };
