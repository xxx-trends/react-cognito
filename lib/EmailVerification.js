'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmailVerification = exports.verifyEmail = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BaseEmailVerification = function BaseEmailVerification(props) {
  return _react2.default.cloneElement(props.children, {
    error: props.error,
    onSubmit: props.onSubmit,
    onCancel: props.onCancel
  });
};

var verifyEmail = exports.verifyEmail = function verifyEmail(verificationCode, user, dispatch) {
  return new Promise(function (resolve, reject) {
    user.verifyAttribute('email', verificationCode, {
      onSuccess: function onSuccess() {
        dispatch(_actions.Action.login(user));
        resolve();
      },
      inputVerificationCode: function inputVerificationCode() {
        dispatch(_actions.Action.emailVerificationRequired(user));
        reject();
      },
      onFailure: function onFailure(error) {
        dispatch(_actions.Action.emailVerificationFailed(user, error.message));
        reject();
      }
    });
  });
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    error: state.cognito.error,
    user: state.cognito.user
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    verifyPartial: function verifyPartial(verificationCode, user) {
      return verifyEmail(verificationCode, user, dispatch);
    },
    onCancel: function onCancel() {
      return dispatch(_actions.Action.logout());
    }
  };
};

var mergeProps = function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, stateProps, dispatchProps, {
    onSubmit: function onSubmit(verificationCode) {
      return dispatchProps.verifyPartial(verificationCode, stateProps.user);
    }
  });
};

/**
 * Wrapper for an Email Verification Form.
 * Magically adds the following props to the contained form:
 *
 *  * user - the Cognito user from the Redux store
 *  * error - the persisted error from the Redux store
 *  * onSubmit - a handler that calls the Cognito verification API
 *
 * @example
 * <EmailVerification>
 *   <EmailVerificationForm />
 * </EmailVerification>
 *
 */
var EmailVerification = exports.EmailVerification = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps)(BaseEmailVerification);