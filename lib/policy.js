'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.identityPoolLogin = exports.emailVerificationRequired = exports.fetchAttributes = exports.direct = exports.enable = exports.setupCognito = undefined;

var _actions = require('./actions');

var _attributes = require('./attributes');

var _auth = require('./auth');

var _states = require('./states');

/**
 * subscribes a "policy" function to the store, and calls it
 * with the state and the dispatch function
 * @param {object} store - the redux store
 * @param {function} f - f(state, dispatch)
*/
var enable = function enable(store, f, params) {
  store.subscribe(function () {
    var state = store.getState();
    var dispatch = store.dispatch;
    f(state, dispatch, params);
  });
};

/**
 * requires email verification before transitioning from AUTHENTICATED
 * @param {object} state - the redux store state
 * @param {function} dispatch - the dispatch function
*/
var emailVerificationRequired = function emailVerificationRequired(state, dispatch) {
  if (state.cognito.state === _states.CognitoState.AUTHENTICATED) {
    var user = state.cognito.user;
    (0, _attributes.getUserAttributes)(user).then(function (attributes) {
      if (attributes.email_verified !== 'true') {
        (0, _auth.emailVerificationFlow)(user, attributes).then(dispatch);
      } else {
        dispatch(_actions.Action.loggingIn(attributes));
      }
    });
  }
};

/**
 * fetches and stores attributes before transitioning from AUTHENTICATED
 * @param {object} state - the redux store state
 * @param {function} dispatch - the dispatch function
*/
var fetchAttributes = function fetchAttributes(state, dispatch) {
  if (state.cognito.state === _states.CognitoState.AUTHENTICATED) {
    var user = state.cognito.user;
    (0, _attributes.getUserAttributes)(user).then(function (attributes) {
      dispatch(_actions.Action.loggingIn(attributes));
    });
  }
};

/**
 * transitions directly from AUTHENTICATED to LOGGING_IN
 * @param {object} state - the redux store state
 * @param {function} dispatch - the dispatch function
*/
var direct = function direct(state, dispatch) {
  if (state.cognito.state === _states.CognitoState.AUTHENTICATED) {
    dispatch(_actions.Action.loggingIn());
  }
};

/**
 * logs into the single federated identity pool to transition from LOGGING_IN
 * to LOGGED_IN
 * @param {object} state - the redux store state
 * @param {function} dispatch - the dispatch function
*/
var identityPoolLogin = function identityPoolLogin(state, dispatch, group) {
  if (state.cognito.state === _states.CognitoState.LOGGING_IN) {
    (0, _auth.performLogin)(state.cognito.user, state.cognito.config, group).then(dispatch);
  }
};

/**
 * sets up react-cognito with default policies.
*/
var setupCognito = function setupCognito(store, config) {
  var listeners = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [emailVerificationRequired, identityPoolLogin];

  store.dispatch(_actions.Action.configure(config));
  listeners.forEach(function (f) {
    enable(store, f, config.group);
  });
  store.dispatch(_actions.Action.loggingIn({}));
};

exports.setupCognito = setupCognito;
exports.enable = enable;
exports.direct = direct;
exports.fetchAttributes = fetchAttributes;
exports.emailVerificationRequired = emailVerificationRequired;
exports.identityPoolLogin = identityPoolLogin;