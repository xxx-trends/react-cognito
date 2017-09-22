'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cognito = undefined;

var _amazonCognitoIdentityJs = require('amazon-cognito-identity-js');

var _states = require('./states');

/* global AWS */

var initial = {
  user: null,
  cache: { // cached for post register login
    userName: null,
    email: null
  },
  state: _states.CognitoState.LOGGED_OUT,
  error: '',
  userPool: null,
  attributes: {},
  creds: null,
  groups: [],
  config: {
    region: null,
    userPool: null,
    clientId: null,
    identityPool: null
  }
};

var configure = function configure(state, action) {
  // surprise side-effect!
  AWS.config.region = action.config.region;
  var pool = new _amazonCognitoIdentityJs.CognitoUserPool({
    UserPoolId: action.config.userPool,
    ClientId: action.config.clientId
  });
  var user = pool.getCurrentUser();
  return Object.assign({}, state, {
    config: action.config,
    userPool: pool,
    user: user
  });
};

// sometimes we don't get the attributes in later parts of the login flow
// but lets not clobber the ones we've got if we've not got them
var addAttributes = function addAttributes(s, attributes) {
  var s2 = Object.assign({}, s);
  if (attributes) {
    s2.attributes = attributes;
  }
  return s2;
};

/**
 * reducer function to be passed to redux combineReducers
 * @param {object} state
 * @param {object} action
*/

var cognito = exports.cognito = function cognito() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initial;
  var action = arguments[1];

  switch (action.type) {

    case 'COGNITO_CONFIGURE':
      return configure(state, action);

    case 'COGNITO_AUTHENTICATED':
      return Object.assign({}, state, {
        user: action.user,
        cache: {
          userName: null,
          email: null
        },
        error: '',
        state: _states.CognitoState.AUTHENTICATED
      });

    case 'COGNITO_CLEAR_CACHE':
      return Object.assign({}, state, {
        cache: {
          userName: null,
          email: null
        }
      });

    case 'COGNITO_LOGGING_IN':
      return Object.assign({}, state, {
        state: _states.CognitoState.LOGGING_IN,
        attributes: action.attributes
      });

    case 'COGNITO_LOGIN':
      return Object.assign({}, state, addAttributes({
        error: '',
        creds: action.creds,
        groups: action.groups,
        state: _states.CognitoState.LOGGED_IN
      }, action.attributes));

    case 'COGNITO_LOGOUT':
      return Object.assign({}, state, {
        user: null,
        attributes: {},
        error: '',
        creds: null,
        groups: [],
        state: _states.CognitoState.LOGGED_OUT
      });

    case 'COGNITO_PARTIAL_LOGOUT':
      return Object.assign({}, state, {
        user: null,
        userName: state.user.username,
        error: '',
        creds: null,
        groups: [],
        state: _states.CognitoState.LOGGED_OUT
      });

    case 'COGNITO_LOGIN_FAILURE':
      return Object.assign({}, state, {
        user: action.user,
        state: _states.CognitoState.LOGGED_OUT,
        error: action.error
      });

    case 'COGNITO_LOGIN_MFA_REQUIRED':
      return Object.assign({}, state, {
        user: action.user,
        error: '',
        state: _states.CognitoState.MFA_REQUIRED
      });

    case 'COGNITO_LOGIN_NEW_PASSWORD_REQUIRED':
      return Object.assign({}, state, {
        user: action.user,
        error: '',
        state: _states.CognitoState.NEW_PASSWORD_REQUIRED
      });

    case 'COGNITO_USER_UNCONFIRMED':
      return Object.assign({}, state, {
        user: action.user,
        state: _states.CognitoState.CONFIRMATION_REQUIRED,
        cache: {
          userName: action.user.username,
          email: action.email ? action.email : state.cache.email
        }
      });

    case 'COGNITO_USER_CONFIRM_FAILED':
      return Object.assign({}, state, {
        user: action.user,
        state: _states.CognitoState.CONFIRMATION_REQUIRED,
        error: action.error
      });

    case 'COGNITO_NEW_PASSWORD_REQUIRED_FAILURE':
      return Object.assign({}, state, {
        error: action.error,
        state: _states.CognitoState.NEW_PASSWORD_REQUIRED
      });

    case 'COGNITO_EMAIL_VERIFICATION_REQUIRED':
      return Object.assign({}, state, addAttributes({
        error: '',
        state: _states.CognitoState.EMAIL_VERIFICATION_REQUIRED
      }, action.attributes));

    case 'COGNITO_EMAIL_VERIFICATION_FAILED':
      return Object.assign({}, state, addAttributes({
        error: action.error,
        state: _states.CognitoState.EMAIL_VERIFICATION_REQUIRED
      }, action.attributes));

    case 'COGNITO_BEGIN_PASSWORD_RESET_FLOW':
      return Object.assign({}, state, {
        error: action.error
      });

    case 'COGNITO_CONTINUE_PASSWORD_RESET_FLOW':
      return state;

    case 'COGNITO_FINISH_PASSWORD_RESET_FLOW':
      return state;

    // this moves us into the AUTHENTICATED state, potentially causing
    // a number of side-effects. this is so we can re-verify the email
    // address if we have to
    case 'COGNITO_UPDATE_USER_ATTRIBUTES':
      return Object.assign({}, state, {
        attributes: Object.assign({}, state.attributes, action.attributes),
        state: _states.CognitoState.AUTHENTICATED
      });

    default:
      return state;
  }
};