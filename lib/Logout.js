'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Logout = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Container for logout behaviour.
 * @example
 * <Logout onLogout={handler}>
 *   <LogoutForm />
 * </Logout>
 */
var Logout = exports.Logout = function (_React$Component) {
  _inherits(Logout, _React$Component);

  function Logout() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Logout);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Logout.__proto__ || Object.getPrototypeOf(Logout)).call.apply(_ref, [this].concat(args))), _this), _this.onClick = function (event) {
      var store = _this.context.store;

      var state = store.getState();
      state.cognito.user.signOut();
      event.preventDefault();
      store.dispatch(_actions.Action.logout());
      _this.props.onLogout();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  /**
   * Passed to child element as onClick prop.
   * Signs the user out, and then dispatches the logout action
   * If you want to take further actions (like reloading UI) then add an
   * onLogout property to the Logout element
   */


  _createClass(Logout, [{
    key: 'render',


    /**
     * renders the child element, adding an onClick property
     */
    value: function render() {
      return _react2.default.cloneElement(this.props.children, {
        onClick: this.onClick
      });
    }
  }]);

  return Logout;
}(_react2.default.Component);

Logout.contextTypes = {
  store: _react.PropTypes.object
};
Logout.propTypes = {
  children: _react2.default.PropTypes.any.isRequired,
  onLogout: _react2.default.PropTypes.func
};
Logout.defaultProps = {
  onLogout: function onLogout() {}
};