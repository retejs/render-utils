/*!
* rete-render-utils v2.0.0
* (c) 2024 Vitaliy Stoliarov
* Released under the MIT license.
* */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _slicedToArray = require('@babel/runtime/helpers/slicedToArray');
var _asyncToGenerator = require('@babel/runtime/helpers/asyncToGenerator');
var _classCallCheck = require('@babel/runtime/helpers/classCallCheck');
var _createClass = require('@babel/runtime/helpers/createClass');
var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var _regeneratorRuntime = require('@babel/runtime/regenerator');
var reteAreaPlugin = require('rete-area-plugin');
var _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
var _inherits = require('@babel/runtime/helpers/inherits');
var _possibleConstructorReturn = require('@babel/runtime/helpers/possibleConstructorReturn');
var _getPrototypeOf = require('@babel/runtime/helpers/getPrototypeOf');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _slicedToArray__default = /*#__PURE__*/_interopDefaultLegacy(_slicedToArray);
var _asyncToGenerator__default = /*#__PURE__*/_interopDefaultLegacy(_asyncToGenerator);
var _classCallCheck__default = /*#__PURE__*/_interopDefaultLegacy(_classCallCheck);
var _createClass__default = /*#__PURE__*/_interopDefaultLegacy(_createClass);
var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);
var _regeneratorRuntime__default = /*#__PURE__*/_interopDefaultLegacy(_regeneratorRuntime);
var _toConsumableArray__default = /*#__PURE__*/_interopDefaultLegacy(_toConsumableArray);
var _inherits__default = /*#__PURE__*/_interopDefaultLegacy(_inherits);
var _possibleConstructorReturn__default = /*#__PURE__*/_interopDefaultLegacy(_possibleConstructorReturn);
var _getPrototypeOf__default = /*#__PURE__*/_interopDefaultLegacy(_getPrototypeOf);

/**
 * Get classic SVG path for a connection between two points.
 * @param points Array of two points
 * @param curvature Curvature of the connection
 */
function classicConnectionPath(points, curvature) {
  var _points = _slicedToArray__default["default"](points, 2),
    _points$ = _points[0],
    x1 = _points$.x,
    y1 = _points$.y,
    _points$2 = _points[1],
    x2 = _points$2.x,
    y2 = _points$2.y;
  var vertical = Math.abs(y1 - y2);
  var hx1 = x1 + Math.max(vertical / 2, Math.abs(x2 - x1)) * curvature;
  var hx2 = x2 - Math.max(vertical / 2, Math.abs(x2 - x1)) * curvature;
  return "M ".concat(x1, " ").concat(y1, " C ").concat(hx1, " ").concat(y1, " ").concat(hx2, " ").concat(y2, " ").concat(x2, " ").concat(y2);
}

/**
 * Get loop SVG path for a connection between two points.
 * @param points Array of two points
 * @param curvature Curvature of the loop
 * @param size Size of the loop
 */
function loopConnectionPath(points, curvature, size) {
  var _points2 = _slicedToArray__default["default"](points, 2),
    _points2$ = _points2[0],
    x1 = _points2$.x,
    y1 = _points2$.y,
    _points2$2 = _points2[1],
    x2 = _points2$2.x,
    y2 = _points2$2.y;
  var k = y2 > y1 ? 1 : -1;
  var scale = size + Math.abs(x1 - x2) / (size / 2);
  var middleX = (x1 + x2) / 2;
  var middleY = y1 - k * scale;
  var vertical = (y2 - y1) * curvature;
  return "\n        M ".concat(x1, " ").concat(y1, "\n        C ").concat(x1 + scale, " ").concat(y1, "\n        ").concat(x1 + scale, " ").concat(middleY - vertical, "\n        ").concat(middleX, " ").concat(middleY, "\n        C ").concat(x2 - scale, " ").concat(middleY + vertical, "\n        ").concat(x2 - scale, " ").concat(y2, "\n        ").concat(x2, " ").concat(y2, "\n    ");
}

/* eslint-disable max-statements */

/**
* Calculates the center coordinates of a child element relative to a parent element.
* @async
* @param child The child element whose center coordinates need to be calculated.
* @param parent The parent element relative to which the child element's center is calculated.
* @returns Position of the child element's center
* @throws Error if the child element has a null offsetParent.
*/
function getElementCenter(_x, _x2) {
  return _getElementCenter.apply(this, arguments);
}
function _getElementCenter() {
  _getElementCenter = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee(child, parent) {
    var x, y, currentElement, width, height;
    return _regeneratorRuntime__default["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (child.offsetParent) {
            _context.next = 5;
            break;
          }
          _context.next = 3;
          return new Promise(function (res) {
            return setTimeout(res, 0);
          });
        case 3:
          _context.next = 0;
          break;
        case 5:
          x = child.offsetLeft;
          y = child.offsetTop;
          currentElement = child.offsetParent;
          if (currentElement) {
            _context.next = 10;
            break;
          }
          throw new Error('child has null offsetParent');
        case 10:
          while (currentElement !== null && currentElement !== parent) {
            x += currentElement.offsetLeft + currentElement.clientLeft;
            y += currentElement.offsetTop + currentElement.clientTop;
            currentElement = currentElement.offsetParent;
          }
          width = child.offsetWidth;
          height = child.offsetHeight;
          return _context.abrupt("return", {
            x: x + width / 2,
            y: y + height / 2
          });
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _getElementCenter.apply(this, arguments);
}
var EventEmitter = /*#__PURE__*/function () {
  function EventEmitter() {
    _classCallCheck__default["default"](this, EventEmitter);
    _defineProperty__default["default"](this, "listeners", new Set());
  }
  _createClass__default["default"](EventEmitter, [{
    key: "emit",
    value: function emit(data) {
      this.listeners.forEach(function (listener) {
        return listener(data);
      });
    }
  }, {
    key: "listen",
    value: function listen(handler) {
      var _this = this;
      this.listeners.add(handler);
      return function () {
        _this.listeners["delete"](handler);
      };
    }
  }]);
  return EventEmitter;
}();

var SocketsPositionsStorage = /*#__PURE__*/function () {
  function SocketsPositionsStorage() {
    _classCallCheck__default["default"](this, SocketsPositionsStorage);
    _defineProperty__default["default"](this, "elements", new Map());
  }
  _createClass__default["default"](SocketsPositionsStorage, [{
    key: "getPosition",
    value: function getPosition(data) {
      var _found$pop;
      var list = Array.from(this.elements.values()).flat();
      var found = list.filter(function (item) {
        return item.side === data.side && item.nodeId === data.nodeId && item.key === data.key;
      });

      // eslint-disable-next-line no-console
      if (found.length > 1) console.warn(['Found more than one element for socket with same key and side.', 'Probably it was not unmounted correctly'].join(' '), data);
      return ((_found$pop = found.pop()) === null || _found$pop === void 0 ? void 0 : _found$pop.position) || null;
    }
  }, {
    key: "add",
    value: function add(data) {
      var existing = this.elements.get(data.element);
      this.elements.set(data.element, existing ? [].concat(_toConsumableArray__default["default"](existing.filter(function (n) {
        return !(n.nodeId === data.nodeId && n.key === data.key && n.side === data.side);
      })), [data]) : [data]);
    }
  }, {
    key: "remove",
    value: function remove(element) {
      this.elements["delete"](element);
    }
  }, {
    key: "snapshot",
    value: function snapshot() {
      return Array.from(this.elements.values()).flat();
    }
  }]);
  return SocketsPositionsStorage;
}();

/**
 * Abstract class for socket position calculation. It can be extended to implement custom socket position calculation.
 * @abstract
 * @listens render
 * @listens rendered
 * @listens unmount
 * @listens nodetranslated
 * @listens noderesized
 */
var BaseSocketPosition = /*#__PURE__*/function () {
  function BaseSocketPosition() {
    _classCallCheck__default["default"](this, BaseSocketPosition);
    _defineProperty__default["default"](this, "sockets", new SocketsPositionsStorage());
    _defineProperty__default["default"](this, "emitter", new EventEmitter());
    _defineProperty__default["default"](this, "area", null);
  }
  _createClass__default["default"](BaseSocketPosition, [{
    key: "attach",
    value:
    /**
     * Attach the watcher to the area's child scope.
     * @param scope Scope of the watcher that should be a child of `BaseAreaPlugin`
     */
    function attach(scope) {
      var _this = this;
      if (this.area) return;
      if (!scope.hasParent()) return;
      this.area = scope.parentScope(reteAreaPlugin.BaseAreaPlugin);

      // eslint-disable-next-line max-statements, complexity
      this.area.addPipe( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee2(context) {
          var _context$data, _nodeId, _key, _side, _element, position, _nodeId2, _context$data$payload, source, target, _nodeId3;
          return _regeneratorRuntime__default["default"].wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                if (!(context.type === 'rendered' && context.data.type === 'socket')) {
                  _context2.next = 8;
                  break;
                }
                _context$data = context.data, _nodeId = _context$data.nodeId, _key = _context$data.key, _side = _context$data.side, _element = _context$data.element;
                _context2.next = 4;
                return _this.calculatePosition(_nodeId, _side, _key, _element);
              case 4:
                position = _context2.sent;
                if (position) {
                  _this.sockets.add({
                    nodeId: _nodeId,
                    key: _key,
                    side: _side,
                    element: _element,
                    position: position
                  });
                  _this.emitter.emit({
                    nodeId: _nodeId,
                    key: _key,
                    side: _side
                  });
                }
                _context2.next = 24;
                break;
              case 8:
                if (!(context.type === 'unmount')) {
                  _context2.next = 12;
                  break;
                }
                _this.sockets.remove(context.data.element);
                _context2.next = 24;
                break;
              case 12:
                if (!(context.type === 'nodetranslated')) {
                  _context2.next = 16;
                  break;
                }
                _this.emitter.emit({
                  nodeId: context.data.id
                });
                _context2.next = 24;
                break;
              case 16:
                if (!(context.type === 'noderesized')) {
                  _context2.next = 23;
                  break;
                }
                _nodeId2 = context.data.id;
                _context2.next = 20;
                return Promise.all(_this.sockets.snapshot().filter(function (item) {
                  return item.nodeId === context.data.id && item.side === 'output';
                }).map( /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee(item) {
                    var side, key, element, position;
                    return _regeneratorRuntime__default["default"].wrap(function _callee$(_context) {
                      while (1) switch (_context.prev = _context.next) {
                        case 0:
                          side = item.side, key = item.key, element = item.element;
                          _context.next = 3;
                          return _this.calculatePosition(_nodeId2, side, key, element);
                        case 3:
                          position = _context.sent;
                          if (position) {
                            item.position = position;
                          }
                        case 5:
                        case "end":
                          return _context.stop();
                      }
                    }, _callee);
                  }));
                  return function (_x2) {
                    return _ref2.apply(this, arguments);
                  };
                }()));
              case 20:
                _this.emitter.emit({
                  nodeId: _nodeId2
                });
                _context2.next = 24;
                break;
              case 23:
                if (context.type === 'render' && context.data.type === 'connection') {
                  _context$data$payload = context.data.payload, source = _context$data$payload.source, target = _context$data$payload.target;
                  _nodeId3 = source || target;
                  _this.emitter.emit({
                    nodeId: _nodeId3
                  });
                }
              case 24:
                return _context2.abrupt("return", context);
              case 25:
              case "end":
                return _context2.stop();
            }
          }, _callee2);
        }));
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }

    /**
     * Listen to socket position changes. Usually used by rendering plugins to update the start/end of the connection.
     * @internal
     * @param nodeId Node ID
     * @param side Side of the socket, 'input' or 'output'
     * @param key Socket key
     * @param change Callback function that is called when the socket position changes
     */
  }, {
    key: "listen",
    value: function listen(nodeId, side, key, change) {
      var _this2 = this;
      var unlisten = this.emitter.listen(function (data) {
        if (data.nodeId !== nodeId) return;
        if ((!data.key || data.side === side) && (!data.side || data.key === key)) {
          var _this2$area;
          var position = _this2.sockets.getPosition({
            side: side,
            nodeId: nodeId,
            key: key
          });
          if (!position) return;
          var x = position.x,
            y = position.y;
          var nodeView = (_this2$area = _this2.area) === null || _this2$area === void 0 ? void 0 : _this2$area.nodeViews.get(nodeId);
          if (nodeView) change({
            x: x + nodeView.position.x,
            y: y + nodeView.position.y
          });
        }
      });
      this.sockets.snapshot().forEach(function (data) {
        if (data.nodeId === nodeId) _this2.emitter.emit(data);
      });
      return unlisten;
    }
  }]);
  return BaseSocketPosition;
}();

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf__default["default"](Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf__default["default"](this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn__default["default"](this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/**
 * Props for `DOMSocketPosition` class.
 */

/**
 * Class for socket position calculation based on DOM elements. It uses `getElementCenter` function to calculate the position.
 */
var DOMSocketPosition = /*#__PURE__*/function (_BaseSocketPosition) {
  _inherits__default["default"](DOMSocketPosition, _BaseSocketPosition);
  var _super = _createSuper(DOMSocketPosition);
  function DOMSocketPosition(props) {
    var _this;
    _classCallCheck__default["default"](this, DOMSocketPosition);
    _this = _super.call(this);
    _this.props = props;
    return _this;
  }
  _createClass__default["default"](DOMSocketPosition, [{
    key: "calculatePosition",
    value: function () {
      var _calculatePosition = _asyncToGenerator__default["default"]( /*#__PURE__*/_regeneratorRuntime__default["default"].mark(function _callee(nodeId, side, key, element) {
        var _this$area, _this$props, _this$props2;
        var view, position;
        return _regeneratorRuntime__default["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              view = (_this$area = this.area) === null || _this$area === void 0 ? void 0 : _this$area.nodeViews.get(nodeId);
              if (view !== null && view !== void 0 && view.element) {
                _context.next = 3;
                break;
              }
              return _context.abrupt("return", null);
            case 3:
              _context.next = 5;
              return getElementCenter(element, view.element);
            case 5:
              position = _context.sent;
              if (!((_this$props = this.props) !== null && _this$props !== void 0 && _this$props.offset)) {
                _context.next = 8;
                break;
              }
              return _context.abrupt("return", (_this$props2 = this.props) === null || _this$props2 === void 0 ? void 0 : _this$props2.offset(position, nodeId, side, key));
            case 8:
              return _context.abrupt("return", {
                x: position.x + 12 * (side === 'input' ? -1 : 1),
                y: position.y
              });
            case 9:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function calculatePosition(_x, _x2, _x3, _x4) {
        return _calculatePosition.apply(this, arguments);
      }
      return calculatePosition;
    }()
  }]);
  return DOMSocketPosition;
}(BaseSocketPosition);

/**
 * Wrapper function for `DOMSocketPosition` class.
 * @param props Props for `DOMSocketPosition` class
 */
function getDOMSocketPosition(props) {
  return new DOMSocketPosition(props);
}

exports.BaseSocketPosition = BaseSocketPosition;
exports.DOMSocketPosition = DOMSocketPosition;
exports.classicConnectionPath = classicConnectionPath;
exports.getDOMSocketPosition = getDOMSocketPosition;
exports.getElementCenter = getElementCenter;
exports.loopConnectionPath = loopConnectionPath;
//# sourceMappingURL=rete-render-utils.common.js.map