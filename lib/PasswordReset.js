'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PasswordReset = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _amazonCognitoIdentityJs = require('amazon-cognito-identity-js');

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BasePasswordReset = function BasePasswordReset(props) {
  return _react2.default.cloneElement(props.children, {
    username: props.username,
    sendVerificationCode: props.sendVerificationCode,
    setPassword: props.setPassword
  });
};

var getUser = function getUser(username, userPool) {
  var user = new _amazonCognitoIdentityJs.CognitoUser({
    Username: username,
    Pool: userPool
  });
  return user;
};

var setPassword = function setPassword(username, userPool, code, password, dispatch) {
  return new Promise(function (resolve, reject) {
    var user = getUser(username, userPool);
    user.confirmPassword(code, password, {
      onSuccess: function onSuccess() {
        dispatch(_actions.Action.finishPasswordResetFlow()), resolve();
      },
      onFailure: function onFailure(err) {
        dispatch(_actions.Action.beginPasswordResetFlow(user, err.message)), reject(err);
      }
    });
  });
};

var sendVerificationCode = function sendVerificationCode(username, userPool, dispatch) {
  return new Promise(function (resolve, reject) {
    var user = getUser(username, userPool);
    user.forgotPassword({
      onSuccess: function onSuccess() {
        dispatch(_actions.Action.continuePasswordResetFlow(user));
        resolve();
      },
      onFailure: function onFailure(err) {
        dispatch(_actions.Action.beginPasswordResetFlow(user, err.message));
        reject(err);
      }
    });
  });
};

var mapStateToProps = function mapStateToProps(state) {
  var props = {
    user: state.cognito.user,
    username: '',
    userPool: state.cognito.userPool
  };
  if (state.cognito.user != null) {
    props.username = state.cognito.user.getUsername();
  }
  return props;
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    sendVerificationCodePartial: function sendVerificationCodePartial(username, userPool) {
      return sendVerificationCode(username, userPool, dispatch);
    },
    setPasswordPartial: function setPasswordPartial(user, userPool, code, password) {
      return setPassword(user, userPool, code, password, dispatch);
    }
  };
};

var mergeProps = function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, stateProps, {
    sendVerificationCode: function sendVerificationCode(username) {
      return dispatchProps.sendVerificationCodePartial(username, stateProps.userPool);
    },
    setPassword: function setPassword(username, code, password) {
      return dispatchProps.setPasswordPartial(username, stateProps.userPool, code, password);
    }
  });
};

/**
 * Container for a Password Reset form
 *
 * Magically provides the following props to the wrapped element:
 *
 *  * user
 *  * username
 *  * sendVerificationCode
 *  * setPassword
 *
 * @example
 * <PasswordReset>
 *   <PasswordResetForm />
 * </PasswordReset>
 */
var PasswordReset = exports.PasswordReset = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps)(BasePasswordReset);