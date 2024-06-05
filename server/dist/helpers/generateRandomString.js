"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var allCapsAlpha = [].concat(_toConsumableArray("ABCDEFGHIJKLMNOPQRSTUVWXYZ"));
var allLowerAlpha = [].concat(_toConsumableArray("abcdefghijklmnopqrstuvwxyz"));
// const allUniqueChars = [..."~!@#$%^&*()_+-=[]\{}|;:'\",./<>?"];
var allNumbers = [].concat(_toConsumableArray("0123456789"));
var base = [].concat(_toConsumableArray(allCapsAlpha), _toConsumableArray(allNumbers), _toConsumableArray(allLowerAlpha));
var baseLow = [].concat(_toConsumableArray(allNumbers), _toConsumableArray(allLowerAlpha));

var generateRandomString = exports.generateRandomString = function generateRandomString(len) {
  return [].concat(_toConsumableArray(Array(len))).map(function (i) {
    return base[Math.random() * base.length | 0];
  }).join('');
};

// export const generateRandomStringLowCase = (len) => [...Array(len)]
//  .map((i) => baseLow[Math.random() * base.length | 0])
//  .join('');

var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
var charactersLength = characters.length;

var generateRandomStringLowCase = exports.generateRandomStringLowCase = function generateRandomStringLowCase(length) {
  var result = '';
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};