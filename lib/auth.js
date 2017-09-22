'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emailVerificationFlow = exports.registerUser = exports.performLogin = exports.authenticate = undefined;

var _amazonCognitoIdentityJs = require('amazon-cognito-identity-js');

var _actions = require('./actions');

var _attributes = require('./attributes');

var _utils = require('./utils');

var CognitoIdentityCredentials = require('aws-sdk/lib/credentials/cognito_identity_credentials');

/**
 * sends the email verification code and transitions to the correct state
 * @param {object} user - the CognitoUser object
 * @param {object} attributes - the attributes dictionary
 * @return {Promise<object>} a promise that resolves to a redux action
*/
var emailVerificationFlow = function emailVerificationFlow(user, attributes) {
  return new Promise(function (resolve) {
    return (0, _attributes.sendAttributeVerificationCode)(user, 'email').then(function (required) {
      if (required) {
        resolve(_actions.Action.emailVerificationRequired(attributes));
      } else {
        // dead end?
        resolve(_actions.Action.loggingIn(attributes));
      }
    }, function (error) {
      // some odd classes of error here
      resolve(_actions.Action.emailVerificationFailed(error, attributes));
    });
  });
};

/**
 * logs in to the federated identity pool with a JWT
 * @param {string} username - the username
 * @param {string} jwtToken - a token from the session
 * @param {object} config - the react-cognito config
 * @return {Promise<object>} a promise that resolves to the federated identity credentials
*/
var refreshIdentityCredentials = function refreshIdentityCredentials(username, jwtToken, config) {
  return new Promise(function (resolve, reject) {
    var logins = (0, _utils.buildLogins)(username, jwtToken, config);
    var creds = new CognitoIdentityCredentials(logins, { region: config.region });
    creds.refresh(function (error) {
      if (error) {
        reject(error.message);
      } else {
        resolve(creds);
      }
    });
  });
};

/**
 * establishes a session with the user pool, and logs into the federated identity
 * pool using a token from the session
 * @param {object} user - the CognitoUser object
 * @param {object} config -the react-cognito config
 * @param group
 * @return {Promise<object>} an action to be dispatched
*/
var performLogin = function performLogin(user, config, group) {
  return new Promise(function (resolve) {
    if (user === null) {
      resolve(_actions.Action.logout());
    } else {
      user.getSession(function (err, session) {
        if (err) {
          resolve(_actions.Action.loginFailure(user, err.message));
        } else {
          var jwtToken = session.getIdToken().getJwtToken();
          var groups = (0, _utils.getGroups)(jwtToken);
          if (group && !groups.includes(group)) {
            return resolve(_actions.Action.loginFailure(user, 'Insufficient privilege'));
          }

          var username = user.getUsername();
          refreshIdentityCredentials(username, jwtToken, config).then(function (creds) {
            (0, _attributes.getUserAttributes)(user).then(function (attributes) {
              resolve(_actions.Action.login(creds, attributes, groups));
            });
          }, function (message) {
            return resolve(_actions.Action.loginFailure(user, message));
          });
        }
      });
    }
  });
};

/**
 *
 * Authenticates with a user pool, and handles responses.
 * if the authentication is successful it then logs in to the
 * identity pool.
 *
 * returns an action depending on the outcome.  Possible actions returned
 * are:
 *
 * - login - valid user who is logged in
 * - loginFailure - failed to authenticate with user pool or identity pool
 * - mfaRequired - user now needs to enter MFA
 * - newPasswordRequired - user must change password on first login
 * - emailVerificationRequired - user must verify their email address
 * - emailVerificationFailed - email verification is required, but won't work
 *
 * Dispatch the resulting action, e.g.:
 *
 * ```
 * const { userPool, config } = state.cognito;
 * authenticate(username, password, userPool, config).then(dispatch);
 * ```
 *
 * @param {string} username - the username provided by the user
 * @param {string} password - the password provided by the user
 * @param {object} userPool - a Cognito User Pool object
 * @return {Promise<object>} - a promise that resolves an action to be dispatched
 *
*/
var authenticate = function authenticate(username, password, userPool, config, dispatch) {
  return new Promise(function (resolve, reject) {
    var creds = new _amazonCognitoIdentityJs.AuthenticationDetails({
      Username: username,
      Password: password
    });

    var user = new _amazonCognitoIdentityJs.CognitoUser({
      Username: username,
      Pool: userPool
    });

    user.authenticateUser(creds, {
      onSuccess: function onSuccess() {
        dispatch(_actions.Action.authenticated(user));
        resolve();
      },
      onFailure: function onFailure(error) {
        if (error.code === 'UserNotConfirmedException') {
          dispatch(_actions.Action.confirmationRequired(user));
          resolve();
        } else {
          dispatch(_actions.Action.loginFailure(user, error.message));
          reject(error);
        }
      },
      mfaRequired: function mfaRequired() {
        dispatch(_actions.Action.mfaRequired(user));
        resolve();
      },
      newPasswordRequired: function newPasswordRequired() {
        dispatch(_actions.Action.newPasswordRequired(user));
        resolve();
      }
    });
  });
};

/**
 * sign up this user with the user pool provided
 * @param {object} userPool - a Cognito userpool (e.g. state.cognito.userPool)
 * @param {object} config - the react-cognito config object
 * @param {string} username - the username
 * @param {string} password - the password
 * @param {object} attributes - an attributes dictionary
 * @return {Promise<object>} a promise that resolves a redux action
*/
var registerUser = function registerUser(userPool, config, username, password, attributes) {
  return new Promise(function (resolve, reject) {
    return userPool.signUp(username, password, (0, _attributes.mkAttrList)(attributes), null, function (err, result) {
      if (err) {
        reject(err.message);
      } else if (result.userConfirmed === false) {
        resolve(_actions.Action.confirmationRequired(result.user, attributes.email));
      } else {
        resolve(authenticate(username, password, userPool));
      }
    });
  });
};

exports.authenticate = authenticate;
exports.performLogin = performLogin;
exports.registerUser = registerUser;
exports.emailVerificationFlow = emailVerificationFlow;