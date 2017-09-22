'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * container for all the actions
*/
var Action = {

  configure: function configure(config) {
    return {
      type: 'COGNITO_CONFIGURE',
      config: config
    };
  },

  authenticated: function authenticated(user) {
    return {
      type: 'COGNITO_AUTHENTICATED',
      user: user
    };
  },

  loggingIn: function loggingIn(attributes) {
    return {
      type: 'COGNITO_LOGGING_IN',
      attributes: attributes
    };
  },

  login: function login(creds, attributes, groups) {
    return {
      type: 'COGNITO_LOGIN',
      creds: creds,
      groups: groups,
      attributes: attributes
    };
  },

  logout: function logout() {
    return {
      type: 'COGNITO_LOGOUT'
    };
  },

  partialLogout: function partialLogout() {
    return {
      type: 'COGNITO_PARTIAL_LOGOUT'
    };
  },

  loginFailure: function loginFailure(user, error) {
    return {
      type: 'COGNITO_LOGIN_FAILURE',
      user: user,
      error: error
    };
  },

  mfaRequired: function mfaRequired(user) {
    return {
      type: 'COGNITO_LOGIN_MFA_REQUIRED',
      user: user
    };
  },

  newPasswordRequired: function newPasswordRequired(user) {
    return {
      type: 'COGNITO_LOGIN_NEW_PASSWORD_REQUIRED',
      user: user
    };
  },

  newPasswordRequiredFailure: function newPasswordRequiredFailure(user, error) {
    return {
      type: 'COGNITO_NEW_PASSWORD_REQUIRED_FAILURE',
      user: user,
      error: error
    };
  },

  emailVerificationRequired: function emailVerificationRequired(attributes) {
    return {
      type: 'COGNITO_EMAIL_VERIFICATION_REQUIRED',
      attributes: attributes
    };
  },

  emailVerificationFailed: function emailVerificationFailed(user, error) {
    return {
      type: 'COGNITO_EMAIL_VERIFICATION_FAILED',
      user: user,
      error: error
    };
  },

  beginPasswordResetFlow: function beginPasswordResetFlow(user, error) {
    return {
      type: 'COGNITO_BEGIN_PASSWORD_RESET_FLOW',
      user: user,
      error: error
    };
  },

  continuePasswordResetFlow: function continuePasswordResetFlow(user) {
    return {
      type: 'COGNITO_CONTINUE_PASSWORD_RESET_FLOW',
      user: user
    };
  },

  finishPasswordResetFlow: function finishPasswordResetFlow(error) {
    return {
      type: 'COGNITO_FINISH_PASSWORD_RESET_FLOW',
      error: error
    };
  },

  updateAttributes: function updateAttributes(attributes) {
    return {
      type: 'COGNITO_UPDATE_USER_ATTRIBUTES',
      attributes: attributes
    };
  },

  confirmationRequired: function confirmationRequired(user, email) {
    return {
      type: 'COGNITO_USER_UNCONFIRMED',
      user: user,
      email: email
    };
  },

  confirmFailed: function confirmFailed(user, error) {
    return {
      type: 'COGNITO_USER_CONFIRM_FAILED',
      user: user,
      error: error
    };
  },

  clearCache: function clearCache() {
    return {
      type: 'COGNITO_CLEAR_CACHE'
    };
  }
};

exports.Action = Action;