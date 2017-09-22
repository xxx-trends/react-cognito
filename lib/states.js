'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/** states stored in store.cognito.state */
var CognitoState = exports.CognitoState = {
  LOGGED_OUT: 'LOGGED_OUT',
  AUTHENTICATED: 'AUTHENTICATED',
  LOGGING_IN: 'LOGGING_IN',
  LOGGED_IN: 'LOGGED_IN',
  NEW_PASSWORD_REQUIRED: 'NEW_PASSWORD_REQUIRED',
  MFA_REQUIRED: 'MFA_REQUIRED',
  EMAIL_VERIFICATION_REQUIRED: 'EMAIL_VERIFICATION_REQUIRED',
  CONFIRMATION_REQUIRED: 'CONFIRMATION_REQUIRED'
};