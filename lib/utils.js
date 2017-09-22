'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGroups = exports.buildLogins = exports.changePassword = undefined;

var _global = require('aws-sdk/global');

/**
 * Change a user's password
 * @param {object} user - the cognito user object
 * @param {string} oldPassword - the current password
 * @param {string} newPassword - the new password
*/
var changePassword = function changePassword(user, oldPassword, newPassword) {
  return new Promise(function (resolve, reject) {
    return user.changePassword(oldPassword, newPassword, function (err, result) {
      if (err) {
        reject(err.message);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * builds the federated identity pool login structure
 * @param {string} username - the username of the user
 * @param {string} jwtToken - a JWT Token from the session
 * @param {object} config - the cognito react config object
*/
var buildLogins = function buildLogins(username, jwtToken, config) {
  var loginDomain = 'cognito-idp.' + config.region + '.amazonaws.com';
  var loginUrl = loginDomain + '/' + config.userPool;
  var creds = {
    IdentityPoolId: config.identityPool,
    Logins: {},
    LoginId: username // https://github.com/aws/aws-sdk-js/issues/609
  };
  creds.Logins[loginUrl] = jwtToken;
  return creds;
};

/**
 * Decode a jwtToken to check for cognito:groups
 * @param {string} jwtToken - a JWT Token from the session
 */
var getGroups = function getGroups(jwtToken) {
  var payload = jwtToken.split('.')[1];
  var decodedToken = JSON.parse(_global.util.base64.decode(payload).toString('utf8'));
  // decodedToken['cognito:groups'] can be undefined if user is in no groups
  if (!decodedToken['cognito:groups']) {
    return [];
  }
  return decodedToken['cognito:groups'];
};

exports.changePassword = changePassword;
exports.buildLogins = buildLogins;
exports.getGroups = getGroups;