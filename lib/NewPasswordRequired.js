'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NewPasswordRequired = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BaseNewPasswordRequired = function BaseNewPasswordRequired(props) {
  return _react2.default.cloneElement(props.children, {
    error: props.error,
    onSubmit: props.onSubmit
  });
};

var setNewPassword = function setNewPassword(password, user, config, userAttributes, dispatch) {
  return new Promise(function (resolve, reject) {
    user.completeNewPasswordChallenge(password, userAttributes, {
      onSuccess: function onSuccess() {
        dispatch(_actions.Action.authenticated(user));
        resolve();
      },
      onFailure: function onFailure(error) {
        dispatch(_actions.Action.newPasswordRequiredFailure(user, error.message));
        reject(error);
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

var mapStateToProps = function mapStateToProps(state) {
  return {
    error: state.cognito.error,
    user: state.cognito.user,
    config: state.cognito.config
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    setNewPasswordPartial: function setNewPasswordPartial(password, user, config, userAttributes) {
      return setNewPassword(password, user, config, userAttributes, dispatch);
    }
  };
};

var mergeProps = function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, stateProps, {
    onSubmit: function onSubmit(password, userAttributes) {
      return dispatchProps.setNewPasswordPartial(password, stateProps.user, stateProps.config, userAttributes);
    }
  });
};

/**
 * Wrapper for a New Password Required form
 *
 * Magically provides the following props to the wrapped element:
 *
 * * user - the Cognito user
 * * error - the persistent react-cognito error message
 * * onSubmit - a handler that calls the Set New Password API
 *
 * @example
 *
 * <NewPasswordRequired>
 *   <NewPasswordRequiredForm />
 * </NewPasswordRequired>
 */
var NewPasswordRequired = exports.NewPasswordRequired = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps)(BaseNewPasswordRequired);