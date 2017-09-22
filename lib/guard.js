"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/*
 Default behaviour is to restrict access to only logged in users
*/

var testLoggedIn = function testLoggedIn(state, wantLoggedIn) {
  var isLoggedIn = state.cognito.user !== null;
  if (isLoggedIn && wantLoggedIn) {
    return true;
  }
  if (!isLoggedIn && !wantLoggedIn) {
    return true;
  }
  return false;
};

var permitted = function permitted(state, expr) {
  return new Promise(function (resolve) {
    if (expr.loggedIn !== undefined) {
      resolve(testLoggedIn(state, expr.loggedIn));
    } else {
      resolve(testLoggedIn(state, true));
    }
  });
};

var guard = function guard(store, forbiddenUrl) {
  var expr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var routeState = arguments[3];
  var replace = arguments[4];
  var callback = arguments[5];

  var state = store.getState();
  var dest = forbiddenUrl;

  if (expr.forbiddenUrl !== undefined) {
    dest = expr.forbiddenUrl;
  }
  permitted(state, expr).then(function (allow) {
    if (!allow) {
      replace(dest);
    }
    callback();
  });
};

/**
 * creates a guard function you can use in <Route> tags
 * @param {object} store - the redux store
 * @param {string} forbiddenUrl - the default url to navigate to if forbidden
 * @returns {function} - a function that can be provided to onEnter
*/
var createGuard = function createGuard(store, forbiddenUrl) {
  return function (expr) {
    return function (state, replace, callback) {
      return guard(store, forbiddenUrl, expr, state, replace, callback);
    };
  };
};

exports.createGuard = createGuard;