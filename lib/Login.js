'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Login = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _auth = require('./auth');

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BaseLogin = function BaseLogin(props) {
  return _react2.default.cloneElement(props.children, {
    username: props.username,
    email: props.email,
    onSubmit: props.onSubmit,
    clearCache: props.clearCache,
    error: props.error
  });
};

var mapStateToProps = function mapStateToProps(state) {
  var username = '';
  if (state.cognito.user) {
    username = state.cognito.user.getUsername();
  } else if (state.cognito.userName) {
    username = state.cognito.cache.userName;
  }
  return {
    username: username,
    email: state.cognito.cache.email,
    config: state.cognito.config,
    userPool: state.cognito.userPool,
    error: state.cognito.error
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    authenticator: function authenticator(username, password, userPool, config) {
      return (0, _auth.authenticate)(username, password, userPool, config, dispatch);
    },
    clearCache: function clearCache() {
      return dispatch(_actions.Action.clearCache());
    }
  };
};

var mergeProps = function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, stateProps, {
    onSubmit: function onSubmit(username, password) {
      return dispatchProps.authenticator(username, password, stateProps.userPool, stateProps.config);
    },
    clearCache: dispatchProps.clearCache
  });
};

/**
 * Container for login behaviour, wrapping a login form.
 *
 * Magically provides the following props to the wrapped form:
 *
 *  * username
 *  * onSubmit
 *
 * @example
 * <Login>
 *   <LoginForm />
 * </Login>
 */
var Login = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps)(BaseLogin);

exports.Login = Login;