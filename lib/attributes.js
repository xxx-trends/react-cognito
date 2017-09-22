'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mkAttrList = exports.updateAttributes = exports.getUserAttributes = exports.sendAttributeVerificationCode = undefined;

var _actions = require('./actions');

/**
 * Request that a verification code is sent by email or SMS to verify
 * an attribute
 * @param {object} user - the cognito user object
 * @param {string} attribute - the attribute name
*/
var sendAttributeVerificationCode = function sendAttributeVerificationCode(user, attribute) {
  return new Promise(function (resolve, reject) {
    user.getAttributeVerificationCode(attribute, {
      onSuccess: function onSuccess() {
        return resolve(false);
      },
      inputVerificationCode: function inputVerificationCode() {
        return resolve(true);
      },
      onFailure: function onFailure(error) {
        return reject(error.message);
      }
    });
  });
};

/**
 * Fetches the user attributes from Cognito, and turns them into
 * an object
 * @param {object} user - the cognito user object
 * @returns {Promise} resolves with the attributes or rejects with an error message
*/
var getUserAttributes = function getUserAttributes(user) {
  return new Promise(function (resolve, reject) {
    return user.getUserAttributes(function (error, result) {
      if (error) {
        reject(error.message);
      } else {
        var attributes = {};
        for (var i = 0; i < result.length; i += 1) {
          var name = result[i].getName();
          var value = result[i].getValue();
          attributes[name] = value;
        }
        resolve(attributes);
      }
    });
  });
};

/**
 * convert an attribute dictionary to an attribute list
 * @param {object} attributes - a dictionary of attributes
 * @return {array} AWS expected attribute list
*/
var mkAttrList = function mkAttrList(attributes) {
  return Object.keys(attributes).map(function (key) {
    return {
      Name: key,
      Value: attributes[key]
    };
  });
};

/**
 * update the attributes in Cognito
 * @param {object} user - the CognitoUser object
 * @param {object} attributes - an attributes dictionary with the attributes to be updated
 * @return {Promise<object>} a promise that resolves to a redux action
*/
var updateAttributes = function updateAttributes(user, attributes) {
  return new Promise(function (resolve, reject) {
    var attributeList = mkAttrList(attributes);
    user.updateAttributes(attributeList, function (err) {
      if (err) {
        reject(err.message);
      } else {
        resolve(_actions.Action.updateAttributes(attributes));
      }
    });
  });
};

exports.sendAttributeVerificationCode = sendAttributeVerificationCode;
exports.getUserAttributes = getUserAttributes;
exports.updateAttributes = updateAttributes;
exports.mkAttrList = mkAttrList;