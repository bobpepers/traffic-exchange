'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.placeholder = exports.uploadAvatar = undefined;

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs').promises;
var sharp = require('sharp');

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

var uploadAvatar = exports.uploadAvatar = async function uploadAvatar(req, res, next) {
  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    var data = void 0;
    try {
      data = await fs.readFile(process.cwd() + '/uploads/temp/' + req.file.filename);
    } catch (err) {
      throw new Error('AVATAR_NOT_FOUND');
    }
    try {
      await sharp(data).resize(100, 100).toFile(process.cwd() + '/uploads/avatars/' + req.user.username + '-' + req.file.filename);
    } catch (err) {
      throw new Error('ERROR_RESIZE_IMAGE');
    }
    try {
      await fs.unlink(process.cwd() + '/uploads/temp/' + req.file.filename);
    } catch (err) {
      throw new Error('UNABLE_TO_REMOVE_TEMP');
    }
    var user = await _models2.default.user.findOne({
      where: {
        id: req.user.id
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    if (user.avatar_path !== 'avatar.png') {
      try {
        await fs.unlink(process.cwd() + '/uploads/avatars/' + user.avatar_path);
      } catch (err) {
        // throw new Error('FAILED_REMOVING_OLD_AVATAR');
      }
    }
    var updatedUser = await user.update({
      avatar_path: req.user.username + '-' + req.file.filename
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    res.locals.avatar = updatedUser.avatar_path;
    t.afterCommit(function () {
      next();
    });
  }).catch(function (err) {
    res.locals.error = err.message;
    next();
  });
};

var placeholder = exports.placeholder = async function placeholder(req, res, next) {
  console.log('upload avatar 3 ');
  next();
};