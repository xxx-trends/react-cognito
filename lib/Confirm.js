'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Confirm = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BaseConfirm = function BaseConfirm(props) {
  return _react2.default.cloneElement(props.children, {
    error: props.error,
    onSubmit: props.onSubmit,
    onResend: props.onResend,
    onCancel: props.onCancel
  });
};

var confirm = function confirm(verificationCode, user, dispatch) {
  return new Promise(function (resolve, reject) {
    user.confirmRegistration(verificationCode, true, function (error) {
      if (error) {
        dispatch(_actions.Action.confirmFailed(user));
        reject(error.message);
      } else {
        dispatch(_actions.Action.partialLogout());
        resolve(user);
      }
    });
  });
};

var resend = function resend(user, dispatch) {
  return new Promise(function (resolve, reject) {
    user.resendConfirmationCode(function (err) {
      if (err) {
        dispatch(_actions.Action.confirmationRequired(user));
        reject(err.message);
      } else {
        dispatch(_actions.Action.confirmationRequired(user));
        resolve(user);
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
    confirmPartial: function confirmPartial(verificationCode, user) {
      return confirm(verificationCode, user, dispatch);
    },
    onCancel: function onCancel() {
      return dispatch(_actions.Action.logout());
    },
    onResendPartial: function onResendPartial(user) {
      return resend(user, dispatch);
    }
  };
};

var mergeProps = function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, stateProps, dispatchProps, {
    onSubmit: function onSubmit(verificationCode) {
      return dispatchProps.confirmPartial(verificationCode, stateProps.user);
    },
    onResend: function onResend() {
      return dispatchProps.onResendPartial(stateProps.user);
    }
  });
};

/**
 * Container for a confirmation form.  Magically adds the following props to the 
 * contained form:
 *
 *  * user - the Cognito User from the redux store
 *  * error - the persisted error from the redux store
 *  * onSubmit - a handler that calls the Cognito confirm API
 *  * onResend - a handler that calls the Cognito resend request API
 *  * onCancel - Logs the user out completely
 *
 * @example
 * <Confirm>
 *   <ConfirmForm />
 * </Confirm>
 *
 */
var Confirm = exports.Confirm = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps)(BaseConfirm);