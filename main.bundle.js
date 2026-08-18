var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/graphology/dist/graphology.umd.min.js
var require_graphology_umd_min = __commonJS({
  "node_modules/graphology/dist/graphology.umd.min.js"(exports, module) {
    !(function(t, e) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).graphology = e();
    })(exports, (function() {
      "use strict";
      function t(e2) {
        return t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t2) {
          return typeof t2;
        } : function(t2) {
          return t2 && "function" == typeof Symbol && t2.constructor === Symbol && t2 !== Symbol.prototype ? "symbol" : typeof t2;
        }, t(e2);
      }
      function e(t2, e2) {
        t2.prototype = Object.create(e2.prototype), t2.prototype.constructor = t2, r(t2, e2);
      }
      function n(t2) {
        return n = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t3) {
          return t3.__proto__ || Object.getPrototypeOf(t3);
        }, n(t2);
      }
      function r(t2, e2) {
        return r = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t3, e3) {
          return t3.__proto__ = e3, t3;
        }, r(t2, e2);
      }
      function i() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if ("function" == typeof Proxy) return true;
        try {
          return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {
          }))), true;
        } catch (t2) {
          return false;
        }
      }
      function o(t2, e2, n2) {
        return o = i() ? Reflect.construct.bind() : function(t3, e3, n3) {
          var i2 = [null];
          i2.push.apply(i2, e3);
          var o2 = new (Function.bind.apply(t3, i2))();
          return n3 && r(o2, n3.prototype), o2;
        }, o.apply(null, arguments);
      }
      function a(t2) {
        var e2 = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
        return a = function(t3) {
          if (null === t3 || (i2 = t3, -1 === Function.toString.call(i2).indexOf("[native code]"))) return t3;
          var i2;
          if ("function" != typeof t3) throw new TypeError("Super expression must either be null or a function");
          if (void 0 !== e2) {
            if (e2.has(t3)) return e2.get(t3);
            e2.set(t3, a2);
          }
          function a2() {
            return o(t3, arguments, n(this).constructor);
          }
          return a2.prototype = Object.create(t3.prototype, { constructor: { value: a2, enumerable: false, writable: true, configurable: true } }), r(a2, t3);
        }, a(t2);
      }
      function c(t2) {
        if (void 0 === t2) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return t2;
      }
      var u = function() {
        for (var t2 = arguments[0], e2 = 1, n2 = arguments.length; e2 < n2; e2++) if (arguments[e2]) for (var r2 in arguments[e2]) t2[r2] = arguments[e2][r2];
        return t2;
      };
      function d(t2, e2, n2, r2) {
        var i2 = t2._nodes.get(e2), o2 = null;
        return i2 ? o2 = "mixed" === r2 ? i2.out && i2.out[n2] || i2.undirected && i2.undirected[n2] : "directed" === r2 ? i2.out && i2.out[n2] : i2.undirected && i2.undirected[n2] : o2;
      }
      function s(e2) {
        return "object" === t(e2) && null !== e2;
      }
      function h(t2) {
        var e2;
        for (e2 in t2) return false;
        return true;
      }
      function p(t2, e2, n2) {
        Object.defineProperty(t2, e2, { enumerable: false, configurable: false, writable: true, value: n2 });
      }
      function f(t2, e2, n2) {
        var r2 = { enumerable: true, configurable: true };
        "function" == typeof n2 ? r2.get = n2 : (r2.value = n2, r2.writable = false), Object.defineProperty(t2, e2, r2);
      }
      function l(t2) {
        return !!s(t2) && !(t2.attributes && !Array.isArray(t2.attributes));
      }
      "function" == typeof Object.assign && (u = Object.assign);
      var g, y = { exports: {} }, w = "object" == typeof Reflect ? Reflect : null, v = w && "function" == typeof w.apply ? w.apply : function(t2, e2, n2) {
        return Function.prototype.apply.call(t2, e2, n2);
      };
      g = w && "function" == typeof w.ownKeys ? w.ownKeys : Object.getOwnPropertySymbols ? function(t2) {
        return Object.getOwnPropertyNames(t2).concat(Object.getOwnPropertySymbols(t2));
      } : function(t2) {
        return Object.getOwnPropertyNames(t2);
      };
      var b = Number.isNaN || function(t2) {
        return t2 != t2;
      };
      function m() {
        m.init.call(this);
      }
      y.exports = m, y.exports.once = function(t2, e2) {
        return new Promise((function(n2, r2) {
          function i2(n3) {
            t2.removeListener(e2, o2), r2(n3);
          }
          function o2() {
            "function" == typeof t2.removeListener && t2.removeListener("error", i2), n2([].slice.call(arguments));
          }
          U(t2, e2, o2, { once: true }), "error" !== e2 && (function(t3, e3, n3) {
            "function" == typeof t3.on && U(t3, "error", e3, n3);
          })(t2, i2, { once: true });
        }));
      }, m.EventEmitter = m, m.prototype._events = void 0, m.prototype._eventsCount = 0, m.prototype._maxListeners = void 0;
      var k = 10;
      function _(t2) {
        if ("function" != typeof t2) throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof t2);
      }
      function G(t2) {
        return void 0 === t2._maxListeners ? m.defaultMaxListeners : t2._maxListeners;
      }
      function x(t2, e2, n2, r2) {
        var i2, o2, a2, c2;
        if (_(n2), void 0 === (o2 = t2._events) ? (o2 = t2._events = /* @__PURE__ */ Object.create(null), t2._eventsCount = 0) : (void 0 !== o2.newListener && (t2.emit("newListener", e2, n2.listener ? n2.listener : n2), o2 = t2._events), a2 = o2[e2]), void 0 === a2) a2 = o2[e2] = n2, ++t2._eventsCount;
        else if ("function" == typeof a2 ? a2 = o2[e2] = r2 ? [n2, a2] : [a2, n2] : r2 ? a2.unshift(n2) : a2.push(n2), (i2 = G(t2)) > 0 && a2.length > i2 && !a2.warned) {
          a2.warned = true;
          var u2 = new Error("Possible EventEmitter memory leak detected. " + a2.length + " " + String(e2) + " listeners added. Use emitter.setMaxListeners() to increase limit");
          u2.name = "MaxListenersExceededWarning", u2.emitter = t2, u2.type = e2, u2.count = a2.length, c2 = u2, console && console.warn && console.warn(c2);
        }
        return t2;
      }
      function E() {
        if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = true, 0 === arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
      }
      function A(t2, e2, n2) {
        var r2 = { fired: false, wrapFn: void 0, target: t2, type: e2, listener: n2 }, i2 = E.bind(r2);
        return i2.listener = n2, r2.wrapFn = i2, i2;
      }
      function L(t2, e2, n2) {
        var r2 = t2._events;
        if (void 0 === r2) return [];
        var i2 = r2[e2];
        return void 0 === i2 ? [] : "function" == typeof i2 ? n2 ? [i2.listener || i2] : [i2] : n2 ? (function(t3) {
          for (var e3 = new Array(t3.length), n3 = 0; n3 < e3.length; ++n3) e3[n3] = t3[n3].listener || t3[n3];
          return e3;
        })(i2) : D(i2, i2.length);
      }
      function S(t2) {
        var e2 = this._events;
        if (void 0 !== e2) {
          var n2 = e2[t2];
          if ("function" == typeof n2) return 1;
          if (void 0 !== n2) return n2.length;
        }
        return 0;
      }
      function D(t2, e2) {
        for (var n2 = new Array(e2), r2 = 0; r2 < e2; ++r2) n2[r2] = t2[r2];
        return n2;
      }
      function U(t2, e2, n2, r2) {
        if ("function" == typeof t2.on) r2.once ? t2.once(e2, n2) : t2.on(e2, n2);
        else {
          if ("function" != typeof t2.addEventListener) throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof t2);
          t2.addEventListener(e2, (function i2(o2) {
            r2.once && t2.removeEventListener(e2, i2), n2(o2);
          }));
        }
      }
      function N(t2) {
        if ("function" != typeof t2) throw new Error("obliterator/iterator: expecting a function!");
        this.next = t2;
      }
      Object.defineProperty(m, "defaultMaxListeners", { enumerable: true, get: function() {
        return k;
      }, set: function(t2) {
        if ("number" != typeof t2 || t2 < 0 || b(t2)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + t2 + ".");
        k = t2;
      } }), m.init = function() {
        void 0 !== this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
      }, m.prototype.setMaxListeners = function(t2) {
        if ("number" != typeof t2 || t2 < 0 || b(t2)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + t2 + ".");
        return this._maxListeners = t2, this;
      }, m.prototype.getMaxListeners = function() {
        return G(this);
      }, m.prototype.emit = function(t2) {
        for (var e2 = [], n2 = 1; n2 < arguments.length; n2++) e2.push(arguments[n2]);
        var r2 = "error" === t2, i2 = this._events;
        if (void 0 !== i2) r2 = r2 && void 0 === i2.error;
        else if (!r2) return false;
        if (r2) {
          var o2;
          if (e2.length > 0 && (o2 = e2[0]), o2 instanceof Error) throw o2;
          var a2 = new Error("Unhandled error." + (o2 ? " (" + o2.message + ")" : ""));
          throw a2.context = o2, a2;
        }
        var c2 = i2[t2];
        if (void 0 === c2) return false;
        if ("function" == typeof c2) v(c2, this, e2);
        else {
          var u2 = c2.length, d2 = D(c2, u2);
          for (n2 = 0; n2 < u2; ++n2) v(d2[n2], this, e2);
        }
        return true;
      }, m.prototype.addListener = function(t2, e2) {
        return x(this, t2, e2, false);
      }, m.prototype.on = m.prototype.addListener, m.prototype.prependListener = function(t2, e2) {
        return x(this, t2, e2, true);
      }, m.prototype.once = function(t2, e2) {
        return _(e2), this.on(t2, A(this, t2, e2)), this;
      }, m.prototype.prependOnceListener = function(t2, e2) {
        return _(e2), this.prependListener(t2, A(this, t2, e2)), this;
      }, m.prototype.removeListener = function(t2, e2) {
        var n2, r2, i2, o2, a2;
        if (_(e2), void 0 === (r2 = this._events)) return this;
        if (void 0 === (n2 = r2[t2])) return this;
        if (n2 === e2 || n2.listener === e2) 0 == --this._eventsCount ? this._events = /* @__PURE__ */ Object.create(null) : (delete r2[t2], r2.removeListener && this.emit("removeListener", t2, n2.listener || e2));
        else if ("function" != typeof n2) {
          for (i2 = -1, o2 = n2.length - 1; o2 >= 0; o2--) if (n2[o2] === e2 || n2[o2].listener === e2) {
            a2 = n2[o2].listener, i2 = o2;
            break;
          }
          if (i2 < 0) return this;
          0 === i2 ? n2.shift() : (function(t3, e3) {
            for (; e3 + 1 < t3.length; e3++) t3[e3] = t3[e3 + 1];
            t3.pop();
          })(n2, i2), 1 === n2.length && (r2[t2] = n2[0]), void 0 !== r2.removeListener && this.emit("removeListener", t2, a2 || e2);
        }
        return this;
      }, m.prototype.off = m.prototype.removeListener, m.prototype.removeAllListeners = function(t2) {
        var e2, n2, r2;
        if (void 0 === (n2 = this._events)) return this;
        if (void 0 === n2.removeListener) return 0 === arguments.length ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : void 0 !== n2[t2] && (0 == --this._eventsCount ? this._events = /* @__PURE__ */ Object.create(null) : delete n2[t2]), this;
        if (0 === arguments.length) {
          var i2, o2 = Object.keys(n2);
          for (r2 = 0; r2 < o2.length; ++r2) "removeListener" !== (i2 = o2[r2]) && this.removeAllListeners(i2);
          return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
        }
        if ("function" == typeof (e2 = n2[t2])) this.removeListener(t2, e2);
        else if (void 0 !== e2) for (r2 = e2.length - 1; r2 >= 0; r2--) this.removeListener(t2, e2[r2]);
        return this;
      }, m.prototype.listeners = function(t2) {
        return L(this, t2, true);
      }, m.prototype.rawListeners = function(t2) {
        return L(this, t2, false);
      }, m.listenerCount = function(t2, e2) {
        return "function" == typeof t2.listenerCount ? t2.listenerCount(e2) : S.call(t2, e2);
      }, m.prototype.listenerCount = S, m.prototype.eventNames = function() {
        return this._eventsCount > 0 ? g(this._events) : [];
      }, "undefined" != typeof Symbol && (N.prototype[Symbol.iterator] = function() {
        return this;
      }), N.of = function() {
        var t2 = arguments, e2 = t2.length, n2 = 0;
        return new N((function() {
          return n2 >= e2 ? { done: true } : { done: false, value: t2[n2++] };
        }));
      }, N.empty = function() {
        return new N((function() {
          return { done: true };
        }));
      }, N.fromSequence = function(t2) {
        var e2 = 0, n2 = t2.length;
        return new N((function() {
          return e2 >= n2 ? { done: true } : { done: false, value: t2[e2++] };
        }));
      }, N.is = function(t2) {
        return t2 instanceof N || "object" == typeof t2 && null !== t2 && "function" == typeof t2.next;
      };
      var O = N, j = {};
      j.ARRAY_BUFFER_SUPPORT = "undefined" != typeof ArrayBuffer, j.SYMBOL_SUPPORT = "undefined" != typeof Symbol;
      var C = O, M = j, z = M.ARRAY_BUFFER_SUPPORT, W = M.SYMBOL_SUPPORT;
      var P = function(t2) {
        var e2 = (function(t3) {
          return "string" == typeof t3 || Array.isArray(t3) || z && ArrayBuffer.isView(t3) ? C.fromSequence(t3) : "object" != typeof t3 || null === t3 ? null : W && "function" == typeof t3[Symbol.iterator] ? t3[Symbol.iterator]() : "function" == typeof t3.next ? t3 : null;
        })(t2);
        if (!e2) throw new Error("obliterator: target is not iterable nor a valid iterator.");
        return e2;
      }, R = P, K = function(t2, e2) {
        for (var n2, r2 = arguments.length > 1 ? e2 : 1 / 0, i2 = r2 !== 1 / 0 ? new Array(r2) : [], o2 = 0, a2 = R(t2); ; ) {
          if (o2 === r2) return i2;
          if ((n2 = a2.next()).done) return o2 !== e2 && (i2.length = o2), i2;
          i2[o2++] = n2.value;
        }
      }, T = (function(t2) {
        function n2(e2) {
          var n3;
          return (n3 = t2.call(this) || this).name = "GraphError", n3.message = e2, n3;
        }
        return e(n2, t2), n2;
      })(a(Error)), B = (function(t2) {
        function n2(e2) {
          var r2;
          return (r2 = t2.call(this, e2) || this).name = "InvalidArgumentsGraphError", "function" == typeof Error.captureStackTrace && Error.captureStackTrace(c(r2), n2.prototype.constructor), r2;
        }
        return e(n2, t2), n2;
      })(T), F = (function(t2) {
        function n2(e2) {
          var r2;
          return (r2 = t2.call(this, e2) || this).name = "NotFoundGraphError", "function" == typeof Error.captureStackTrace && Error.captureStackTrace(c(r2), n2.prototype.constructor), r2;
        }
        return e(n2, t2), n2;
      })(T), I = (function(t2) {
        function n2(e2) {
          var r2;
          return (r2 = t2.call(this, e2) || this).name = "UsageGraphError", "function" == typeof Error.captureStackTrace && Error.captureStackTrace(c(r2), n2.prototype.constructor), r2;
        }
        return e(n2, t2), n2;
      })(T);
      function Y(t2, e2) {
        this.key = t2, this.attributes = e2, this.clear();
      }
      function q(t2, e2) {
        this.key = t2, this.attributes = e2, this.clear();
      }
      function J(t2, e2) {
        this.key = t2, this.attributes = e2, this.clear();
      }
      function V(t2, e2, n2, r2, i2) {
        this.key = e2, this.attributes = i2, this.undirected = t2, this.source = n2, this.target = r2;
      }
      Y.prototype.clear = function() {
        this.inDegree = 0, this.outDegree = 0, this.undirectedDegree = 0, this.undirectedLoops = 0, this.directedLoops = 0, this.in = {}, this.out = {}, this.undirected = {};
      }, q.prototype.clear = function() {
        this.inDegree = 0, this.outDegree = 0, this.directedLoops = 0, this.in = {}, this.out = {};
      }, J.prototype.clear = function() {
        this.undirectedDegree = 0, this.undirectedLoops = 0, this.undirected = {};
      }, V.prototype.attach = function() {
        var t2 = "out", e2 = "in";
        this.undirected && (t2 = e2 = "undirected");
        var n2 = this.source.key, r2 = this.target.key;
        this.source[t2][r2] = this, this.undirected && n2 === r2 || (this.target[e2][n2] = this);
      }, V.prototype.attachMulti = function() {
        var t2 = "out", e2 = "in", n2 = this.source.key, r2 = this.target.key;
        this.undirected && (t2 = e2 = "undirected");
        var i2 = this.source[t2], o2 = i2[r2];
        if (void 0 === o2) return i2[r2] = this, void (this.undirected && n2 === r2 || (this.target[e2][n2] = this));
        o2.previous = this, this.next = o2, i2[r2] = this, this.target[e2][n2] = this;
      }, V.prototype.detach = function() {
        var t2 = this.source.key, e2 = this.target.key, n2 = "out", r2 = "in";
        this.undirected && (n2 = r2 = "undirected"), delete this.source[n2][e2], delete this.target[r2][t2];
      }, V.prototype.detachMulti = function() {
        var t2 = this.source.key, e2 = this.target.key, n2 = "out", r2 = "in";
        this.undirected && (n2 = r2 = "undirected"), void 0 === this.previous ? void 0 === this.next ? (delete this.source[n2][e2], delete this.target[r2][t2]) : (this.next.previous = void 0, this.source[n2][e2] = this.next, this.target[r2][t2] = this.next) : (this.previous.next = this.next, void 0 !== this.next && (this.next.previous = this.previous));
      };
      function H(t2, e2, n2, r2, i2, o2, a2) {
        var c2, u2, d2, s2;
        if (r2 = "" + r2, 0 === n2) {
          if (!(c2 = t2._nodes.get(r2))) throw new F("Graph.".concat(e2, ': could not find the "').concat(r2, '" node in the graph.'));
          d2 = i2, s2 = o2;
        } else if (3 === n2) {
          if (i2 = "" + i2, !(u2 = t2._edges.get(i2))) throw new F("Graph.".concat(e2, ': could not find the "').concat(i2, '" edge in the graph.'));
          var h2 = u2.source.key, p2 = u2.target.key;
          if (r2 === h2) c2 = u2.target;
          else {
            if (r2 !== p2) throw new F("Graph.".concat(e2, ': the "').concat(r2, '" node is not attached to the "').concat(i2, '" edge (').concat(h2, ", ").concat(p2, ")."));
            c2 = u2.source;
          }
          d2 = o2, s2 = a2;
        } else {
          if (!(u2 = t2._edges.get(r2))) throw new F("Graph.".concat(e2, ': could not find the "').concat(r2, '" edge in the graph.'));
          c2 = 1 === n2 ? u2.source : u2.target, d2 = i2, s2 = o2;
        }
        return [c2, d2, s2];
      }
      var Q = [{ name: function(t2) {
        return "get".concat(t2, "Attribute");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2, i2) {
          var o2 = H(this, e2, n2, t3, r2, i2), a2 = o2[0], c2 = o2[1];
          return a2.attributes[c2];
        };
      } }, { name: function(t2) {
        return "get".concat(t2, "Attributes");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2) {
          return H(this, e2, n2, t3, r2)[0].attributes;
        };
      } }, { name: function(t2) {
        return "has".concat(t2, "Attribute");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2, i2) {
          var o2 = H(this, e2, n2, t3, r2, i2), a2 = o2[0], c2 = o2[1];
          return a2.attributes.hasOwnProperty(c2);
        };
      } }, { name: function(t2) {
        return "set".concat(t2, "Attribute");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2, i2, o2) {
          var a2 = H(this, e2, n2, t3, r2, i2, o2), c2 = a2[0], u2 = a2[1], d2 = a2[2];
          return c2.attributes[u2] = d2, this.emit("nodeAttributesUpdated", { key: c2.key, type: "set", attributes: c2.attributes, name: u2 }), this;
        };
      } }, { name: function(t2) {
        return "update".concat(t2, "Attribute");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2, i2, o2) {
          var a2 = H(this, e2, n2, t3, r2, i2, o2), c2 = a2[0], u2 = a2[1], d2 = a2[2];
          if ("function" != typeof d2) throw new B("Graph.".concat(e2, ": updater should be a function."));
          var s2 = c2.attributes, h2 = d2(s2[u2]);
          return s2[u2] = h2, this.emit("nodeAttributesUpdated", { key: c2.key, type: "set", attributes: c2.attributes, name: u2 }), this;
        };
      } }, { name: function(t2) {
        return "remove".concat(t2, "Attribute");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2, i2) {
          var o2 = H(this, e2, n2, t3, r2, i2), a2 = o2[0], c2 = o2[1];
          return delete a2.attributes[c2], this.emit("nodeAttributesUpdated", { key: a2.key, type: "remove", attributes: a2.attributes, name: c2 }), this;
        };
      } }, { name: function(t2) {
        return "replace".concat(t2, "Attributes");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2, i2) {
          var o2 = H(this, e2, n2, t3, r2, i2), a2 = o2[0], c2 = o2[1];
          if (!s(c2)) throw new B("Graph.".concat(e2, ": provided attributes are not a plain object."));
          return a2.attributes = c2, this.emit("nodeAttributesUpdated", { key: a2.key, type: "replace", attributes: a2.attributes }), this;
        };
      } }, { name: function(t2) {
        return "merge".concat(t2, "Attributes");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2, i2) {
          var o2 = H(this, e2, n2, t3, r2, i2), a2 = o2[0], c2 = o2[1];
          if (!s(c2)) throw new B("Graph.".concat(e2, ": provided attributes are not a plain object."));
          return u(a2.attributes, c2), this.emit("nodeAttributesUpdated", { key: a2.key, type: "merge", attributes: a2.attributes, data: c2 }), this;
        };
      } }, { name: function(t2) {
        return "update".concat(t2, "Attributes");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2, i2) {
          var o2 = H(this, e2, n2, t3, r2, i2), a2 = o2[0], c2 = o2[1];
          if ("function" != typeof c2) throw new B("Graph.".concat(e2, ": provided updater is not a function."));
          return a2.attributes = c2(a2.attributes), this.emit("nodeAttributesUpdated", { key: a2.key, type: "update", attributes: a2.attributes }), this;
        };
      } }];
      var X = [{ name: function(t2) {
        return "get".concat(t2, "Attribute");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2) {
          var i2;
          if ("mixed" !== this.type && "mixed" !== n2 && n2 !== this.type) throw new I("Graph.".concat(e2, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 2) {
            if (this.multi) throw new I("Graph.".concat(e2, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var o2 = "" + t3, a2 = "" + r2;
            if (r2 = arguments[2], !(i2 = d(this, o2, a2, n2))) throw new F("Graph.".concat(e2, ': could not find an edge for the given path ("').concat(o2, '" - "').concat(a2, '").'));
          } else {
            if ("mixed" !== n2) throw new I("Graph.".concat(e2, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            if (t3 = "" + t3, !(i2 = this._edges.get(t3))) throw new F("Graph.".concat(e2, ': could not find the "').concat(t3, '" edge in the graph.'));
          }
          return i2.attributes[r2];
        };
      } }, { name: function(t2) {
        return "get".concat(t2, "Attributes");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3) {
          var r2;
          if ("mixed" !== this.type && "mixed" !== n2 && n2 !== this.type) throw new I("Graph.".concat(e2, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 1) {
            if (this.multi) throw new I("Graph.".concat(e2, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var i2 = "" + t3, o2 = "" + arguments[1];
            if (!(r2 = d(this, i2, o2, n2))) throw new F("Graph.".concat(e2, ': could not find an edge for the given path ("').concat(i2, '" - "').concat(o2, '").'));
          } else {
            if ("mixed" !== n2) throw new I("Graph.".concat(e2, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            if (t3 = "" + t3, !(r2 = this._edges.get(t3))) throw new F("Graph.".concat(e2, ': could not find the "').concat(t3, '" edge in the graph.'));
          }
          return r2.attributes;
        };
      } }, { name: function(t2) {
        return "has".concat(t2, "Attribute");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2) {
          var i2;
          if ("mixed" !== this.type && "mixed" !== n2 && n2 !== this.type) throw new I("Graph.".concat(e2, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 2) {
            if (this.multi) throw new I("Graph.".concat(e2, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var o2 = "" + t3, a2 = "" + r2;
            if (r2 = arguments[2], !(i2 = d(this, o2, a2, n2))) throw new F("Graph.".concat(e2, ': could not find an edge for the given path ("').concat(o2, '" - "').concat(a2, '").'));
          } else {
            if ("mixed" !== n2) throw new I("Graph.".concat(e2, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            if (t3 = "" + t3, !(i2 = this._edges.get(t3))) throw new F("Graph.".concat(e2, ': could not find the "').concat(t3, '" edge in the graph.'));
          }
          return i2.attributes.hasOwnProperty(r2);
        };
      } }, { name: function(t2) {
        return "set".concat(t2, "Attribute");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2, i2) {
          var o2;
          if ("mixed" !== this.type && "mixed" !== n2 && n2 !== this.type) throw new I("Graph.".concat(e2, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 3) {
            if (this.multi) throw new I("Graph.".concat(e2, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var a2 = "" + t3, c2 = "" + r2;
            if (r2 = arguments[2], i2 = arguments[3], !(o2 = d(this, a2, c2, n2))) throw new F("Graph.".concat(e2, ': could not find an edge for the given path ("').concat(a2, '" - "').concat(c2, '").'));
          } else {
            if ("mixed" !== n2) throw new I("Graph.".concat(e2, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            if (t3 = "" + t3, !(o2 = this._edges.get(t3))) throw new F("Graph.".concat(e2, ': could not find the "').concat(t3, '" edge in the graph.'));
          }
          return o2.attributes[r2] = i2, this.emit("edgeAttributesUpdated", { key: o2.key, type: "set", attributes: o2.attributes, name: r2 }), this;
        };
      } }, { name: function(t2) {
        return "update".concat(t2, "Attribute");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2, i2) {
          var o2;
          if ("mixed" !== this.type && "mixed" !== n2 && n2 !== this.type) throw new I("Graph.".concat(e2, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 3) {
            if (this.multi) throw new I("Graph.".concat(e2, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var a2 = "" + t3, c2 = "" + r2;
            if (r2 = arguments[2], i2 = arguments[3], !(o2 = d(this, a2, c2, n2))) throw new F("Graph.".concat(e2, ': could not find an edge for the given path ("').concat(a2, '" - "').concat(c2, '").'));
          } else {
            if ("mixed" !== n2) throw new I("Graph.".concat(e2, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            if (t3 = "" + t3, !(o2 = this._edges.get(t3))) throw new F("Graph.".concat(e2, ': could not find the "').concat(t3, '" edge in the graph.'));
          }
          if ("function" != typeof i2) throw new B("Graph.".concat(e2, ": updater should be a function."));
          return o2.attributes[r2] = i2(o2.attributes[r2]), this.emit("edgeAttributesUpdated", { key: o2.key, type: "set", attributes: o2.attributes, name: r2 }), this;
        };
      } }, { name: function(t2) {
        return "remove".concat(t2, "Attribute");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2) {
          var i2;
          if ("mixed" !== this.type && "mixed" !== n2 && n2 !== this.type) throw new I("Graph.".concat(e2, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 2) {
            if (this.multi) throw new I("Graph.".concat(e2, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var o2 = "" + t3, a2 = "" + r2;
            if (r2 = arguments[2], !(i2 = d(this, o2, a2, n2))) throw new F("Graph.".concat(e2, ': could not find an edge for the given path ("').concat(o2, '" - "').concat(a2, '").'));
          } else {
            if ("mixed" !== n2) throw new I("Graph.".concat(e2, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            if (t3 = "" + t3, !(i2 = this._edges.get(t3))) throw new F("Graph.".concat(e2, ': could not find the "').concat(t3, '" edge in the graph.'));
          }
          return delete i2.attributes[r2], this.emit("edgeAttributesUpdated", { key: i2.key, type: "remove", attributes: i2.attributes, name: r2 }), this;
        };
      } }, { name: function(t2) {
        return "replace".concat(t2, "Attributes");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2) {
          var i2;
          if ("mixed" !== this.type && "mixed" !== n2 && n2 !== this.type) throw new I("Graph.".concat(e2, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 2) {
            if (this.multi) throw new I("Graph.".concat(e2, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var o2 = "" + t3, a2 = "" + r2;
            if (r2 = arguments[2], !(i2 = d(this, o2, a2, n2))) throw new F("Graph.".concat(e2, ': could not find an edge for the given path ("').concat(o2, '" - "').concat(a2, '").'));
          } else {
            if ("mixed" !== n2) throw new I("Graph.".concat(e2, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            if (t3 = "" + t3, !(i2 = this._edges.get(t3))) throw new F("Graph.".concat(e2, ': could not find the "').concat(t3, '" edge in the graph.'));
          }
          if (!s(r2)) throw new B("Graph.".concat(e2, ": provided attributes are not a plain object."));
          return i2.attributes = r2, this.emit("edgeAttributesUpdated", { key: i2.key, type: "replace", attributes: i2.attributes }), this;
        };
      } }, { name: function(t2) {
        return "merge".concat(t2, "Attributes");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2) {
          var i2;
          if ("mixed" !== this.type && "mixed" !== n2 && n2 !== this.type) throw new I("Graph.".concat(e2, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 2) {
            if (this.multi) throw new I("Graph.".concat(e2, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var o2 = "" + t3, a2 = "" + r2;
            if (r2 = arguments[2], !(i2 = d(this, o2, a2, n2))) throw new F("Graph.".concat(e2, ': could not find an edge for the given path ("').concat(o2, '" - "').concat(a2, '").'));
          } else {
            if ("mixed" !== n2) throw new I("Graph.".concat(e2, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            if (t3 = "" + t3, !(i2 = this._edges.get(t3))) throw new F("Graph.".concat(e2, ': could not find the "').concat(t3, '" edge in the graph.'));
          }
          if (!s(r2)) throw new B("Graph.".concat(e2, ": provided attributes are not a plain object."));
          return u(i2.attributes, r2), this.emit("edgeAttributesUpdated", { key: i2.key, type: "merge", attributes: i2.attributes, data: r2 }), this;
        };
      } }, { name: function(t2) {
        return "update".concat(t2, "Attributes");
      }, attacher: function(t2, e2, n2) {
        t2.prototype[e2] = function(t3, r2) {
          var i2;
          if ("mixed" !== this.type && "mixed" !== n2 && n2 !== this.type) throw new I("Graph.".concat(e2, ": cannot find this type of edges in your ").concat(this.type, " graph."));
          if (arguments.length > 2) {
            if (this.multi) throw new I("Graph.".concat(e2, ": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));
            var o2 = "" + t3, a2 = "" + r2;
            if (r2 = arguments[2], !(i2 = d(this, o2, a2, n2))) throw new F("Graph.".concat(e2, ': could not find an edge for the given path ("').concat(o2, '" - "').concat(a2, '").'));
          } else {
            if ("mixed" !== n2) throw new I("Graph.".concat(e2, ": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));
            if (t3 = "" + t3, !(i2 = this._edges.get(t3))) throw new F("Graph.".concat(e2, ': could not find the "').concat(t3, '" edge in the graph.'));
          }
          if ("function" != typeof r2) throw new B("Graph.".concat(e2, ": provided updater is not a function."));
          return i2.attributes = r2(i2.attributes), this.emit("edgeAttributesUpdated", { key: i2.key, type: "update", attributes: i2.attributes }), this;
        };
      } }];
      var Z = O, $ = P, tt = function() {
        var t2 = arguments, e2 = null, n2 = -1;
        return new Z((function() {
          for (var r2 = null; ; ) {
            if (null === e2) {
              if (++n2 >= t2.length) return { done: true };
              e2 = $(t2[n2]);
            }
            if (true !== (r2 = e2.next()).done) break;
            e2 = null;
          }
          return r2;
        }));
      }, et = [{ name: "edges", type: "mixed" }, { name: "inEdges", type: "directed", direction: "in" }, { name: "outEdges", type: "directed", direction: "out" }, { name: "inboundEdges", type: "mixed", direction: "in" }, { name: "outboundEdges", type: "mixed", direction: "out" }, { name: "directedEdges", type: "directed" }, { name: "undirectedEdges", type: "undirected" }];
      function nt(t2, e2, n2, r2) {
        var i2 = false;
        for (var o2 in e2) if (o2 !== r2) {
          var a2 = e2[o2];
          if (i2 = n2(a2.key, a2.attributes, a2.source.key, a2.target.key, a2.source.attributes, a2.target.attributes, a2.undirected), t2 && i2) return a2.key;
        }
      }
      function rt(t2, e2, n2, r2) {
        var i2, o2, a2, c2 = false;
        for (var u2 in e2) if (u2 !== r2) {
          i2 = e2[u2];
          do {
            if (o2 = i2.source, a2 = i2.target, c2 = n2(i2.key, i2.attributes, o2.key, a2.key, o2.attributes, a2.attributes, i2.undirected), t2 && c2) return i2.key;
            i2 = i2.next;
          } while (void 0 !== i2);
        }
      }
      function it(t2, e2) {
        var n2, r2 = Object.keys(t2), i2 = r2.length, o2 = 0;
        return new O((function() {
          do {
            if (n2) n2 = n2.next;
            else {
              if (o2 >= i2) return { done: true };
              var a2 = r2[o2++];
              if (a2 === e2) {
                n2 = void 0;
                continue;
              }
              n2 = t2[a2];
            }
          } while (!n2);
          return { done: false, value: { edge: n2.key, attributes: n2.attributes, source: n2.source.key, target: n2.target.key, sourceAttributes: n2.source.attributes, targetAttributes: n2.target.attributes, undirected: n2.undirected } };
        }));
      }
      function ot(t2, e2, n2, r2) {
        var i2 = e2[n2];
        if (i2) {
          var o2 = i2.source, a2 = i2.target;
          return r2(i2.key, i2.attributes, o2.key, a2.key, o2.attributes, a2.attributes, i2.undirected) && t2 ? i2.key : void 0;
        }
      }
      function at(t2, e2, n2, r2) {
        var i2 = e2[n2];
        if (i2) {
          var o2 = false;
          do {
            if (o2 = r2(i2.key, i2.attributes, i2.source.key, i2.target.key, i2.source.attributes, i2.target.attributes, i2.undirected), t2 && o2) return i2.key;
            i2 = i2.next;
          } while (void 0 !== i2);
        }
      }
      function ct(t2, e2) {
        var n2 = t2[e2];
        return void 0 !== n2.next ? new O((function() {
          if (!n2) return { done: true };
          var t3 = { edge: n2.key, attributes: n2.attributes, source: n2.source.key, target: n2.target.key, sourceAttributes: n2.source.attributes, targetAttributes: n2.target.attributes, undirected: n2.undirected };
          return n2 = n2.next, { done: false, value: t3 };
        })) : O.of({ edge: n2.key, attributes: n2.attributes, source: n2.source.key, target: n2.target.key, sourceAttributes: n2.source.attributes, targetAttributes: n2.target.attributes, undirected: n2.undirected });
      }
      function ut(t2, e2) {
        if (0 === t2.size) return [];
        if ("mixed" === e2 || e2 === t2.type) return "function" == typeof Array.from ? Array.from(t2._edges.keys()) : K(t2._edges.keys(), t2._edges.size);
        for (var n2, r2, i2 = "undirected" === e2 ? t2.undirectedSize : t2.directedSize, o2 = new Array(i2), a2 = "undirected" === e2, c2 = t2._edges.values(), u2 = 0; true !== (n2 = c2.next()).done; ) (r2 = n2.value).undirected === a2 && (o2[u2++] = r2.key);
        return o2;
      }
      function dt(t2, e2, n2, r2) {
        if (0 !== e2.size) {
          for (var i2, o2, a2 = "mixed" !== n2 && n2 !== e2.type, c2 = "undirected" === n2, u2 = false, d2 = e2._edges.values(); true !== (i2 = d2.next()).done; ) if (o2 = i2.value, !a2 || o2.undirected === c2) {
            var s2 = o2, h2 = s2.key, p2 = s2.attributes, f2 = s2.source, l2 = s2.target;
            if (u2 = r2(h2, p2, f2.key, l2.key, f2.attributes, l2.attributes, o2.undirected), t2 && u2) return h2;
          }
        }
      }
      function st(t2, e2) {
        if (0 === t2.size) return O.empty();
        var n2 = "mixed" !== e2 && e2 !== t2.type, r2 = "undirected" === e2, i2 = t2._edges.values();
        return new O((function() {
          for (var t3, e3; ; ) {
            if ((t3 = i2.next()).done) return t3;
            if (e3 = t3.value, !n2 || e3.undirected === r2) break;
          }
          return { value: { edge: e3.key, attributes: e3.attributes, source: e3.source.key, target: e3.target.key, sourceAttributes: e3.source.attributes, targetAttributes: e3.target.attributes, undirected: e3.undirected }, done: false };
        }));
      }
      function ht(t2, e2, n2, r2, i2, o2) {
        var a2, c2 = e2 ? rt : nt;
        if ("undirected" !== n2) {
          if ("out" !== r2 && (a2 = c2(t2, i2.in, o2), t2 && a2)) return a2;
          if ("in" !== r2 && (a2 = c2(t2, i2.out, o2, r2 ? void 0 : i2.key), t2 && a2)) return a2;
        }
        if ("directed" !== n2 && (a2 = c2(t2, i2.undirected, o2), t2 && a2)) return a2;
      }
      function pt(t2, e2, n2, r2) {
        var i2 = [];
        return ht(false, t2, e2, n2, r2, (function(t3) {
          i2.push(t3);
        })), i2;
      }
      function ft(t2, e2, n2) {
        var r2 = O.empty();
        return "undirected" !== t2 && ("out" !== e2 && void 0 !== n2.in && (r2 = tt(r2, it(n2.in))), "in" !== e2 && void 0 !== n2.out && (r2 = tt(r2, it(n2.out, e2 ? void 0 : n2.key)))), "directed" !== t2 && void 0 !== n2.undirected && (r2 = tt(r2, it(n2.undirected))), r2;
      }
      function lt(t2, e2, n2, r2, i2, o2, a2) {
        var c2, u2 = n2 ? at : ot;
        if ("undirected" !== e2) {
          if (void 0 !== i2.in && "out" !== r2 && (c2 = u2(t2, i2.in, o2, a2), t2 && c2)) return c2;
          if (void 0 !== i2.out && "in" !== r2 && (r2 || i2.key !== o2) && (c2 = u2(t2, i2.out, o2, a2), t2 && c2)) return c2;
        }
        if ("directed" !== e2 && void 0 !== i2.undirected && (c2 = u2(t2, i2.undirected, o2, a2), t2 && c2)) return c2;
      }
      function gt(t2, e2, n2, r2, i2) {
        var o2 = [];
        return lt(false, t2, e2, n2, r2, i2, (function(t3) {
          o2.push(t3);
        })), o2;
      }
      function yt(t2, e2, n2, r2) {
        var i2 = O.empty();
        return "undirected" !== t2 && (void 0 !== n2.in && "out" !== e2 && r2 in n2.in && (i2 = tt(i2, ct(n2.in, r2))), void 0 !== n2.out && "in" !== e2 && r2 in n2.out && (e2 || n2.key !== r2) && (i2 = tt(i2, ct(n2.out, r2)))), "directed" !== t2 && void 0 !== n2.undirected && r2 in n2.undirected && (i2 = tt(i2, ct(n2.undirected, r2))), i2;
      }
      var wt = [{ name: "neighbors", type: "mixed" }, { name: "inNeighbors", type: "directed", direction: "in" }, { name: "outNeighbors", type: "directed", direction: "out" }, { name: "inboundNeighbors", type: "mixed", direction: "in" }, { name: "outboundNeighbors", type: "mixed", direction: "out" }, { name: "directedNeighbors", type: "directed" }, { name: "undirectedNeighbors", type: "undirected" }];
      function vt() {
        this.A = null, this.B = null;
      }
      function bt(t2, e2, n2, r2, i2) {
        for (var o2 in r2) {
          var a2 = r2[o2], c2 = a2.source, u2 = a2.target, d2 = c2 === n2 ? u2 : c2;
          if (!e2 || !e2.has(d2.key)) {
            var s2 = i2(d2.key, d2.attributes);
            if (t2 && s2) return d2.key;
          }
        }
      }
      function mt(t2, e2, n2, r2, i2) {
        if ("mixed" !== e2) {
          if ("undirected" === e2) return bt(t2, null, r2, r2.undirected, i2);
          if ("string" == typeof n2) return bt(t2, null, r2, r2[n2], i2);
        }
        var o2, a2 = new vt();
        if ("undirected" !== e2) {
          if ("out" !== n2) {
            if (o2 = bt(t2, null, r2, r2.in, i2), t2 && o2) return o2;
            a2.wrap(r2.in);
          }
          if ("in" !== n2) {
            if (o2 = bt(t2, a2, r2, r2.out, i2), t2 && o2) return o2;
            a2.wrap(r2.out);
          }
        }
        if ("directed" !== e2 && (o2 = bt(t2, a2, r2, r2.undirected, i2), t2 && o2)) return o2;
      }
      function kt(t2, e2, n2) {
        var r2 = Object.keys(n2), i2 = r2.length, o2 = 0;
        return new O((function() {
          var a2 = null;
          do {
            if (o2 >= i2) return t2 && t2.wrap(n2), { done: true };
            var c2 = n2[r2[o2++]], u2 = c2.source, d2 = c2.target;
            a2 = u2 === e2 ? d2 : u2, t2 && t2.has(a2.key) && (a2 = null);
          } while (null === a2);
          return { done: false, value: { neighbor: a2.key, attributes: a2.attributes } };
        }));
      }
      function _t(t2, e2) {
        var n2 = e2.name, r2 = e2.type, i2 = e2.direction;
        t2.prototype[n2] = function(t3) {
          if ("mixed" !== r2 && "mixed" !== this.type && r2 !== this.type) return [];
          t3 = "" + t3;
          var e3 = this._nodes.get(t3);
          if (void 0 === e3) throw new F("Graph.".concat(n2, ': could not find the "').concat(t3, '" node in the graph.'));
          return (function(t4, e4, n3) {
            if ("mixed" !== t4) {
              if ("undirected" === t4) return Object.keys(n3.undirected);
              if ("string" == typeof e4) return Object.keys(n3[e4]);
            }
            var r3 = [];
            return mt(false, t4, e4, n3, (function(t5) {
              r3.push(t5);
            })), r3;
          })("mixed" === r2 ? this.type : r2, i2, e3);
        };
      }
      function Gt(t2, e2) {
        var n2 = e2.name, r2 = e2.type, i2 = e2.direction, o2 = n2.slice(0, -1) + "Entries";
        t2.prototype[o2] = function(t3) {
          if ("mixed" !== r2 && "mixed" !== this.type && r2 !== this.type) return O.empty();
          t3 = "" + t3;
          var e3 = this._nodes.get(t3);
          if (void 0 === e3) throw new F("Graph.".concat(o2, ': could not find the "').concat(t3, '" node in the graph.'));
          return (function(t4, e4, n3) {
            if ("mixed" !== t4) {
              if ("undirected" === t4) return kt(null, n3, n3.undirected);
              if ("string" == typeof e4) return kt(null, n3, n3[e4]);
            }
            var r3 = O.empty(), i3 = new vt();
            return "undirected" !== t4 && ("out" !== e4 && (r3 = tt(r3, kt(i3, n3, n3.in))), "in" !== e4 && (r3 = tt(r3, kt(i3, n3, n3.out)))), "directed" !== t4 && (r3 = tt(r3, kt(i3, n3, n3.undirected))), r3;
          })("mixed" === r2 ? this.type : r2, i2, e3);
        };
      }
      function xt(t2, e2, n2, r2, i2) {
        for (var o2, a2, c2, u2, d2, s2, h2, p2 = r2._nodes.values(), f2 = r2.type; true !== (o2 = p2.next()).done; ) {
          var l2 = false;
          if (a2 = o2.value, "undirected" !== f2) for (c2 in u2 = a2.out) {
            d2 = u2[c2];
            do {
              if (s2 = d2.target, l2 = true, h2 = i2(a2.key, s2.key, a2.attributes, s2.attributes, d2.key, d2.attributes, d2.undirected), t2 && h2) return d2;
              d2 = d2.next;
            } while (d2);
          }
          if ("directed" !== f2) {
            for (c2 in u2 = a2.undirected) if (!(e2 && a2.key > c2)) {
              d2 = u2[c2];
              do {
                if ((s2 = d2.target).key !== c2 && (s2 = d2.source), l2 = true, h2 = i2(a2.key, s2.key, a2.attributes, s2.attributes, d2.key, d2.attributes, d2.undirected), t2 && h2) return d2;
                d2 = d2.next;
              } while (d2);
            }
          }
          if (n2 && !l2 && (h2 = i2(a2.key, null, a2.attributes, null, null, null, null), t2 && h2)) return null;
        }
      }
      function Et(t2) {
        if (!s(t2)) throw new B('Graph.import: invalid serialized node. A serialized node should be a plain object with at least a "key" property.');
        if (!("key" in t2)) throw new B("Graph.import: serialized node is missing its key.");
        if ("attributes" in t2 && (!s(t2.attributes) || null === t2.attributes)) throw new B("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.");
      }
      function At(t2) {
        if (!s(t2)) throw new B('Graph.import: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.');
        if (!("source" in t2)) throw new B("Graph.import: serialized edge is missing its source.");
        if (!("target" in t2)) throw new B("Graph.import: serialized edge is missing its target.");
        if ("attributes" in t2 && (!s(t2.attributes) || null === t2.attributes)) throw new B("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.");
        if ("undirected" in t2 && "boolean" != typeof t2.undirected) throw new B("Graph.import: invalid undirectedness information. Undirected should be boolean or omitted.");
      }
      vt.prototype.wrap = function(t2) {
        null === this.A ? this.A = t2 : null === this.B && (this.B = t2);
      }, vt.prototype.has = function(t2) {
        return null !== this.A && t2 in this.A || null !== this.B && t2 in this.B;
      };
      var Lt, St = (Lt = 255 & Math.floor(256 * Math.random()), function() {
        return Lt++;
      }), Dt = /* @__PURE__ */ new Set(["directed", "undirected", "mixed"]), Ut = /* @__PURE__ */ new Set(["domain", "_events", "_eventsCount", "_maxListeners"]), Nt = { allowSelfLoops: true, multi: false, type: "mixed" };
      function Ot(t2, e2, n2) {
        var r2 = new t2.NodeDataClass(e2, n2);
        return t2._nodes.set(e2, r2), t2.emit("nodeAdded", { key: e2, attributes: n2 }), r2;
      }
      function jt(t2, e2, n2, r2, i2, o2, a2, c2) {
        if (!r2 && "undirected" === t2.type) throw new I("Graph.".concat(e2, ": you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead."));
        if (r2 && "directed" === t2.type) throw new I("Graph.".concat(e2, ": you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead."));
        if (c2 && !s(c2)) throw new B("Graph.".concat(e2, ': invalid attributes. Expecting an object but got "').concat(c2, '"'));
        if (o2 = "" + o2, a2 = "" + a2, c2 = c2 || {}, !t2.allowSelfLoops && o2 === a2) throw new I("Graph.".concat(e2, ': source & target are the same ("').concat(o2, `"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`));
        var u2 = t2._nodes.get(o2), d2 = t2._nodes.get(a2);
        if (!u2) throw new F("Graph.".concat(e2, ': source node "').concat(o2, '" not found.'));
        if (!d2) throw new F("Graph.".concat(e2, ': target node "').concat(a2, '" not found.'));
        var h2 = { key: null, undirected: r2, source: o2, target: a2, attributes: c2 };
        if (n2) i2 = t2._edgeKeyGenerator();
        else if (i2 = "" + i2, t2._edges.has(i2)) throw new I("Graph.".concat(e2, ': the "').concat(i2, '" edge already exists in the graph.'));
        if (!t2.multi && (r2 ? void 0 !== u2.undirected[a2] : void 0 !== u2.out[a2])) throw new I("Graph.".concat(e2, ': an edge linking "').concat(o2, '" to "').concat(a2, `" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option.`));
        var p2 = new V(r2, i2, u2, d2, c2);
        t2._edges.set(i2, p2);
        var f2 = o2 === a2;
        return r2 ? (u2.undirectedDegree++, d2.undirectedDegree++, f2 && (u2.undirectedLoops++, t2._undirectedSelfLoopCount++)) : (u2.outDegree++, d2.inDegree++, f2 && (u2.directedLoops++, t2._directedSelfLoopCount++)), t2.multi ? p2.attachMulti() : p2.attach(), r2 ? t2._undirectedSize++ : t2._directedSize++, h2.key = i2, t2.emit("edgeAdded", h2), i2;
      }
      function Ct(t2, e2, n2, r2, i2, o2, a2, c2, d2) {
        if (!r2 && "undirected" === t2.type) throw new I("Graph.".concat(e2, ": you cannot merge/update a directed edge to an undirected graph. Use the #.mergeEdge/#.updateEdge or #.addUndirectedEdge instead."));
        if (r2 && "directed" === t2.type) throw new I("Graph.".concat(e2, ": you cannot merge/update an undirected edge to a directed graph. Use the #.mergeEdge/#.updateEdge or #.addDirectedEdge instead."));
        if (c2) {
          if (d2) {
            if ("function" != typeof c2) throw new B("Graph.".concat(e2, ': invalid updater function. Expecting a function but got "').concat(c2, '"'));
          } else if (!s(c2)) throw new B("Graph.".concat(e2, ': invalid attributes. Expecting an object but got "').concat(c2, '"'));
        }
        var h2;
        if (o2 = "" + o2, a2 = "" + a2, d2 && (h2 = c2, c2 = void 0), !t2.allowSelfLoops && o2 === a2) throw new I("Graph.".concat(e2, ': source & target are the same ("').concat(o2, `"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`));
        var p2, f2, l2 = t2._nodes.get(o2), g2 = t2._nodes.get(a2);
        if (!n2 && (p2 = t2._edges.get(i2))) {
          if (!(p2.source.key === o2 && p2.target.key === a2 || r2 && p2.source.key === a2 && p2.target.key === o2)) throw new I("Graph.".concat(e2, ': inconsistency detected when attempting to merge the "').concat(i2, '" edge with "').concat(o2, '" source & "').concat(a2, '" target vs. ("').concat(p2.source.key, '", "').concat(p2.target.key, '").'));
          f2 = p2;
        }
        if (f2 || t2.multi || !l2 || (f2 = r2 ? l2.undirected[a2] : l2.out[a2]), f2) {
          var y2 = [f2.key, false, false, false];
          if (d2 ? !h2 : !c2) return y2;
          if (d2) {
            var w2 = f2.attributes;
            f2.attributes = h2(w2), t2.emit("edgeAttributesUpdated", { type: "replace", key: f2.key, attributes: f2.attributes });
          } else u(f2.attributes, c2), t2.emit("edgeAttributesUpdated", { type: "merge", key: f2.key, attributes: f2.attributes, data: c2 });
          return y2;
        }
        c2 = c2 || {}, d2 && h2 && (c2 = h2(c2));
        var v2 = { key: null, undirected: r2, source: o2, target: a2, attributes: c2 };
        if (n2) i2 = t2._edgeKeyGenerator();
        else if (i2 = "" + i2, t2._edges.has(i2)) throw new I("Graph.".concat(e2, ': the "').concat(i2, '" edge already exists in the graph.'));
        var b2 = false, m2 = false;
        l2 || (l2 = Ot(t2, o2, {}), b2 = true, o2 === a2 && (g2 = l2, m2 = true)), g2 || (g2 = Ot(t2, a2, {}), m2 = true), p2 = new V(r2, i2, l2, g2, c2), t2._edges.set(i2, p2);
        var k2 = o2 === a2;
        return r2 ? (l2.undirectedDegree++, g2.undirectedDegree++, k2 && (l2.undirectedLoops++, t2._undirectedSelfLoopCount++)) : (l2.outDegree++, g2.inDegree++, k2 && (l2.directedLoops++, t2._directedSelfLoopCount++)), t2.multi ? p2.attachMulti() : p2.attach(), r2 ? t2._undirectedSize++ : t2._directedSize++, v2.key = i2, t2.emit("edgeAdded", v2), [i2, true, b2, m2];
      }
      function Mt(t2, e2) {
        t2._edges.delete(e2.key);
        var n2 = e2.source, r2 = e2.target, i2 = e2.attributes, o2 = e2.undirected, a2 = n2 === r2;
        o2 ? (n2.undirectedDegree--, r2.undirectedDegree--, a2 && (n2.undirectedLoops--, t2._undirectedSelfLoopCount--)) : (n2.outDegree--, r2.inDegree--, a2 && (n2.directedLoops--, t2._directedSelfLoopCount--)), t2.multi ? e2.detachMulti() : e2.detach(), o2 ? t2._undirectedSize-- : t2._directedSize--, t2.emit("edgeDropped", { key: e2.key, attributes: i2, source: n2.key, target: r2.key, undirected: o2 });
      }
      var zt = (function(n2) {
        function r2(t2) {
          var e2;
          if (e2 = n2.call(this) || this, "boolean" != typeof (t2 = u({}, Nt, t2)).multi) throw new B(`Graph.constructor: invalid 'multi' option. Expecting a boolean but got "`.concat(t2.multi, '".'));
          if (!Dt.has(t2.type)) throw new B(`Graph.constructor: invalid 'type' option. Should be one of "mixed", "directed" or "undirected" but got "`.concat(t2.type, '".'));
          if ("boolean" != typeof t2.allowSelfLoops) throw new B(`Graph.constructor: invalid 'allowSelfLoops' option. Expecting a boolean but got "`.concat(t2.allowSelfLoops, '".'));
          var r3 = "mixed" === t2.type ? Y : "directed" === t2.type ? q : J;
          p(c(e2), "NodeDataClass", r3);
          var i3 = "geid_" + St() + "_", o2 = 0;
          return p(c(e2), "_attributes", {}), p(c(e2), "_nodes", /* @__PURE__ */ new Map()), p(c(e2), "_edges", /* @__PURE__ */ new Map()), p(c(e2), "_directedSize", 0), p(c(e2), "_undirectedSize", 0), p(c(e2), "_directedSelfLoopCount", 0), p(c(e2), "_undirectedSelfLoopCount", 0), p(c(e2), "_edgeKeyGenerator", (function() {
            var t3;
            do {
              t3 = i3 + o2++;
            } while (e2._edges.has(t3));
            return t3;
          })), p(c(e2), "_options", t2), Ut.forEach((function(t3) {
            return p(c(e2), t3, e2[t3]);
          })), f(c(e2), "order", (function() {
            return e2._nodes.size;
          })), f(c(e2), "size", (function() {
            return e2._edges.size;
          })), f(c(e2), "directedSize", (function() {
            return e2._directedSize;
          })), f(c(e2), "undirectedSize", (function() {
            return e2._undirectedSize;
          })), f(c(e2), "selfLoopCount", (function() {
            return e2._directedSelfLoopCount + e2._undirectedSelfLoopCount;
          })), f(c(e2), "directedSelfLoopCount", (function() {
            return e2._directedSelfLoopCount;
          })), f(c(e2), "undirectedSelfLoopCount", (function() {
            return e2._undirectedSelfLoopCount;
          })), f(c(e2), "multi", e2._options.multi), f(c(e2), "type", e2._options.type), f(c(e2), "allowSelfLoops", e2._options.allowSelfLoops), f(c(e2), "implementation", (function() {
            return "graphology";
          })), e2;
        }
        e(r2, n2);
        var i2 = r2.prototype;
        return i2._resetInstanceCounters = function() {
          this._directedSize = 0, this._undirectedSize = 0, this._directedSelfLoopCount = 0, this._undirectedSelfLoopCount = 0;
        }, i2.hasNode = function(t2) {
          return this._nodes.has("" + t2);
        }, i2.hasDirectedEdge = function(t2, e2) {
          if ("undirected" === this.type) return false;
          if (1 === arguments.length) {
            var n3 = "" + t2, r3 = this._edges.get(n3);
            return !!r3 && !r3.undirected;
          }
          if (2 === arguments.length) {
            t2 = "" + t2, e2 = "" + e2;
            var i3 = this._nodes.get(t2);
            return !!i3 && i3.out.hasOwnProperty(e2);
          }
          throw new B("Graph.hasDirectedEdge: invalid arity (".concat(arguments.length, ", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."));
        }, i2.hasUndirectedEdge = function(t2, e2) {
          if ("directed" === this.type) return false;
          if (1 === arguments.length) {
            var n3 = "" + t2, r3 = this._edges.get(n3);
            return !!r3 && r3.undirected;
          }
          if (2 === arguments.length) {
            t2 = "" + t2, e2 = "" + e2;
            var i3 = this._nodes.get(t2);
            return !!i3 && i3.undirected.hasOwnProperty(e2);
          }
          throw new B("Graph.hasDirectedEdge: invalid arity (".concat(arguments.length, ", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."));
        }, i2.hasEdge = function(t2, e2) {
          if (1 === arguments.length) {
            var n3 = "" + t2;
            return this._edges.has(n3);
          }
          if (2 === arguments.length) {
            t2 = "" + t2, e2 = "" + e2;
            var r3 = this._nodes.get(t2);
            return !!r3 && (void 0 !== r3.out && r3.out.hasOwnProperty(e2) || void 0 !== r3.undirected && r3.undirected.hasOwnProperty(e2));
          }
          throw new B("Graph.hasEdge: invalid arity (".concat(arguments.length, ", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."));
        }, i2.directedEdge = function(t2, e2) {
          if ("undirected" !== this.type) {
            if (t2 = "" + t2, e2 = "" + e2, this.multi) throw new I("Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead.");
            var n3 = this._nodes.get(t2);
            if (!n3) throw new F('Graph.directedEdge: could not find the "'.concat(t2, '" source node in the graph.'));
            if (!this._nodes.has(e2)) throw new F('Graph.directedEdge: could not find the "'.concat(e2, '" target node in the graph.'));
            var r3 = n3.out && n3.out[e2] || void 0;
            return r3 ? r3.key : void 0;
          }
        }, i2.undirectedEdge = function(t2, e2) {
          if ("directed" !== this.type) {
            if (t2 = "" + t2, e2 = "" + e2, this.multi) throw new I("Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead.");
            var n3 = this._nodes.get(t2);
            if (!n3) throw new F('Graph.undirectedEdge: could not find the "'.concat(t2, '" source node in the graph.'));
            if (!this._nodes.has(e2)) throw new F('Graph.undirectedEdge: could not find the "'.concat(e2, '" target node in the graph.'));
            var r3 = n3.undirected && n3.undirected[e2] || void 0;
            return r3 ? r3.key : void 0;
          }
        }, i2.edge = function(t2, e2) {
          if (this.multi) throw new I("Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead.");
          t2 = "" + t2, e2 = "" + e2;
          var n3 = this._nodes.get(t2);
          if (!n3) throw new F('Graph.edge: could not find the "'.concat(t2, '" source node in the graph.'));
          if (!this._nodes.has(e2)) throw new F('Graph.edge: could not find the "'.concat(e2, '" target node in the graph.'));
          var r3 = n3.out && n3.out[e2] || n3.undirected && n3.undirected[e2] || void 0;
          if (r3) return r3.key;
        }, i2.areDirectedNeighbors = function(t2, e2) {
          t2 = "" + t2, e2 = "" + e2;
          var n3 = this._nodes.get(t2);
          if (!n3) throw new F('Graph.areDirectedNeighbors: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" !== this.type && (e2 in n3.in || e2 in n3.out);
        }, i2.areOutNeighbors = function(t2, e2) {
          t2 = "" + t2, e2 = "" + e2;
          var n3 = this._nodes.get(t2);
          if (!n3) throw new F('Graph.areOutNeighbors: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" !== this.type && e2 in n3.out;
        }, i2.areInNeighbors = function(t2, e2) {
          t2 = "" + t2, e2 = "" + e2;
          var n3 = this._nodes.get(t2);
          if (!n3) throw new F('Graph.areInNeighbors: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" !== this.type && e2 in n3.in;
        }, i2.areUndirectedNeighbors = function(t2, e2) {
          t2 = "" + t2, e2 = "" + e2;
          var n3 = this._nodes.get(t2);
          if (!n3) throw new F('Graph.areUndirectedNeighbors: could not find the "'.concat(t2, '" node in the graph.'));
          return "directed" !== this.type && e2 in n3.undirected;
        }, i2.areNeighbors = function(t2, e2) {
          t2 = "" + t2, e2 = "" + e2;
          var n3 = this._nodes.get(t2);
          if (!n3) throw new F('Graph.areNeighbors: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" !== this.type && (e2 in n3.in || e2 in n3.out) || "directed" !== this.type && e2 in n3.undirected;
        }, i2.areInboundNeighbors = function(t2, e2) {
          t2 = "" + t2, e2 = "" + e2;
          var n3 = this._nodes.get(t2);
          if (!n3) throw new F('Graph.areInboundNeighbors: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" !== this.type && e2 in n3.in || "directed" !== this.type && e2 in n3.undirected;
        }, i2.areOutboundNeighbors = function(t2, e2) {
          t2 = "" + t2, e2 = "" + e2;
          var n3 = this._nodes.get(t2);
          if (!n3) throw new F('Graph.areOutboundNeighbors: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" !== this.type && e2 in n3.out || "directed" !== this.type && e2 in n3.undirected;
        }, i2.inDegree = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2) throw new F('Graph.inDegree: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" === this.type ? 0 : e2.inDegree;
        }, i2.outDegree = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2) throw new F('Graph.outDegree: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" === this.type ? 0 : e2.outDegree;
        }, i2.directedDegree = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2) throw new F('Graph.directedDegree: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" === this.type ? 0 : e2.inDegree + e2.outDegree;
        }, i2.undirectedDegree = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2) throw new F('Graph.undirectedDegree: could not find the "'.concat(t2, '" node in the graph.'));
          return "directed" === this.type ? 0 : e2.undirectedDegree;
        }, i2.inboundDegree = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2) throw new F('Graph.inboundDegree: could not find the "'.concat(t2, '" node in the graph.'));
          var n3 = 0;
          return "directed" !== this.type && (n3 += e2.undirectedDegree), "undirected" !== this.type && (n3 += e2.inDegree), n3;
        }, i2.outboundDegree = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2) throw new F('Graph.outboundDegree: could not find the "'.concat(t2, '" node in the graph.'));
          var n3 = 0;
          return "directed" !== this.type && (n3 += e2.undirectedDegree), "undirected" !== this.type && (n3 += e2.outDegree), n3;
        }, i2.degree = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2) throw new F('Graph.degree: could not find the "'.concat(t2, '" node in the graph.'));
          var n3 = 0;
          return "directed" !== this.type && (n3 += e2.undirectedDegree), "undirected" !== this.type && (n3 += e2.inDegree + e2.outDegree), n3;
        }, i2.inDegreeWithoutSelfLoops = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2) throw new F('Graph.inDegreeWithoutSelfLoops: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" === this.type ? 0 : e2.inDegree - e2.directedLoops;
        }, i2.outDegreeWithoutSelfLoops = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2) throw new F('Graph.outDegreeWithoutSelfLoops: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" === this.type ? 0 : e2.outDegree - e2.directedLoops;
        }, i2.directedDegreeWithoutSelfLoops = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2) throw new F('Graph.directedDegreeWithoutSelfLoops: could not find the "'.concat(t2, '" node in the graph.'));
          return "undirected" === this.type ? 0 : e2.inDegree + e2.outDegree - 2 * e2.directedLoops;
        }, i2.undirectedDegreeWithoutSelfLoops = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2) throw new F('Graph.undirectedDegreeWithoutSelfLoops: could not find the "'.concat(t2, '" node in the graph.'));
          return "directed" === this.type ? 0 : e2.undirectedDegree - 2 * e2.undirectedLoops;
        }, i2.inboundDegreeWithoutSelfLoops = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2) throw new F('Graph.inboundDegreeWithoutSelfLoops: could not find the "'.concat(t2, '" node in the graph.'));
          var n3 = 0, r3 = 0;
          return "directed" !== this.type && (n3 += e2.undirectedDegree, r3 += 2 * e2.undirectedLoops), "undirected" !== this.type && (n3 += e2.inDegree, r3 += e2.directedLoops), n3 - r3;
        }, i2.outboundDegreeWithoutSelfLoops = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2) throw new F('Graph.outboundDegreeWithoutSelfLoops: could not find the "'.concat(t2, '" node in the graph.'));
          var n3 = 0, r3 = 0;
          return "directed" !== this.type && (n3 += e2.undirectedDegree, r3 += 2 * e2.undirectedLoops), "undirected" !== this.type && (n3 += e2.outDegree, r3 += e2.directedLoops), n3 - r3;
        }, i2.degreeWithoutSelfLoops = function(t2) {
          t2 = "" + t2;
          var e2 = this._nodes.get(t2);
          if (!e2) throw new F('Graph.degreeWithoutSelfLoops: could not find the "'.concat(t2, '" node in the graph.'));
          var n3 = 0, r3 = 0;
          return "directed" !== this.type && (n3 += e2.undirectedDegree, r3 += 2 * e2.undirectedLoops), "undirected" !== this.type && (n3 += e2.inDegree + e2.outDegree, r3 += 2 * e2.directedLoops), n3 - r3;
        }, i2.source = function(t2) {
          t2 = "" + t2;
          var e2 = this._edges.get(t2);
          if (!e2) throw new F('Graph.source: could not find the "'.concat(t2, '" edge in the graph.'));
          return e2.source.key;
        }, i2.target = function(t2) {
          t2 = "" + t2;
          var e2 = this._edges.get(t2);
          if (!e2) throw new F('Graph.target: could not find the "'.concat(t2, '" edge in the graph.'));
          return e2.target.key;
        }, i2.extremities = function(t2) {
          t2 = "" + t2;
          var e2 = this._edges.get(t2);
          if (!e2) throw new F('Graph.extremities: could not find the "'.concat(t2, '" edge in the graph.'));
          return [e2.source.key, e2.target.key];
        }, i2.opposite = function(t2, e2) {
          t2 = "" + t2, e2 = "" + e2;
          var n3 = this._edges.get(e2);
          if (!n3) throw new F('Graph.opposite: could not find the "'.concat(e2, '" edge in the graph.'));
          var r3 = n3.source.key, i3 = n3.target.key;
          if (t2 === r3) return i3;
          if (t2 === i3) return r3;
          throw new F('Graph.opposite: the "'.concat(t2, '" node is not attached to the "').concat(e2, '" edge (').concat(r3, ", ").concat(i3, ")."));
        }, i2.hasExtremity = function(t2, e2) {
          t2 = "" + t2, e2 = "" + e2;
          var n3 = this._edges.get(t2);
          if (!n3) throw new F('Graph.hasExtremity: could not find the "'.concat(t2, '" edge in the graph.'));
          return n3.source.key === e2 || n3.target.key === e2;
        }, i2.isUndirected = function(t2) {
          t2 = "" + t2;
          var e2 = this._edges.get(t2);
          if (!e2) throw new F('Graph.isUndirected: could not find the "'.concat(t2, '" edge in the graph.'));
          return e2.undirected;
        }, i2.isDirected = function(t2) {
          t2 = "" + t2;
          var e2 = this._edges.get(t2);
          if (!e2) throw new F('Graph.isDirected: could not find the "'.concat(t2, '" edge in the graph.'));
          return !e2.undirected;
        }, i2.isSelfLoop = function(t2) {
          t2 = "" + t2;
          var e2 = this._edges.get(t2);
          if (!e2) throw new F('Graph.isSelfLoop: could not find the "'.concat(t2, '" edge in the graph.'));
          return e2.source === e2.target;
        }, i2.addNode = function(t2, e2) {
          var n3 = (function(t3, e3, n4) {
            if (n4 && !s(n4)) throw new B('Graph.addNode: invalid attributes. Expecting an object but got "'.concat(n4, '"'));
            if (e3 = "" + e3, n4 = n4 || {}, t3._nodes.has(e3)) throw new I('Graph.addNode: the "'.concat(e3, '" node already exist in the graph.'));
            var r3 = new t3.NodeDataClass(e3, n4);
            return t3._nodes.set(e3, r3), t3.emit("nodeAdded", { key: e3, attributes: n4 }), r3;
          })(this, t2, e2);
          return n3.key;
        }, i2.mergeNode = function(t2, e2) {
          if (e2 && !s(e2)) throw new B('Graph.mergeNode: invalid attributes. Expecting an object but got "'.concat(e2, '"'));
          t2 = "" + t2, e2 = e2 || {};
          var n3 = this._nodes.get(t2);
          return n3 ? (e2 && (u(n3.attributes, e2), this.emit("nodeAttributesUpdated", { type: "merge", key: t2, attributes: n3.attributes, data: e2 })), [t2, false]) : (n3 = new this.NodeDataClass(t2, e2), this._nodes.set(t2, n3), this.emit("nodeAdded", { key: t2, attributes: e2 }), [t2, true]);
        }, i2.updateNode = function(t2, e2) {
          if (e2 && "function" != typeof e2) throw new B('Graph.updateNode: invalid updater function. Expecting a function but got "'.concat(e2, '"'));
          t2 = "" + t2;
          var n3 = this._nodes.get(t2);
          if (n3) {
            if (e2) {
              var r3 = n3.attributes;
              n3.attributes = e2(r3), this.emit("nodeAttributesUpdated", { type: "replace", key: t2, attributes: n3.attributes });
            }
            return [t2, false];
          }
          var i3 = e2 ? e2({}) : {};
          return n3 = new this.NodeDataClass(t2, i3), this._nodes.set(t2, n3), this.emit("nodeAdded", { key: t2, attributes: i3 }), [t2, true];
        }, i2.dropNode = function(t2) {
          t2 = "" + t2;
          var e2, n3 = this._nodes.get(t2);
          if (!n3) throw new F('Graph.dropNode: could not find the "'.concat(t2, '" node in the graph.'));
          if ("undirected" !== this.type) {
            for (var r3 in n3.out) {
              e2 = n3.out[r3];
              do {
                Mt(this, e2), e2 = e2.next;
              } while (e2);
            }
            for (var i3 in n3.in) {
              e2 = n3.in[i3];
              do {
                Mt(this, e2), e2 = e2.next;
              } while (e2);
            }
          }
          if ("directed" !== this.type) for (var o2 in n3.undirected) {
            e2 = n3.undirected[o2];
            do {
              Mt(this, e2), e2 = e2.next;
            } while (e2);
          }
          this._nodes.delete(t2), this.emit("nodeDropped", { key: t2, attributes: n3.attributes });
        }, i2.dropEdge = function(t2) {
          var e2;
          if (arguments.length > 1) {
            var n3 = "" + arguments[0], r3 = "" + arguments[1];
            if (!(e2 = d(this, n3, r3, this.type))) throw new F('Graph.dropEdge: could not find the "'.concat(n3, '" -> "').concat(r3, '" edge in the graph.'));
          } else if (t2 = "" + t2, !(e2 = this._edges.get(t2))) throw new F('Graph.dropEdge: could not find the "'.concat(t2, '" edge in the graph.'));
          return Mt(this, e2), this;
        }, i2.dropDirectedEdge = function(t2, e2) {
          if (arguments.length < 2) throw new I("Graph.dropDirectedEdge: it does not make sense to try and drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");
          if (this.multi) throw new I("Graph.dropDirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");
          var n3 = d(this, t2 = "" + t2, e2 = "" + e2, "directed");
          if (!n3) throw new F('Graph.dropDirectedEdge: could not find a "'.concat(t2, '" -> "').concat(e2, '" edge in the graph.'));
          return Mt(this, n3), this;
        }, i2.dropUndirectedEdge = function(t2, e2) {
          if (arguments.length < 2) throw new I("Graph.dropUndirectedEdge: it does not make sense to drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");
          if (this.multi) throw new I("Graph.dropUndirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");
          var n3 = d(this, t2, e2, "undirected");
          if (!n3) throw new F('Graph.dropUndirectedEdge: could not find a "'.concat(t2, '" -> "').concat(e2, '" edge in the graph.'));
          return Mt(this, n3), this;
        }, i2.clear = function() {
          this._edges.clear(), this._nodes.clear(), this._resetInstanceCounters(), this.emit("cleared");
        }, i2.clearEdges = function() {
          for (var t2, e2 = this._nodes.values(); true !== (t2 = e2.next()).done; ) t2.value.clear();
          this._edges.clear(), this._resetInstanceCounters(), this.emit("edgesCleared");
        }, i2.getAttribute = function(t2) {
          return this._attributes[t2];
        }, i2.getAttributes = function() {
          return this._attributes;
        }, i2.hasAttribute = function(t2) {
          return this._attributes.hasOwnProperty(t2);
        }, i2.setAttribute = function(t2, e2) {
          return this._attributes[t2] = e2, this.emit("attributesUpdated", { type: "set", attributes: this._attributes, name: t2 }), this;
        }, i2.updateAttribute = function(t2, e2) {
          if ("function" != typeof e2) throw new B("Graph.updateAttribute: updater should be a function.");
          var n3 = this._attributes[t2];
          return this._attributes[t2] = e2(n3), this.emit("attributesUpdated", { type: "set", attributes: this._attributes, name: t2 }), this;
        }, i2.removeAttribute = function(t2) {
          return delete this._attributes[t2], this.emit("attributesUpdated", { type: "remove", attributes: this._attributes, name: t2 }), this;
        }, i2.replaceAttributes = function(t2) {
          if (!s(t2)) throw new B("Graph.replaceAttributes: provided attributes are not a plain object.");
          return this._attributes = t2, this.emit("attributesUpdated", { type: "replace", attributes: this._attributes }), this;
        }, i2.mergeAttributes = function(t2) {
          if (!s(t2)) throw new B("Graph.mergeAttributes: provided attributes are not a plain object.");
          return u(this._attributes, t2), this.emit("attributesUpdated", { type: "merge", attributes: this._attributes, data: t2 }), this;
        }, i2.updateAttributes = function(t2) {
          if ("function" != typeof t2) throw new B("Graph.updateAttributes: provided updater is not a function.");
          return this._attributes = t2(this._attributes), this.emit("attributesUpdated", { type: "update", attributes: this._attributes }), this;
        }, i2.updateEachNodeAttributes = function(t2, e2) {
          if ("function" != typeof t2) throw new B("Graph.updateEachNodeAttributes: expecting an updater function.");
          if (e2 && !l(e2)) throw new B("Graph.updateEachNodeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");
          for (var n3, r3, i3 = this._nodes.values(); true !== (n3 = i3.next()).done; ) (r3 = n3.value).attributes = t2(r3.key, r3.attributes);
          this.emit("eachNodeAttributesUpdated", { hints: e2 || null });
        }, i2.updateEachEdgeAttributes = function(t2, e2) {
          if ("function" != typeof t2) throw new B("Graph.updateEachEdgeAttributes: expecting an updater function.");
          if (e2 && !l(e2)) throw new B("Graph.updateEachEdgeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");
          for (var n3, r3, i3, o2, a2 = this._edges.values(); true !== (n3 = a2.next()).done; ) i3 = (r3 = n3.value).source, o2 = r3.target, r3.attributes = t2(r3.key, r3.attributes, i3.key, o2.key, i3.attributes, o2.attributes, r3.undirected);
          this.emit("eachEdgeAttributesUpdated", { hints: e2 || null });
        }, i2.forEachAdjacencyEntry = function(t2) {
          if ("function" != typeof t2) throw new B("Graph.forEachAdjacencyEntry: expecting a callback.");
          xt(false, false, false, this, t2);
        }, i2.forEachAdjacencyEntryWithOrphans = function(t2) {
          if ("function" != typeof t2) throw new B("Graph.forEachAdjacencyEntryWithOrphans: expecting a callback.");
          xt(false, false, true, this, t2);
        }, i2.forEachAssymetricAdjacencyEntry = function(t2) {
          if ("function" != typeof t2) throw new B("Graph.forEachAssymetricAdjacencyEntry: expecting a callback.");
          xt(false, true, false, this, t2);
        }, i2.forEachAssymetricAdjacencyEntryWithOrphans = function(t2) {
          if ("function" != typeof t2) throw new B("Graph.forEachAssymetricAdjacencyEntryWithOrphans: expecting a callback.");
          xt(false, true, true, this, t2);
        }, i2.nodes = function() {
          return "function" == typeof Array.from ? Array.from(this._nodes.keys()) : K(this._nodes.keys(), this._nodes.size);
        }, i2.forEachNode = function(t2) {
          if ("function" != typeof t2) throw new B("Graph.forEachNode: expecting a callback.");
          for (var e2, n3, r3 = this._nodes.values(); true !== (e2 = r3.next()).done; ) t2((n3 = e2.value).key, n3.attributes);
        }, i2.findNode = function(t2) {
          if ("function" != typeof t2) throw new B("Graph.findNode: expecting a callback.");
          for (var e2, n3, r3 = this._nodes.values(); true !== (e2 = r3.next()).done; ) if (t2((n3 = e2.value).key, n3.attributes)) return n3.key;
        }, i2.mapNodes = function(t2) {
          if ("function" != typeof t2) throw new B("Graph.mapNode: expecting a callback.");
          for (var e2, n3, r3 = this._nodes.values(), i3 = new Array(this.order), o2 = 0; true !== (e2 = r3.next()).done; ) n3 = e2.value, i3[o2++] = t2(n3.key, n3.attributes);
          return i3;
        }, i2.someNode = function(t2) {
          if ("function" != typeof t2) throw new B("Graph.someNode: expecting a callback.");
          for (var e2, n3, r3 = this._nodes.values(); true !== (e2 = r3.next()).done; ) if (t2((n3 = e2.value).key, n3.attributes)) return true;
          return false;
        }, i2.everyNode = function(t2) {
          if ("function" != typeof t2) throw new B("Graph.everyNode: expecting a callback.");
          for (var e2, n3, r3 = this._nodes.values(); true !== (e2 = r3.next()).done; ) if (!t2((n3 = e2.value).key, n3.attributes)) return false;
          return true;
        }, i2.filterNodes = function(t2) {
          if ("function" != typeof t2) throw new B("Graph.filterNodes: expecting a callback.");
          for (var e2, n3, r3 = this._nodes.values(), i3 = []; true !== (e2 = r3.next()).done; ) t2((n3 = e2.value).key, n3.attributes) && i3.push(n3.key);
          return i3;
        }, i2.reduceNodes = function(t2, e2) {
          if ("function" != typeof t2) throw new B("Graph.reduceNodes: expecting a callback.");
          if (arguments.length < 2) throw new B("Graph.reduceNodes: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.");
          for (var n3, r3, i3 = e2, o2 = this._nodes.values(); true !== (n3 = o2.next()).done; ) i3 = t2(i3, (r3 = n3.value).key, r3.attributes);
          return i3;
        }, i2.nodeEntries = function() {
          var t2 = this._nodes.values();
          return new O((function() {
            var e2 = t2.next();
            if (e2.done) return e2;
            var n3 = e2.value;
            return { value: { node: n3.key, attributes: n3.attributes }, done: false };
          }));
        }, i2.export = function() {
          var t2 = this, e2 = new Array(this._nodes.size), n3 = 0;
          this._nodes.forEach((function(t3, r4) {
            e2[n3++] = (function(t4, e3) {
              var n4 = { key: t4 };
              return h(e3.attributes) || (n4.attributes = u({}, e3.attributes)), n4;
            })(r4, t3);
          }));
          var r3 = new Array(this._edges.size);
          return n3 = 0, this._edges.forEach((function(e3, i3) {
            r3[n3++] = (function(t3, e4, n4) {
              var r4 = { key: e4, source: n4.source.key, target: n4.target.key };
              return h(n4.attributes) || (r4.attributes = u({}, n4.attributes)), "mixed" === t3 && n4.undirected && (r4.undirected = true), r4;
            })(t2.type, i3, e3);
          })), { options: { type: this.type, multi: this.multi, allowSelfLoops: this.allowSelfLoops }, attributes: this.getAttributes(), nodes: e2, edges: r3 };
        }, i2.import = function(t2) {
          var e2, n3, i3, o2, a2, c2 = this, u2 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
          if (t2 instanceof r2) return t2.forEachNode((function(t3, e3) {
            u2 ? c2.mergeNode(t3, e3) : c2.addNode(t3, e3);
          })), t2.forEachEdge((function(t3, e3, n4, r3, i4, o3, a3) {
            u2 ? a3 ? c2.mergeUndirectedEdgeWithKey(t3, n4, r3, e3) : c2.mergeDirectedEdgeWithKey(t3, n4, r3, e3) : a3 ? c2.addUndirectedEdgeWithKey(t3, n4, r3, e3) : c2.addDirectedEdgeWithKey(t3, n4, r3, e3);
          })), this;
          if (!s(t2)) throw new B("Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance.");
          if (t2.attributes) {
            if (!s(t2.attributes)) throw new B("Graph.import: invalid attributes. Expecting a plain object.");
            u2 ? this.mergeAttributes(t2.attributes) : this.replaceAttributes(t2.attributes);
          }
          if (t2.nodes) {
            if (i3 = t2.nodes, !Array.isArray(i3)) throw new B("Graph.import: invalid nodes. Expecting an array.");
            for (e2 = 0, n3 = i3.length; e2 < n3; e2++) {
              Et(o2 = i3[e2]);
              var d2 = o2, h2 = d2.key, p2 = d2.attributes;
              u2 ? this.mergeNode(h2, p2) : this.addNode(h2, p2);
            }
          }
          if (t2.edges) {
            var f2 = false;
            if ("undirected" === this.type && (f2 = true), i3 = t2.edges, !Array.isArray(i3)) throw new B("Graph.import: invalid edges. Expecting an array.");
            for (e2 = 0, n3 = i3.length; e2 < n3; e2++) {
              At(a2 = i3[e2]);
              var l2 = a2, g2 = l2.source, y2 = l2.target, w2 = l2.attributes, v2 = l2.undirected, b2 = void 0 === v2 ? f2 : v2;
              "key" in a2 ? (u2 ? b2 ? this.mergeUndirectedEdgeWithKey : this.mergeDirectedEdgeWithKey : b2 ? this.addUndirectedEdgeWithKey : this.addDirectedEdgeWithKey).call(this, a2.key, g2, y2, w2) : (u2 ? b2 ? this.mergeUndirectedEdge : this.mergeDirectedEdge : b2 ? this.addUndirectedEdge : this.addDirectedEdge).call(this, g2, y2, w2);
            }
          }
          return this;
        }, i2.nullCopy = function(t2) {
          var e2 = new r2(u({}, this._options, t2));
          return e2.replaceAttributes(u({}, this.getAttributes())), e2;
        }, i2.emptyCopy = function(t2) {
          var e2 = this.nullCopy(t2);
          return this._nodes.forEach((function(t3, n3) {
            var r3 = u({}, t3.attributes);
            t3 = new e2.NodeDataClass(n3, r3), e2._nodes.set(n3, t3);
          })), e2;
        }, i2.copy = function(t2) {
          if ("string" == typeof (t2 = t2 || {}).type && t2.type !== this.type && "mixed" !== t2.type) throw new I('Graph.copy: cannot create an incompatible copy from "'.concat(this.type, '" type to "').concat(t2.type, '" because this would mean losing information about the current graph.'));
          if ("boolean" == typeof t2.multi && t2.multi !== this.multi && true !== t2.multi) throw new I("Graph.copy: cannot create an incompatible copy by downgrading a multi graph to a simple one because this would mean losing information about the current graph.");
          if ("boolean" == typeof t2.allowSelfLoops && t2.allowSelfLoops !== this.allowSelfLoops && true !== t2.allowSelfLoops) throw new I("Graph.copy: cannot create an incompatible copy from a graph allowing self loops to one that does not because this would mean losing information about the current graph.");
          for (var e2, n3, r3 = this.emptyCopy(t2), i3 = this._edges.values(); true !== (e2 = i3.next()).done; ) jt(r3, "copy", false, (n3 = e2.value).undirected, n3.key, n3.source.key, n3.target.key, u({}, n3.attributes));
          return r3;
        }, i2.toJSON = function() {
          return this.export();
        }, i2.toString = function() {
          return "[object Graph]";
        }, i2.inspect = function() {
          var e2 = this, n3 = {};
          this._nodes.forEach((function(t2, e3) {
            n3[e3] = t2.attributes;
          }));
          var r3 = {}, i3 = {};
          this._edges.forEach((function(t2, n4) {
            var o3, a3 = t2.undirected ? "--" : "->", c2 = "", u2 = t2.source.key, d2 = t2.target.key;
            t2.undirected && u2 > d2 && (o3 = u2, u2 = d2, d2 = o3);
            var s2 = "(".concat(u2, ")").concat(a3, "(").concat(d2, ")");
            n4.startsWith("geid_") ? e2.multi && (void 0 === i3[s2] ? i3[s2] = 0 : i3[s2]++, c2 += "".concat(i3[s2], ". ")) : c2 += "[".concat(n4, "]: "), r3[c2 += s2] = t2.attributes;
          }));
          var o2 = {};
          for (var a2 in this) this.hasOwnProperty(a2) && !Ut.has(a2) && "function" != typeof this[a2] && "symbol" !== t(a2) && (o2[a2] = this[a2]);
          return o2.attributes = this._attributes, o2.nodes = n3, o2.edges = r3, p(o2, "constructor", this.constructor), o2;
        }, r2;
      })(y.exports.EventEmitter);
      "undefined" != typeof Symbol && (zt.prototype[Symbol.for("nodejs.util.inspect.custom")] = zt.prototype.inspect), [{ name: function(t2) {
        return "".concat(t2, "Edge");
      }, generateKey: true }, { name: function(t2) {
        return "".concat(t2, "DirectedEdge");
      }, generateKey: true, type: "directed" }, { name: function(t2) {
        return "".concat(t2, "UndirectedEdge");
      }, generateKey: true, type: "undirected" }, { name: function(t2) {
        return "".concat(t2, "EdgeWithKey");
      } }, { name: function(t2) {
        return "".concat(t2, "DirectedEdgeWithKey");
      }, type: "directed" }, { name: function(t2) {
        return "".concat(t2, "UndirectedEdgeWithKey");
      }, type: "undirected" }].forEach((function(t2) {
        ["add", "merge", "update"].forEach((function(e2) {
          var n2 = t2.name(e2), r2 = "add" === e2 ? jt : Ct;
          t2.generateKey ? zt.prototype[n2] = function(i2, o2, a2) {
            return r2(this, n2, true, "undirected" === (t2.type || this.type), null, i2, o2, a2, "update" === e2);
          } : zt.prototype[n2] = function(i2, o2, a2, c2) {
            return r2(this, n2, false, "undirected" === (t2.type || this.type), i2, o2, a2, c2, "update" === e2);
          };
        }));
      })), (function(t2) {
        Q.forEach((function(e2) {
          var n2 = e2.name, r2 = e2.attacher;
          r2(t2, n2("Node"), 0), r2(t2, n2("Source"), 1), r2(t2, n2("Target"), 2), r2(t2, n2("Opposite"), 3);
        }));
      })(zt), (function(t2) {
        X.forEach((function(e2) {
          var n2 = e2.name, r2 = e2.attacher;
          r2(t2, n2("Edge"), "mixed"), r2(t2, n2("DirectedEdge"), "directed"), r2(t2, n2("UndirectedEdge"), "undirected");
        }));
      })(zt), (function(t2) {
        et.forEach((function(e2) {
          !(function(t3, e3) {
            var n2 = e3.name, r2 = e3.type, i2 = e3.direction;
            t3.prototype[n2] = function(t4, e4) {
              if ("mixed" !== r2 && "mixed" !== this.type && r2 !== this.type) return [];
              if (!arguments.length) return ut(this, r2);
              if (1 === arguments.length) {
                t4 = "" + t4;
                var o2 = this._nodes.get(t4);
                if (void 0 === o2) throw new F("Graph.".concat(n2, ': could not find the "').concat(t4, '" node in the graph.'));
                return pt(this.multi, "mixed" === r2 ? this.type : r2, i2, o2);
              }
              if (2 === arguments.length) {
                t4 = "" + t4, e4 = "" + e4;
                var a2 = this._nodes.get(t4);
                if (!a2) throw new F("Graph.".concat(n2, ':  could not find the "').concat(t4, '" source node in the graph.'));
                if (!this._nodes.has(e4)) throw new F("Graph.".concat(n2, ':  could not find the "').concat(e4, '" target node in the graph.'));
                return gt(r2, this.multi, i2, a2, e4);
              }
              throw new B("Graph.".concat(n2, ": too many arguments (expecting 0, 1 or 2 and got ").concat(arguments.length, ")."));
            };
          })(t2, e2), (function(t3, e3) {
            var n2 = e3.name, r2 = e3.type, i2 = e3.direction, o2 = "forEach" + n2[0].toUpperCase() + n2.slice(1, -1);
            t3.prototype[o2] = function(t4, e4, n3) {
              if ("mixed" === r2 || "mixed" === this.type || r2 === this.type) {
                if (1 === arguments.length) return dt(false, this, r2, n3 = t4);
                if (2 === arguments.length) {
                  t4 = "" + t4, n3 = e4;
                  var a3 = this._nodes.get(t4);
                  if (void 0 === a3) throw new F("Graph.".concat(o2, ': could not find the "').concat(t4, '" node in the graph.'));
                  return ht(false, this.multi, "mixed" === r2 ? this.type : r2, i2, a3, n3);
                }
                if (3 === arguments.length) {
                  t4 = "" + t4, e4 = "" + e4;
                  var c3 = this._nodes.get(t4);
                  if (!c3) throw new F("Graph.".concat(o2, ':  could not find the "').concat(t4, '" source node in the graph.'));
                  if (!this._nodes.has(e4)) throw new F("Graph.".concat(o2, ':  could not find the "').concat(e4, '" target node in the graph.'));
                  return lt(false, r2, this.multi, i2, c3, e4, n3);
                }
                throw new B("Graph.".concat(o2, ": too many arguments (expecting 1, 2 or 3 and got ").concat(arguments.length, ")."));
              }
            };
            var a2 = "map" + n2[0].toUpperCase() + n2.slice(1);
            t3.prototype[a2] = function() {
              var t4, e4 = Array.prototype.slice.call(arguments), n3 = e4.pop();
              if (0 === e4.length) {
                var i3 = 0;
                "directed" !== r2 && (i3 += this.undirectedSize), "undirected" !== r2 && (i3 += this.directedSize), t4 = new Array(i3);
                var a3 = 0;
                e4.push((function(e5, r3, i4, o3, c3, u3, d2) {
                  t4[a3++] = n3(e5, r3, i4, o3, c3, u3, d2);
                }));
              } else t4 = [], e4.push((function(e5, r3, i4, o3, a4, c3, u3) {
                t4.push(n3(e5, r3, i4, o3, a4, c3, u3));
              }));
              return this[o2].apply(this, e4), t4;
            };
            var c2 = "filter" + n2[0].toUpperCase() + n2.slice(1);
            t3.prototype[c2] = function() {
              var t4 = Array.prototype.slice.call(arguments), e4 = t4.pop(), n3 = [];
              return t4.push((function(t5, r3, i3, o3, a3, c3, u3) {
                e4(t5, r3, i3, o3, a3, c3, u3) && n3.push(t5);
              })), this[o2].apply(this, t4), n3;
            };
            var u2 = "reduce" + n2[0].toUpperCase() + n2.slice(1);
            t3.prototype[u2] = function() {
              var t4, e4, n3 = Array.prototype.slice.call(arguments);
              if (n3.length < 2 || n3.length > 4) throw new B("Graph.".concat(u2, ": invalid number of arguments (expecting 2, 3 or 4 and got ").concat(n3.length, ")."));
              if ("function" == typeof n3[n3.length - 1] && "function" != typeof n3[n3.length - 2]) throw new B("Graph.".concat(u2, ": missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array."));
              2 === n3.length ? (t4 = n3[0], e4 = n3[1], n3 = []) : 3 === n3.length ? (t4 = n3[1], e4 = n3[2], n3 = [n3[0]]) : 4 === n3.length && (t4 = n3[2], e4 = n3[3], n3 = [n3[0], n3[1]]);
              var r3 = e4;
              return n3.push((function(e5, n4, i3, o3, a3, c3, u3) {
                r3 = t4(r3, e5, n4, i3, o3, a3, c3, u3);
              })), this[o2].apply(this, n3), r3;
            };
          })(t2, e2), (function(t3, e3) {
            var n2 = e3.name, r2 = e3.type, i2 = e3.direction, o2 = "find" + n2[0].toUpperCase() + n2.slice(1, -1);
            t3.prototype[o2] = function(t4, e4, n3) {
              if ("mixed" !== r2 && "mixed" !== this.type && r2 !== this.type) return false;
              if (1 === arguments.length) return dt(true, this, r2, n3 = t4);
              if (2 === arguments.length) {
                t4 = "" + t4, n3 = e4;
                var a3 = this._nodes.get(t4);
                if (void 0 === a3) throw new F("Graph.".concat(o2, ': could not find the "').concat(t4, '" node in the graph.'));
                return ht(true, this.multi, "mixed" === r2 ? this.type : r2, i2, a3, n3);
              }
              if (3 === arguments.length) {
                t4 = "" + t4, e4 = "" + e4;
                var c3 = this._nodes.get(t4);
                if (!c3) throw new F("Graph.".concat(o2, ':  could not find the "').concat(t4, '" source node in the graph.'));
                if (!this._nodes.has(e4)) throw new F("Graph.".concat(o2, ':  could not find the "').concat(e4, '" target node in the graph.'));
                return lt(true, r2, this.multi, i2, c3, e4, n3);
              }
              throw new B("Graph.".concat(o2, ": too many arguments (expecting 1, 2 or 3 and got ").concat(arguments.length, ")."));
            };
            var a2 = "some" + n2[0].toUpperCase() + n2.slice(1, -1);
            t3.prototype[a2] = function() {
              var t4 = Array.prototype.slice.call(arguments), e4 = t4.pop();
              return t4.push((function(t5, n3, r3, i3, o3, a3, c3) {
                return e4(t5, n3, r3, i3, o3, a3, c3);
              })), !!this[o2].apply(this, t4);
            };
            var c2 = "every" + n2[0].toUpperCase() + n2.slice(1, -1);
            t3.prototype[c2] = function() {
              var t4 = Array.prototype.slice.call(arguments), e4 = t4.pop();
              return t4.push((function(t5, n3, r3, i3, o3, a3, c3) {
                return !e4(t5, n3, r3, i3, o3, a3, c3);
              })), !this[o2].apply(this, t4);
            };
          })(t2, e2), (function(t3, e3) {
            var n2 = e3.name, r2 = e3.type, i2 = e3.direction, o2 = n2.slice(0, -1) + "Entries";
            t3.prototype[o2] = function(t4, e4) {
              if ("mixed" !== r2 && "mixed" !== this.type && r2 !== this.type) return O.empty();
              if (!arguments.length) return st(this, r2);
              if (1 === arguments.length) {
                t4 = "" + t4;
                var n3 = this._nodes.get(t4);
                if (!n3) throw new F("Graph.".concat(o2, ': could not find the "').concat(t4, '" node in the graph.'));
                return ft(r2, i2, n3);
              }
              if (2 === arguments.length) {
                t4 = "" + t4, e4 = "" + e4;
                var a2 = this._nodes.get(t4);
                if (!a2) throw new F("Graph.".concat(o2, ':  could not find the "').concat(t4, '" source node in the graph.'));
                if (!this._nodes.has(e4)) throw new F("Graph.".concat(o2, ':  could not find the "').concat(e4, '" target node in the graph.'));
                return yt(r2, i2, a2, e4);
              }
              throw new B("Graph.".concat(o2, ": too many arguments (expecting 0, 1 or 2 and got ").concat(arguments.length, ")."));
            };
          })(t2, e2);
        }));
      })(zt), (function(t2) {
        wt.forEach((function(e2) {
          _t(t2, e2), (function(t3, e3) {
            var n2 = e3.name, r2 = e3.type, i2 = e3.direction, o2 = "forEach" + n2[0].toUpperCase() + n2.slice(1, -1);
            t3.prototype[o2] = function(t4, e4) {
              if ("mixed" === r2 || "mixed" === this.type || r2 === this.type) {
                t4 = "" + t4;
                var n3 = this._nodes.get(t4);
                if (void 0 === n3) throw new F("Graph.".concat(o2, ': could not find the "').concat(t4, '" node in the graph.'));
                mt(false, "mixed" === r2 ? this.type : r2, i2, n3, e4);
              }
            };
            var a2 = "map" + n2[0].toUpperCase() + n2.slice(1);
            t3.prototype[a2] = function(t4, e4) {
              var n3 = [];
              return this[o2](t4, (function(t5, r3) {
                n3.push(e4(t5, r3));
              })), n3;
            };
            var c2 = "filter" + n2[0].toUpperCase() + n2.slice(1);
            t3.prototype[c2] = function(t4, e4) {
              var n3 = [];
              return this[o2](t4, (function(t5, r3) {
                e4(t5, r3) && n3.push(t5);
              })), n3;
            };
            var u2 = "reduce" + n2[0].toUpperCase() + n2.slice(1);
            t3.prototype[u2] = function(t4, e4, n3) {
              if (arguments.length < 3) throw new B("Graph.".concat(u2, ": missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array."));
              var r3 = n3;
              return this[o2](t4, (function(t5, n4) {
                r3 = e4(r3, t5, n4);
              })), r3;
            };
          })(t2, e2), (function(t3, e3) {
            var n2 = e3.name, r2 = e3.type, i2 = e3.direction, o2 = n2[0].toUpperCase() + n2.slice(1, -1), a2 = "find" + o2;
            t3.prototype[a2] = function(t4, e4) {
              if ("mixed" === r2 || "mixed" === this.type || r2 === this.type) {
                t4 = "" + t4;
                var n3 = this._nodes.get(t4);
                if (void 0 === n3) throw new F("Graph.".concat(a2, ': could not find the "').concat(t4, '" node in the graph.'));
                return mt(true, "mixed" === r2 ? this.type : r2, i2, n3, e4);
              }
            };
            var c2 = "some" + o2;
            t3.prototype[c2] = function(t4, e4) {
              return !!this[a2](t4, e4);
            };
            var u2 = "every" + o2;
            t3.prototype[u2] = function(t4, e4) {
              return !this[a2](t4, (function(t5, n3) {
                return !e4(t5, n3);
              }));
            };
          })(t2, e2), Gt(t2, e2);
        }));
      })(zt);
      var Wt = (function(t2) {
        function n2(e2) {
          var n3 = u({ type: "directed" }, e2);
          if ("multi" in n3 && false !== n3.multi) throw new B("DirectedGraph.from: inconsistent indication that the graph should be multi in given options!");
          if ("directed" !== n3.type) throw new B('DirectedGraph.from: inconsistent "' + n3.type + '" type in given options!');
          return t2.call(this, n3) || this;
        }
        return e(n2, t2), n2;
      })(zt), Pt = (function(t2) {
        function n2(e2) {
          var n3 = u({ type: "undirected" }, e2);
          if ("multi" in n3 && false !== n3.multi) throw new B("UndirectedGraph.from: inconsistent indication that the graph should be multi in given options!");
          if ("undirected" !== n3.type) throw new B('UndirectedGraph.from: inconsistent "' + n3.type + '" type in given options!');
          return t2.call(this, n3) || this;
        }
        return e(n2, t2), n2;
      })(zt), Rt = (function(t2) {
        function n2(e2) {
          var n3 = u({ multi: true }, e2);
          if ("multi" in n3 && true !== n3.multi) throw new B("MultiGraph.from: inconsistent indication that the graph should be simple in given options!");
          return t2.call(this, n3) || this;
        }
        return e(n2, t2), n2;
      })(zt), Kt = (function(t2) {
        function n2(e2) {
          var n3 = u({ type: "directed", multi: true }, e2);
          if ("multi" in n3 && true !== n3.multi) throw new B("MultiDirectedGraph.from: inconsistent indication that the graph should be simple in given options!");
          if ("directed" !== n3.type) throw new B('MultiDirectedGraph.from: inconsistent "' + n3.type + '" type in given options!');
          return t2.call(this, n3) || this;
        }
        return e(n2, t2), n2;
      })(zt), Tt = (function(t2) {
        function n2(e2) {
          var n3 = u({ type: "undirected", multi: true }, e2);
          if ("multi" in n3 && true !== n3.multi) throw new B("MultiUndirectedGraph.from: inconsistent indication that the graph should be simple in given options!");
          if ("undirected" !== n3.type) throw new B('MultiUndirectedGraph.from: inconsistent "' + n3.type + '" type in given options!');
          return t2.call(this, n3) || this;
        }
        return e(n2, t2), n2;
      })(zt);
      function Bt(t2) {
        t2.from = function(e2, n2) {
          var r2 = u({}, e2.options, n2), i2 = new t2(r2);
          return i2.import(e2), i2;
        };
      }
      return Bt(zt), Bt(Wt), Bt(Pt), Bt(Rt), Bt(Kt), Bt(Tt), zt.Graph = zt, zt.DirectedGraph = Wt, zt.UndirectedGraph = Pt, zt.MultiGraph = Rt, zt.MultiDirectedGraph = Kt, zt.MultiUndirectedGraph = Tt, zt.InvalidArgumentsGraphError = B, zt.NotFoundGraphError = F, zt.UsageGraphError = I, zt;
    }));
  }
});

// node_modules/events/events.js
var require_events = __commonJS({
  "node_modules/events/events.js"(exports, module) {
    "use strict";
    var R = typeof Reflect === "object" ? Reflect : null;
    var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
      return Function.prototype.apply.call(target, receiver, args);
    };
    var ReflectOwnKeys;
    if (R && typeof R.ownKeys === "function") {
      ReflectOwnKeys = R.ownKeys;
    } else if (Object.getOwnPropertySymbols) {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
      };
    } else {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target);
      };
    }
    function ProcessEmitWarning(warning) {
      if (console && console.warn) console.warn(warning);
    }
    var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
      return value !== value;
    };
    function EventEmitter3() {
      EventEmitter3.init.call(this);
    }
    module.exports = EventEmitter3;
    module.exports.once = once;
    EventEmitter3.EventEmitter = EventEmitter3;
    EventEmitter3.prototype._events = void 0;
    EventEmitter3.prototype._eventsCount = 0;
    EventEmitter3.prototype._maxListeners = void 0;
    var defaultMaxListeners = 10;
    function checkListener(listener) {
      if (typeof listener !== "function") {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
    }
    Object.defineProperty(EventEmitter3, "defaultMaxListeners", {
      enumerable: true,
      get: function() {
        return defaultMaxListeners;
      },
      set: function(arg) {
        if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
        }
        defaultMaxListeners = arg;
      }
    });
    EventEmitter3.init = function() {
      if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
      }
      this._maxListeners = this._maxListeners || void 0;
    };
    EventEmitter3.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
      }
      this._maxListeners = n;
      return this;
    };
    function _getMaxListeners(that) {
      if (that._maxListeners === void 0)
        return EventEmitter3.defaultMaxListeners;
      return that._maxListeners;
    }
    EventEmitter3.prototype.getMaxListeners = function getMaxListeners() {
      return _getMaxListeners(this);
    };
    EventEmitter3.prototype.emit = function emit(type) {
      var args = [];
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
      var doError = type === "error";
      var events = this._events;
      if (events !== void 0)
        doError = doError && events.error === void 0;
      else if (!doError)
        return false;
      if (doError) {
        var er;
        if (args.length > 0)
          er = args[0];
        if (er instanceof Error) {
          throw er;
        }
        var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
        err.context = er;
        throw err;
      }
      var handler = events[type];
      if (handler === void 0)
        return false;
      if (typeof handler === "function") {
        ReflectApply(handler, this, args);
      } else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          ReflectApply(listeners[i], this, args);
      }
      return true;
    };
    function _addListener(target, type, listener, prepend) {
      var m;
      var events;
      var existing;
      checkListener(listener);
      events = target._events;
      if (events === void 0) {
        events = target._events = /* @__PURE__ */ Object.create(null);
        target._eventsCount = 0;
      } else {
        if (events.newListener !== void 0) {
          target.emit(
            "newListener",
            type,
            listener.listener ? listener.listener : listener
          );
          events = target._events;
        }
        existing = events[type];
      }
      if (existing === void 0) {
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === "function") {
          existing = events[type] = prepend ? [listener, existing] : [existing, listener];
        } else if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
        m = _getMaxListeners(target);
        if (m > 0 && existing.length > m && !existing.warned) {
          existing.warned = true;
          var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
          w.name = "MaxListenersExceededWarning";
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          ProcessEmitWarning(w);
        }
      }
      return target;
    }
    EventEmitter3.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };
    EventEmitter3.prototype.on = EventEmitter3.prototype.addListener;
    EventEmitter3.prototype.prependListener = function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };
    function onceWrapper() {
      if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        if (arguments.length === 0)
          return this.listener.call(this.target);
        return this.listener.apply(this.target, arguments);
      }
    }
    function _onceWrap(target, type, listener) {
      var state = { fired: false, wrapFn: void 0, target, type, listener };
      var wrapped = onceWrapper.bind(state);
      wrapped.listener = listener;
      state.wrapFn = wrapped;
      return wrapped;
    }
    EventEmitter3.prototype.once = function once2(type, listener) {
      checkListener(listener);
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter3.prototype.prependOnceListener = function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter3.prototype.removeListener = function removeListener(type, listener) {
      var list, events, position, i, originalListener;
      checkListener(listener);
      events = this._events;
      if (events === void 0)
        return this;
      list = events[type];
      if (list === void 0)
        return this;
      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = /* @__PURE__ */ Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit("removeListener", type, list.listener || listener);
        }
      } else if (typeof list !== "function") {
        position = -1;
        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }
        if (position < 0)
          return this;
        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }
        if (list.length === 1)
          events[type] = list[0];
        if (events.removeListener !== void 0)
          this.emit("removeListener", type, originalListener || listener);
      }
      return this;
    };
    EventEmitter3.prototype.off = EventEmitter3.prototype.removeListener;
    EventEmitter3.prototype.removeAllListeners = function removeAllListeners(type) {
      var listeners, events, i;
      events = this._events;
      if (events === void 0)
        return this;
      if (events.removeListener === void 0) {
        if (arguments.length === 0) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== void 0) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else
            delete events[type];
        }
        return this;
      }
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === "removeListener") continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
        return this;
      }
      listeners = events[type];
      if (typeof listeners === "function") {
        this.removeListener(type, listeners);
      } else if (listeners !== void 0) {
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }
      return this;
    };
    function _listeners(target, type, unwrap) {
      var events = target._events;
      if (events === void 0)
        return [];
      var evlistener = events[type];
      if (evlistener === void 0)
        return [];
      if (typeof evlistener === "function")
        return unwrap ? [evlistener.listener || evlistener] : [evlistener];
      return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    }
    EventEmitter3.prototype.listeners = function listeners(type) {
      return _listeners(this, type, true);
    };
    EventEmitter3.prototype.rawListeners = function rawListeners(type) {
      return _listeners(this, type, false);
    };
    EventEmitter3.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === "function") {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };
    EventEmitter3.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events = this._events;
      if (events !== void 0) {
        var evlistener = events[type];
        if (typeof evlistener === "function") {
          return 1;
        } else if (evlistener !== void 0) {
          return evlistener.length;
        }
      }
      return 0;
    }
    EventEmitter3.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
    };
    function arrayClone(arr, n) {
      var copy = new Array(n);
      for (var i = 0; i < n; ++i)
        copy[i] = arr[i];
      return copy;
    }
    function spliceOne(list, index) {
      for (; index + 1 < list.length; index++)
        list[index] = list[index + 1];
      list.pop();
    }
    function unwrapListeners(arr) {
      var ret = new Array(arr.length);
      for (var i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
      }
      return ret;
    }
    function once(emitter, name) {
      return new Promise(function(resolve, reject) {
        function errorListener(err) {
          emitter.removeListener(name, resolver);
          reject(err);
        }
        function resolver() {
          if (typeof emitter.removeListener === "function") {
            emitter.removeListener("error", errorListener);
          }
          resolve([].slice.call(arguments));
        }
        ;
        eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
        if (name !== "error") {
          addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
        }
      });
    }
    function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
      if (typeof emitter.on === "function") {
        eventTargetAgnosticAddListener(emitter, "error", handler, flags);
      }
    }
    function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
      if (typeof emitter.on === "function") {
        if (flags.once) {
          emitter.once(name, listener);
        } else {
          emitter.on(name, listener);
        }
      } else if (typeof emitter.addEventListener === "function") {
        emitter.addEventListener(name, function wrapListener(arg) {
          if (flags.once) {
            emitter.removeEventListener(name, wrapListener);
          }
          listener(arg);
        });
      } else {
        throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
      }
    }
  }
});

// node_modules/graphology-utils/is-graph.js
var require_is_graph = __commonJS({
  "node_modules/graphology-utils/is-graph.js"(exports, module) {
    module.exports = function isGraph2(value) {
      return value !== null && typeof value === "object" && typeof value.addUndirectedEdgeWithKey === "function" && typeof value.dropNode === "function" && typeof value.multi === "boolean";
    };
  }
});

// main.js
var import_graphology = __toESM(require_graphology_umd_min(), 1);

// node_modules/sigma/dist/inherits-d1a1e29b.esm.js
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t2) {
    return t2.__proto__ || Object.getPrototypeOf(t2);
  }, _getPrototypeOf(t);
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch (t2) {
  }
  return (_isNativeReflectConstruct = function() {
    return !!t;
  })();
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t2, e2) {
    return t2.__proto__ = e2, t2;
  }, _setPrototypeOf(t, e);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: true,
      configurable: true
    }
  }), Object.defineProperty(t, "prototype", {
    writable: false
  }), e && _setPrototypeOf(t, e);
}

// node_modules/sigma/dist/colors-beb06eb2.esm.js
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e, n, i, u, a = [], f = true, o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = false;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
    } catch (r2) {
      o = true, n = r2;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
var HTML_COLORS = {
  black: "#000000",
  silver: "#C0C0C0",
  gray: "#808080",
  grey: "#808080",
  white: "#FFFFFF",
  maroon: "#800000",
  red: "#FF0000",
  purple: "#800080",
  fuchsia: "#FF00FF",
  green: "#008000",
  lime: "#00FF00",
  olive: "#808000",
  yellow: "#FFFF00",
  navy: "#000080",
  blue: "#0000FF",
  teal: "#008080",
  aqua: "#00FFFF",
  darkblue: "#00008B",
  mediumblue: "#0000CD",
  darkgreen: "#006400",
  darkcyan: "#008B8B",
  deepskyblue: "#00BFFF",
  darkturquoise: "#00CED1",
  mediumspringgreen: "#00FA9A",
  springgreen: "#00FF7F",
  cyan: "#00FFFF",
  midnightblue: "#191970",
  dodgerblue: "#1E90FF",
  lightseagreen: "#20B2AA",
  forestgreen: "#228B22",
  seagreen: "#2E8B57",
  darkslategray: "#2F4F4F",
  darkslategrey: "#2F4F4F",
  limegreen: "#32CD32",
  mediumseagreen: "#3CB371",
  turquoise: "#40E0D0",
  royalblue: "#4169E1",
  steelblue: "#4682B4",
  darkslateblue: "#483D8B",
  mediumturquoise: "#48D1CC",
  indigo: "#4B0082",
  darkolivegreen: "#556B2F",
  cadetblue: "#5F9EA0",
  cornflowerblue: "#6495ED",
  rebeccapurple: "#663399",
  mediumaquamarine: "#66CDAA",
  dimgray: "#696969",
  dimgrey: "#696969",
  slateblue: "#6A5ACD",
  olivedrab: "#6B8E23",
  slategray: "#708090",
  slategrey: "#708090",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  mediumslateblue: "#7B68EE",
  lawngreen: "#7CFC00",
  chartreuse: "#7FFF00",
  aquamarine: "#7FFFD4",
  skyblue: "#87CEEB",
  lightskyblue: "#87CEFA",
  blueviolet: "#8A2BE2",
  darkred: "#8B0000",
  darkmagenta: "#8B008B",
  saddlebrown: "#8B4513",
  darkseagreen: "#8FBC8F",
  lightgreen: "#90EE90",
  mediumpurple: "#9370DB",
  darkviolet: "#9400D3",
  palegreen: "#98FB98",
  darkorchid: "#9932CC",
  yellowgreen: "#9ACD32",
  sienna: "#A0522D",
  brown: "#A52A2A",
  darkgray: "#A9A9A9",
  darkgrey: "#A9A9A9",
  lightblue: "#ADD8E6",
  greenyellow: "#ADFF2F",
  paleturquoise: "#AFEEEE",
  lightsteelblue: "#B0C4DE",
  powderblue: "#B0E0E6",
  firebrick: "#B22222",
  darkgoldenrod: "#B8860B",
  mediumorchid: "#BA55D3",
  rosybrown: "#BC8F8F",
  darkkhaki: "#BDB76B",
  mediumvioletred: "#C71585",
  indianred: "#CD5C5C",
  peru: "#CD853F",
  chocolate: "#D2691E",
  tan: "#D2B48C",
  lightgray: "#D3D3D3",
  lightgrey: "#D3D3D3",
  thistle: "#D8BFD8",
  orchid: "#DA70D6",
  goldenrod: "#DAA520",
  palevioletred: "#DB7093",
  crimson: "#DC143C",
  gainsboro: "#DCDCDC",
  plum: "#DDA0DD",
  burlywood: "#DEB887",
  lightcyan: "#E0FFFF",
  lavender: "#E6E6FA",
  darksalmon: "#E9967A",
  violet: "#EE82EE",
  palegoldenrod: "#EEE8AA",
  lightcoral: "#F08080",
  khaki: "#F0E68C",
  aliceblue: "#F0F8FF",
  honeydew: "#F0FFF0",
  azure: "#F0FFFF",
  sandybrown: "#F4A460",
  wheat: "#F5DEB3",
  beige: "#F5F5DC",
  whitesmoke: "#F5F5F5",
  mintcream: "#F5FFFA",
  ghostwhite: "#F8F8FF",
  salmon: "#FA8072",
  antiquewhite: "#FAEBD7",
  linen: "#FAF0E6",
  lightgoldenrodyellow: "#FAFAD2",
  oldlace: "#FDF5E6",
  magenta: "#FF00FF",
  deeppink: "#FF1493",
  orangered: "#FF4500",
  tomato: "#FF6347",
  hotpink: "#FF69B4",
  coral: "#FF7F50",
  darkorange: "#FF8C00",
  lightsalmon: "#FFA07A",
  orange: "#FFA500",
  lightpink: "#FFB6C1",
  pink: "#FFC0CB",
  gold: "#FFD700",
  peachpuff: "#FFDAB9",
  navajowhite: "#FFDEAD",
  moccasin: "#FFE4B5",
  bisque: "#FFE4C4",
  mistyrose: "#FFE4E1",
  blanchedalmond: "#FFEBCD",
  papayawhip: "#FFEFD5",
  lavenderblush: "#FFF0F5",
  seashell: "#FFF5EE",
  cornsilk: "#FFF8DC",
  lemonchiffon: "#FFFACD",
  floralwhite: "#FFFAF0",
  snow: "#FFFAFA",
  lightyellow: "#FFFFE0",
  ivory: "#FFFFF0"
};
var INT8 = new Int8Array(4);
var INT32 = new Int32Array(INT8.buffer, 0, 1);
var FLOAT32 = new Float32Array(INT8.buffer, 0, 1);
var RGBA_TEST_REGEX = /^\s*rgba?\s*\(/;
var RGBA_EXTRACT_REGEX = /^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)(?:\s*,\s*(.*)?)?\)\s*$/;
function parseColor(val) {
  var r = 0;
  var g = 0;
  var b = 0;
  var a = 1;
  if (val[0] === "#") {
    if (val.length === 4) {
      r = parseInt(val.charAt(1) + val.charAt(1), 16);
      g = parseInt(val.charAt(2) + val.charAt(2), 16);
      b = parseInt(val.charAt(3) + val.charAt(3), 16);
    } else {
      r = parseInt(val.charAt(1) + val.charAt(2), 16);
      g = parseInt(val.charAt(3) + val.charAt(4), 16);
      b = parseInt(val.charAt(5) + val.charAt(6), 16);
    }
    if (val.length === 9) {
      a = parseInt(val.charAt(7) + val.charAt(8), 16) / 255;
    }
  } else if (RGBA_TEST_REGEX.test(val)) {
    var match = val.match(RGBA_EXTRACT_REGEX);
    if (match) {
      r = +match[1];
      g = +match[2];
      b = +match[3];
      if (match[4]) a = +match[4];
    }
  }
  return {
    r,
    g,
    b,
    a
  };
}
var FLOAT_COLOR_CACHE = {};
for (htmlColor in HTML_COLORS) {
  FLOAT_COLOR_CACHE[htmlColor] = floatColor(HTML_COLORS[htmlColor]);
  FLOAT_COLOR_CACHE[HTML_COLORS[htmlColor]] = FLOAT_COLOR_CACHE[htmlColor];
}
var htmlColor;
function rgbaToFloat(r, g, b, a, masking) {
  INT32[0] = a << 24 | b << 16 | g << 8 | r;
  if (masking) INT32[0] = INT32[0] & 4278190079;
  return FLOAT32[0];
}
function floatColor(val) {
  val = val.toLowerCase();
  if (typeof FLOAT_COLOR_CACHE[val] !== "undefined") return FLOAT_COLOR_CACHE[val];
  var parsed = parseColor(val);
  var r = parsed.r, g = parsed.g, b = parsed.b;
  var a = parsed.a;
  a = a * 255 | 0;
  var color = rgbaToFloat(r, g, b, a, true);
  FLOAT_COLOR_CACHE[val] = color;
  return color;
}
var FLOAT_INDEX_CACHE = {};
function indexToColor(index) {
  if (typeof FLOAT_INDEX_CACHE[index] !== "undefined") return FLOAT_INDEX_CACHE[index];
  var r = (index & 16711680) >>> 16;
  var g = (index & 65280) >>> 8;
  var b = index & 255;
  var a = 255;
  var color = rgbaToFloat(r, g, b, a, true);
  FLOAT_INDEX_CACHE[index] = color;
  return color;
}
function colorToIndex(r, g, b, _a) {
  return b + (g << 8) + (r << 16);
}
function getPixelColor(gl, frameBuffer, x, y, pixelRatio, downSizingRatio) {
  var bufferX = Math.floor(x / downSizingRatio * pixelRatio);
  var bufferY = Math.floor(gl.drawingBufferHeight / downSizingRatio - y / downSizingRatio * pixelRatio);
  var pixel = new Uint8Array(4);
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.readPixels(bufferX, bufferY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
  var _pixel = _slicedToArray(pixel, 4), r = _pixel[0], g = _pixel[1], b = _pixel[2], a = _pixel[3];
  return [r, g, b, a];
}

// node_modules/sigma/dist/index-fad77a13.esm.js
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _superPropBase(t, o) {
  for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t)); ) ;
  return t;
}
function _get() {
  return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function(e, t, r) {
    var p = _superPropBase(e, t);
    if (p) {
      var n = Object.getOwnPropertyDescriptor(p, t);
      return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value;
    }
  }, _get.apply(null, arguments);
}
function _superPropGet(t, o, e, r) {
  var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e);
  return 2 & r && "function" == typeof p ? function(t2) {
    return p.apply(e, t2);
  } : p;
}
function getAttributeItemsCount(attr) {
  return attr.normalized ? 1 : attr.size;
}
function getAttributesItemsCount(attrs) {
  var res = 0;
  attrs.forEach(function(attr) {
    return res += getAttributeItemsCount(attr);
  });
  return res;
}
function loadShader(type, gl, source) {
  var glType = type === "VERTEX" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
  var shader = gl.createShader(glType);
  if (shader === null) {
    throw new Error("loadShader: error while creating the shader");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var successfullyCompiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!successfullyCompiled) {
    var infoLog = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error("loadShader: error while compiling the shader:\n".concat(infoLog, "\n").concat(source));
  }
  return shader;
}
function loadVertexShader(gl, source) {
  return loadShader("VERTEX", gl, source);
}
function loadFragmentShader(gl, source) {
  return loadShader("FRAGMENT", gl, source);
}
function loadProgram(gl, shaders) {
  var program = gl.createProgram();
  if (program === null) {
    throw new Error("loadProgram: error while creating the program.");
  }
  var i, l;
  for (i = 0, l = shaders.length; i < l; i++) gl.attachShader(program, shaders[i]);
  gl.linkProgram(program);
  var successfullyLinked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!successfullyLinked) {
    var info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error("loadProgram: error while linking the program: ".concat(info));
  }
  return program;
}
function killProgram(_ref) {
  var gl = _ref.gl, buffer = _ref.buffer, program = _ref.program, vertexShader = _ref.vertexShader, fragmentShader = _ref.fragmentShader;
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  gl.deleteProgram(program);
  gl.deleteBuffer(buffer);
}
var PICKING_PREFIX = "#define PICKING_MODE\n";
var SIZE_FACTOR_PER_ATTRIBUTE_TYPE = _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, WebGL2RenderingContext.BOOL, 1), WebGL2RenderingContext.BYTE, 1), WebGL2RenderingContext.UNSIGNED_BYTE, 1), WebGL2RenderingContext.SHORT, 2), WebGL2RenderingContext.UNSIGNED_SHORT, 2), WebGL2RenderingContext.INT, 4), WebGL2RenderingContext.UNSIGNED_INT, 4), WebGL2RenderingContext.FLOAT, 4);
var Program = /* @__PURE__ */ (function() {
  function Program2(gl, pickingBuffer, renderer) {
    _classCallCheck(this, Program2);
    _defineProperty(this, "array", new Float32Array());
    _defineProperty(this, "constantArray", new Float32Array());
    _defineProperty(this, "capacity", 0);
    _defineProperty(this, "verticesCount", 0);
    var def = this.getDefinition();
    this.VERTICES = def.VERTICES;
    this.VERTEX_SHADER_SOURCE = def.VERTEX_SHADER_SOURCE;
    this.FRAGMENT_SHADER_SOURCE = def.FRAGMENT_SHADER_SOURCE;
    this.UNIFORMS = def.UNIFORMS;
    this.ATTRIBUTES = def.ATTRIBUTES;
    this.METHOD = def.METHOD;
    this.CONSTANT_ATTRIBUTES = "CONSTANT_ATTRIBUTES" in def ? def.CONSTANT_ATTRIBUTES : [];
    this.CONSTANT_DATA = "CONSTANT_DATA" in def ? def.CONSTANT_DATA : [];
    this.isInstanced = "CONSTANT_ATTRIBUTES" in def;
    this.ATTRIBUTES_ITEMS_COUNT = getAttributesItemsCount(this.ATTRIBUTES);
    this.STRIDE = this.VERTICES * this.ATTRIBUTES_ITEMS_COUNT;
    this.renderer = renderer;
    this.normalProgram = this.getProgramInfo("normal", gl, def.VERTEX_SHADER_SOURCE, def.FRAGMENT_SHADER_SOURCE, null);
    this.pickProgram = pickingBuffer ? this.getProgramInfo("pick", gl, PICKING_PREFIX + def.VERTEX_SHADER_SOURCE, PICKING_PREFIX + def.FRAGMENT_SHADER_SOURCE, pickingBuffer) : null;
    if (this.isInstanced) {
      var constantAttributesItemsCount = getAttributesItemsCount(this.CONSTANT_ATTRIBUTES);
      if (this.CONSTANT_DATA.length !== this.VERTICES) throw new Error("Program: error while getting constant data (expected ".concat(this.VERTICES, " items, received ").concat(this.CONSTANT_DATA.length, " instead)"));
      this.constantArray = new Float32Array(this.CONSTANT_DATA.length * constantAttributesItemsCount);
      for (var i = 0; i < this.CONSTANT_DATA.length; i++) {
        var vector = this.CONSTANT_DATA[i];
        if (vector.length !== constantAttributesItemsCount) throw new Error("Program: error while getting constant data (one vector has ".concat(vector.length, " items instead of ").concat(constantAttributesItemsCount, ")"));
        for (var j = 0; j < vector.length; j++) this.constantArray[i * constantAttributesItemsCount + j] = vector[j];
      }
      this.STRIDE = this.ATTRIBUTES_ITEMS_COUNT;
    }
  }
  return _createClass(Program2, [{
    key: "kill",
    value: function kill() {
      killProgram(this.normalProgram);
      if (this.pickProgram) {
        killProgram(this.pickProgram);
        this.pickProgram = null;
      }
    }
  }, {
    key: "getProgramInfo",
    value: function getProgramInfo(name, gl, vertexShaderSource, fragmentShaderSource, frameBuffer) {
      var def = this.getDefinition();
      var buffer = gl.createBuffer();
      if (buffer === null) throw new Error("Program: error while creating the WebGL buffer.");
      var vertexShader = loadVertexShader(gl, vertexShaderSource);
      var fragmentShader = loadFragmentShader(gl, fragmentShaderSource);
      var program = loadProgram(gl, [vertexShader, fragmentShader]);
      var uniformLocations = {};
      def.UNIFORMS.forEach(function(uniformName) {
        var location = gl.getUniformLocation(program, uniformName);
        if (location) uniformLocations[uniformName] = location;
      });
      var attributeLocations = {};
      def.ATTRIBUTES.forEach(function(attr) {
        attributeLocations[attr.name] = gl.getAttribLocation(program, attr.name);
      });
      var constantBuffer;
      if ("CONSTANT_ATTRIBUTES" in def) {
        def.CONSTANT_ATTRIBUTES.forEach(function(attr) {
          attributeLocations[attr.name] = gl.getAttribLocation(program, attr.name);
        });
        constantBuffer = gl.createBuffer();
        if (constantBuffer === null) throw new Error("Program: error while creating the WebGL constant buffer.");
      }
      return {
        name,
        program,
        gl,
        frameBuffer,
        buffer,
        constantBuffer: constantBuffer || {},
        uniformLocations,
        attributeLocations,
        isPicking: name === "pick",
        vertexShader,
        fragmentShader
      };
    }
  }, {
    key: "bindProgram",
    value: function bindProgram(program) {
      var _this = this;
      var offset = 0;
      var gl = program.gl, buffer = program.buffer;
      if (!this.isInstanced) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        offset = 0;
        this.ATTRIBUTES.forEach(function(attr) {
          return offset += _this.bindAttribute(attr, program, offset);
        });
        gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
      } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, program.constantBuffer);
        offset = 0;
        this.CONSTANT_ATTRIBUTES.forEach(function(attr) {
          return offset += _this.bindAttribute(attr, program, offset, false);
        });
        gl.bufferData(gl.ARRAY_BUFFER, this.constantArray, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, program.buffer);
        offset = 0;
        this.ATTRIBUTES.forEach(function(attr) {
          return offset += _this.bindAttribute(attr, program, offset, true);
        });
        gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
  }, {
    key: "unbindProgram",
    value: function unbindProgram(program) {
      var _this2 = this;
      if (!this.isInstanced) {
        this.ATTRIBUTES.forEach(function(attr) {
          return _this2.unbindAttribute(attr, program);
        });
      } else {
        this.CONSTANT_ATTRIBUTES.forEach(function(attr) {
          return _this2.unbindAttribute(attr, program, false);
        });
        this.ATTRIBUTES.forEach(function(attr) {
          return _this2.unbindAttribute(attr, program, true);
        });
      }
    }
  }, {
    key: "bindAttribute",
    value: function bindAttribute(attr, program, offset, setDivisor) {
      var sizeFactor = SIZE_FACTOR_PER_ATTRIBUTE_TYPE[attr.type];
      if (typeof sizeFactor !== "number") throw new Error('Program.bind: yet unsupported attribute type "'.concat(attr.type, '"'));
      var location = program.attributeLocations[attr.name];
      var gl = program.gl;
      if (location !== -1) {
        gl.enableVertexAttribArray(location);
        var stride = !this.isInstanced ? this.ATTRIBUTES_ITEMS_COUNT * Float32Array.BYTES_PER_ELEMENT : (setDivisor ? this.ATTRIBUTES_ITEMS_COUNT : getAttributesItemsCount(this.CONSTANT_ATTRIBUTES)) * Float32Array.BYTES_PER_ELEMENT;
        gl.vertexAttribPointer(location, attr.size, attr.type, attr.normalized || false, stride, offset);
        if (this.isInstanced && setDivisor) {
          if (gl instanceof WebGL2RenderingContext) {
            gl.vertexAttribDivisor(location, 1);
          } else {
            var ext = gl.getExtension("ANGLE_instanced_arrays");
            if (ext) ext.vertexAttribDivisorANGLE(location, 1);
          }
        }
      }
      return attr.size * sizeFactor;
    }
  }, {
    key: "unbindAttribute",
    value: function unbindAttribute(attr, program, unsetDivisor) {
      var location = program.attributeLocations[attr.name];
      var gl = program.gl;
      if (location !== -1) {
        gl.disableVertexAttribArray(location);
        if (this.isInstanced && unsetDivisor) {
          if (gl instanceof WebGL2RenderingContext) {
            gl.vertexAttribDivisor(location, 0);
          } else {
            var ext = gl.getExtension("ANGLE_instanced_arrays");
            if (ext) ext.vertexAttribDivisorANGLE(location, 0);
          }
        }
      }
    }
  }, {
    key: "reallocate",
    value: function reallocate(capacity) {
      if (capacity === this.capacity) return;
      this.capacity = capacity;
      this.verticesCount = this.VERTICES * capacity;
      this.array = new Float32Array(!this.isInstanced ? this.verticesCount * this.ATTRIBUTES_ITEMS_COUNT : this.capacity * this.ATTRIBUTES_ITEMS_COUNT);
    }
  }, {
    key: "hasNothingToRender",
    value: function hasNothingToRender() {
      return this.verticesCount === 0;
    }
  }, {
    key: "renderProgram",
    value: function renderProgram(params, programInfo) {
      var gl = programInfo.gl, program = programInfo.program;
      gl.enable(gl.BLEND);
      gl.useProgram(program);
      this.setUniforms(params, programInfo);
      this.drawWebGL(this.METHOD, programInfo);
    }
  }, {
    key: "render",
    value: function render(params) {
      if (this.hasNothingToRender()) return;
      if (this.pickProgram) {
        this.pickProgram.gl.viewport(0, 0, params.width * params.pixelRatio / params.downSizingRatio, params.height * params.pixelRatio / params.downSizingRatio);
        this.bindProgram(this.pickProgram);
        this.renderProgram(_objectSpread2(_objectSpread2({}, params), {}, {
          pixelRatio: params.pixelRatio / params.downSizingRatio
        }), this.pickProgram);
        this.unbindProgram(this.pickProgram);
      }
      this.normalProgram.gl.viewport(0, 0, params.width * params.pixelRatio, params.height * params.pixelRatio);
      this.bindProgram(this.normalProgram);
      this.renderProgram(params, this.normalProgram);
      this.unbindProgram(this.normalProgram);
    }
  }, {
    key: "drawWebGL",
    value: function drawWebGL(method, _ref) {
      var gl = _ref.gl, frameBuffer = _ref.frameBuffer;
      gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
      if (!this.isInstanced) {
        gl.drawArrays(method, 0, this.verticesCount);
      } else {
        if (gl instanceof WebGL2RenderingContext) {
          gl.drawArraysInstanced(method, 0, this.VERTICES, this.capacity);
        } else {
          var ext = gl.getExtension("ANGLE_instanced_arrays");
          if (ext) ext.drawArraysInstancedANGLE(method, 0, this.VERTICES, this.capacity);
        }
      }
    }
  }]);
})();
var NodeProgram = /* @__PURE__ */ (function(_ref) {
  function NodeProgram2() {
    _classCallCheck(this, NodeProgram2);
    return _callSuper(this, NodeProgram2, arguments);
  }
  _inherits(NodeProgram2, _ref);
  return _createClass(NodeProgram2, [{
    key: "kill",
    value: function kill() {
      _superPropGet(NodeProgram2, "kill", this, 3)([]);
    }
  }, {
    key: "process",
    value: function process(nodeIndex, offset, data) {
      var i = offset * this.STRIDE;
      if (data.hidden) {
        for (var l = i + this.STRIDE; i < l; i++) {
          this.array[i] = 0;
        }
        return;
      }
      return this.processVisibleItem(indexToColor(nodeIndex), i, data);
    }
  }]);
})(Program);
var EdgeProgram = /* @__PURE__ */ (function(_ref) {
  function EdgeProgram2() {
    var _this;
    _classCallCheck(this, EdgeProgram2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, EdgeProgram2, [].concat(args));
    _defineProperty(_this, "drawLabel", void 0);
    return _this;
  }
  _inherits(EdgeProgram2, _ref);
  return _createClass(EdgeProgram2, [{
    key: "kill",
    value: function kill() {
      _superPropGet(EdgeProgram2, "kill", this, 3)([]);
    }
  }, {
    key: "process",
    value: function process(edgeIndex, offset, sourceData, targetData, data) {
      var i = offset * this.STRIDE;
      if (data.hidden || sourceData.hidden || targetData.hidden) {
        for (var l = i + this.STRIDE; i < l; i++) {
          this.array[i] = 0;
        }
        return;
      }
      return this.processVisibleItem(indexToColor(edgeIndex), i, sourceData, targetData, data);
    }
  }]);
})(Program);
function createEdgeCompoundProgram(programClasses, drawLabel) {
  return /* @__PURE__ */ (function() {
    function EdgeCompoundProgram(gl, pickingBuffer, renderer) {
      _classCallCheck(this, EdgeCompoundProgram);
      _defineProperty(this, "drawLabel", drawLabel);
      this.programs = programClasses.map(function(Program2) {
        return new Program2(gl, pickingBuffer, renderer);
      });
    }
    return _createClass(EdgeCompoundProgram, [{
      key: "reallocate",
      value: function reallocate(capacity) {
        this.programs.forEach(function(program) {
          return program.reallocate(capacity);
        });
      }
    }, {
      key: "process",
      value: function process(edgeIndex, offset, sourceData, targetData, data) {
        this.programs.forEach(function(program) {
          return program.process(edgeIndex, offset, sourceData, targetData, data);
        });
      }
    }, {
      key: "render",
      value: function render(params) {
        this.programs.forEach(function(program) {
          return program.render(params);
        });
      }
    }, {
      key: "kill",
      value: function kill() {
        this.programs.forEach(function(program) {
          return program.kill();
        });
      }
    }]);
  })();
}
function drawStraightEdgeLabel(context, edgeData, sourceData, targetData, settings) {
  var size = settings.edgeLabelSize, font = settings.edgeLabelFont, weight = settings.edgeLabelWeight, color = settings.edgeLabelColor.attribute ? edgeData[settings.edgeLabelColor.attribute] || settings.edgeLabelColor.color || "#000" : settings.edgeLabelColor.color;
  var label = edgeData.label;
  if (!label) return;
  context.fillStyle = color;
  context.font = "".concat(weight, " ").concat(size, "px ").concat(font);
  var sSize = sourceData.size;
  var tSize = targetData.size;
  var sx = sourceData.x;
  var sy = sourceData.y;
  var tx = targetData.x;
  var ty = targetData.y;
  var cx = (sx + tx) / 2;
  var cy = (sy + ty) / 2;
  var dx = tx - sx;
  var dy = ty - sy;
  var d = Math.sqrt(dx * dx + dy * dy);
  if (d < sSize + tSize) return;
  sx += dx * sSize / d;
  sy += dy * sSize / d;
  tx -= dx * tSize / d;
  ty -= dy * tSize / d;
  cx = (sx + tx) / 2;
  cy = (sy + ty) / 2;
  dx = tx - sx;
  dy = ty - sy;
  d = Math.sqrt(dx * dx + dy * dy);
  var textLength = context.measureText(label).width;
  if (textLength > d) {
    var ellipsis = "\u2026";
    label = label + ellipsis;
    textLength = context.measureText(label).width;
    while (textLength > d && label.length > 1) {
      label = label.slice(0, -2) + ellipsis;
      textLength = context.measureText(label).width;
    }
    if (label.length < 4) return;
  }
  var angle;
  if (dx > 0) {
    if (dy > 0) angle = Math.acos(dx / d);
    else angle = Math.asin(dy / d);
  } else {
    if (dy > 0) angle = Math.acos(dx / d) + Math.PI;
    else angle = Math.asin(dx / d) + Math.PI / 2;
  }
  context.save();
  context.translate(cx, cy);
  context.rotate(angle);
  context.fillText(label, -textLength / 2, edgeData.size / 2 + size);
  context.restore();
}
function drawDiscNodeLabel(context, data, settings) {
  if (!data.label) return;
  var size = settings.labelSize, font = settings.labelFont, weight = settings.labelWeight, color = settings.labelColor.attribute ? data[settings.labelColor.attribute] || settings.labelColor.color || "#000" : settings.labelColor.color;
  context.fillStyle = color;
  context.font = "".concat(weight, " ").concat(size, "px ").concat(font);
  context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
}
function drawDiscNodeHover(context, data, settings) {
  var size = settings.labelSize, font = settings.labelFont, weight = settings.labelWeight;
  context.font = "".concat(weight, " ").concat(size, "px ").concat(font);
  context.fillStyle = "#FFF";
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 8;
  context.shadowColor = "#000";
  var PADDING = 2;
  if (typeof data.label === "string") {
    var textWidth = context.measureText(data.label).width, boxWidth = Math.round(textWidth + 5), boxHeight = Math.round(size + 2 * PADDING), radius = Math.max(data.size, size / 2) + PADDING;
    var angleRadian = Math.asin(boxHeight / 2 / radius);
    var xDeltaCoord = Math.sqrt(Math.abs(Math.pow(radius, 2) - Math.pow(boxHeight / 2, 2)));
    context.beginPath();
    context.moveTo(data.x + xDeltaCoord, data.y + boxHeight / 2);
    context.lineTo(data.x + radius + boxWidth, data.y + boxHeight / 2);
    context.lineTo(data.x + radius + boxWidth, data.y - boxHeight / 2);
    context.lineTo(data.x + xDeltaCoord, data.y - boxHeight / 2);
    context.arc(data.x, data.y, radius, angleRadian, -angleRadian);
    context.closePath();
    context.fill();
  } else {
    context.beginPath();
    context.arc(data.x, data.y, data.size + PADDING, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  }
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 0;
  drawDiscNodeLabel(context, data, settings);
}
var SHADER_SOURCE$6 = (
  /*glsl*/
  "\nprecision highp float;\n\nvarying vec4 v_color;\nvarying vec2 v_diffVector;\nvarying float v_radius;\n\nuniform float u_correctionRatio;\n\nconst vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);\n\nvoid main(void) {\n  float border = u_correctionRatio * 2.0;\n  float dist = length(v_diffVector) - v_radius + border;\n\n  // No antialiasing for picking mode:\n  #ifdef PICKING_MODE\n  if (dist > border)\n    gl_FragColor = transparent;\n  else\n    gl_FragColor = v_color;\n\n  #else\n  float t = 0.0;\n  if (dist > border)\n    t = 1.0;\n  else if (dist > 0.0)\n    t = dist / border;\n\n  gl_FragColor = mix(v_color, transparent, t);\n  #endif\n}\n"
);
var FRAGMENT_SHADER_SOURCE$2 = SHADER_SOURCE$6;
var SHADER_SOURCE$5 = (
  /*glsl*/
  "\nattribute vec4 a_id;\nattribute vec4 a_color;\nattribute vec2 a_position;\nattribute float a_size;\nattribute float a_angle;\n\nuniform mat3 u_matrix;\nuniform float u_sizeRatio;\nuniform float u_correctionRatio;\n\nvarying vec4 v_color;\nvarying vec2 v_diffVector;\nvarying float v_radius;\nvarying float v_border;\n\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n  float size = a_size * u_correctionRatio / u_sizeRatio * 4.0;\n  vec2 diffVector = size * vec2(cos(a_angle), sin(a_angle));\n  vec2 position = a_position + diffVector;\n  gl_Position = vec4(\n    (u_matrix * vec3(position, 1)).xy,\n    0,\n    1\n  );\n\n  v_diffVector = diffVector;\n  v_radius = size / 2.0;\n\n  #ifdef PICKING_MODE\n  // For picking mode, we use the ID as the color:\n  v_color = a_id;\n  #else\n  // For normal mode, we use the color:\n  v_color = a_color;\n  #endif\n\n  v_color.a *= bias;\n}\n"
);
var VERTEX_SHADER_SOURCE$3 = SHADER_SOURCE$5;
var _WebGLRenderingContex$3 = WebGLRenderingContext;
var UNSIGNED_BYTE$3 = _WebGLRenderingContex$3.UNSIGNED_BYTE;
var FLOAT$3 = _WebGLRenderingContex$3.FLOAT;
var UNIFORMS$3 = ["u_sizeRatio", "u_correctionRatio", "u_matrix"];
var NodeCircleProgram = /* @__PURE__ */ (function(_NodeProgram) {
  function NodeCircleProgram2() {
    _classCallCheck(this, NodeCircleProgram2);
    return _callSuper(this, NodeCircleProgram2, arguments);
  }
  _inherits(NodeCircleProgram2, _NodeProgram);
  return _createClass(NodeCircleProgram2, [{
    key: "getDefinition",
    value: function getDefinition() {
      return {
        VERTICES: 3,
        VERTEX_SHADER_SOURCE: VERTEX_SHADER_SOURCE$3,
        FRAGMENT_SHADER_SOURCE: FRAGMENT_SHADER_SOURCE$2,
        METHOD: WebGLRenderingContext.TRIANGLES,
        UNIFORMS: UNIFORMS$3,
        ATTRIBUTES: [{
          name: "a_position",
          size: 2,
          type: FLOAT$3
        }, {
          name: "a_size",
          size: 1,
          type: FLOAT$3
        }, {
          name: "a_color",
          size: 4,
          type: UNSIGNED_BYTE$3,
          normalized: true
        }, {
          name: "a_id",
          size: 4,
          type: UNSIGNED_BYTE$3,
          normalized: true
        }],
        CONSTANT_ATTRIBUTES: [{
          name: "a_angle",
          size: 1,
          type: FLOAT$3
        }],
        CONSTANT_DATA: [[NodeCircleProgram2.ANGLE_1], [NodeCircleProgram2.ANGLE_2], [NodeCircleProgram2.ANGLE_3]]
      };
    }
  }, {
    key: "processVisibleItem",
    value: function processVisibleItem(nodeIndex, startIndex, data) {
      var array = this.array;
      var color = floatColor(data.color);
      array[startIndex++] = data.x;
      array[startIndex++] = data.y;
      array[startIndex++] = data.size;
      array[startIndex++] = color;
      array[startIndex++] = nodeIndex;
    }
  }, {
    key: "setUniforms",
    value: function setUniforms(params, _ref) {
      var gl = _ref.gl, uniformLocations = _ref.uniformLocations;
      var u_sizeRatio = uniformLocations.u_sizeRatio, u_correctionRatio = uniformLocations.u_correctionRatio, u_matrix = uniformLocations.u_matrix;
      gl.uniform1f(u_correctionRatio, params.correctionRatio);
      gl.uniform1f(u_sizeRatio, params.sizeRatio);
      gl.uniformMatrix3fv(u_matrix, false, params.matrix);
    }
  }]);
})(NodeProgram);
_defineProperty(NodeCircleProgram, "ANGLE_1", 0);
_defineProperty(NodeCircleProgram, "ANGLE_2", 2 * Math.PI / 3);
_defineProperty(NodeCircleProgram, "ANGLE_3", 4 * Math.PI / 3);
var SHADER_SOURCE$4 = (
  /*glsl*/
  "\nprecision mediump float;\n\nvarying vec4 v_color;\n\nvoid main(void) {\n  gl_FragColor = v_color;\n}\n"
);
var FRAGMENT_SHADER_SOURCE$1 = SHADER_SOURCE$4;
var SHADER_SOURCE$3 = (
  /*glsl*/
  "\nattribute vec2 a_position;\nattribute vec2 a_normal;\nattribute float a_radius;\nattribute vec3 a_barycentric;\n\n#ifdef PICKING_MODE\nattribute vec4 a_id;\n#else\nattribute vec4 a_color;\n#endif\n\nuniform mat3 u_matrix;\nuniform float u_sizeRatio;\nuniform float u_correctionRatio;\nuniform float u_minEdgeThickness;\nuniform float u_lengthToThicknessRatio;\nuniform float u_widenessToThicknessRatio;\n\nvarying vec4 v_color;\n\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n  float minThickness = u_minEdgeThickness;\n\n  float normalLength = length(a_normal);\n  vec2 unitNormal = a_normal / normalLength;\n\n  // These first computations are taken from edge.vert.glsl and\n  // edge.clamped.vert.glsl. Please read it to get better comments on what's\n  // happening:\n  float pixelsThickness = max(normalLength / u_sizeRatio, minThickness);\n  float webGLThickness = pixelsThickness * u_correctionRatio;\n  float webGLNodeRadius = a_radius * 2.0 * u_correctionRatio / u_sizeRatio;\n  float webGLArrowHeadLength = webGLThickness * u_lengthToThicknessRatio * 2.0;\n  float webGLArrowHeadThickness = webGLThickness * u_widenessToThicknessRatio;\n\n  float da = a_barycentric.x;\n  float db = a_barycentric.y;\n  float dc = a_barycentric.z;\n\n  vec2 delta = vec2(\n      da * (webGLNodeRadius * unitNormal.y)\n    + db * ((webGLNodeRadius + webGLArrowHeadLength) * unitNormal.y + webGLArrowHeadThickness * unitNormal.x)\n    + dc * ((webGLNodeRadius + webGLArrowHeadLength) * unitNormal.y - webGLArrowHeadThickness * unitNormal.x),\n\n      da * (-webGLNodeRadius * unitNormal.x)\n    + db * (-(webGLNodeRadius + webGLArrowHeadLength) * unitNormal.x + webGLArrowHeadThickness * unitNormal.y)\n    + dc * (-(webGLNodeRadius + webGLArrowHeadLength) * unitNormal.x - webGLArrowHeadThickness * unitNormal.y)\n  );\n\n  vec2 position = (u_matrix * vec3(a_position + delta, 1)).xy;\n\n  gl_Position = vec4(position, 0, 1);\n\n  #ifdef PICKING_MODE\n  // For picking mode, we use the ID as the color:\n  v_color = a_id;\n  #else\n  // For normal mode, we use the color:\n  v_color = a_color;\n  #endif\n\n  v_color.a *= bias;\n}\n"
);
var VERTEX_SHADER_SOURCE$2 = SHADER_SOURCE$3;
var _WebGLRenderingContex$2 = WebGLRenderingContext;
var UNSIGNED_BYTE$2 = _WebGLRenderingContex$2.UNSIGNED_BYTE;
var FLOAT$2 = _WebGLRenderingContex$2.FLOAT;
var UNIFORMS$2 = ["u_matrix", "u_sizeRatio", "u_correctionRatio", "u_minEdgeThickness", "u_lengthToThicknessRatio", "u_widenessToThicknessRatio"];
var DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS = {
  extremity: "target",
  lengthToThicknessRatio: 2.5,
  widenessToThicknessRatio: 2
};
function createEdgeArrowHeadProgram(inputOptions) {
  var options = _objectSpread2(_objectSpread2({}, DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS), inputOptions || {});
  return /* @__PURE__ */ (function(_EdgeProgram) {
    function EdgeArrowHeadProgram2() {
      _classCallCheck(this, EdgeArrowHeadProgram2);
      return _callSuper(this, EdgeArrowHeadProgram2, arguments);
    }
    _inherits(EdgeArrowHeadProgram2, _EdgeProgram);
    return _createClass(EdgeArrowHeadProgram2, [{
      key: "getDefinition",
      value: function getDefinition() {
        return {
          VERTICES: 3,
          VERTEX_SHADER_SOURCE: VERTEX_SHADER_SOURCE$2,
          FRAGMENT_SHADER_SOURCE: FRAGMENT_SHADER_SOURCE$1,
          METHOD: WebGLRenderingContext.TRIANGLES,
          UNIFORMS: UNIFORMS$2,
          ATTRIBUTES: [{
            name: "a_position",
            size: 2,
            type: FLOAT$2
          }, {
            name: "a_normal",
            size: 2,
            type: FLOAT$2
          }, {
            name: "a_radius",
            size: 1,
            type: FLOAT$2
          }, {
            name: "a_color",
            size: 4,
            type: UNSIGNED_BYTE$2,
            normalized: true
          }, {
            name: "a_id",
            size: 4,
            type: UNSIGNED_BYTE$2,
            normalized: true
          }],
          CONSTANT_ATTRIBUTES: [{
            name: "a_barycentric",
            size: 3,
            type: FLOAT$2
          }],
          CONSTANT_DATA: [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
        };
      }
    }, {
      key: "processVisibleItem",
      value: function processVisibleItem(edgeIndex, startIndex, sourceData, targetData, data) {
        if (options.extremity === "source") {
          var _ref = [targetData, sourceData];
          sourceData = _ref[0];
          targetData = _ref[1];
        }
        var thickness = data.size || 1;
        var radius = targetData.size || 1;
        var x1 = sourceData.x;
        var y1 = sourceData.y;
        var x2 = targetData.x;
        var y2 = targetData.y;
        var color = floatColor(data.color);
        var dx = x2 - x1;
        var dy = y2 - y1;
        var len = dx * dx + dy * dy;
        var n1 = 0;
        var n2 = 0;
        if (len) {
          len = 1 / Math.sqrt(len);
          n1 = -dy * len * thickness;
          n2 = dx * len * thickness;
        }
        var array = this.array;
        array[startIndex++] = x2;
        array[startIndex++] = y2;
        array[startIndex++] = -n1;
        array[startIndex++] = -n2;
        array[startIndex++] = radius;
        array[startIndex++] = color;
        array[startIndex++] = edgeIndex;
      }
    }, {
      key: "setUniforms",
      value: function setUniforms(params, _ref2) {
        var gl = _ref2.gl, uniformLocations = _ref2.uniformLocations;
        var u_matrix = uniformLocations.u_matrix, u_sizeRatio = uniformLocations.u_sizeRatio, u_correctionRatio = uniformLocations.u_correctionRatio, u_minEdgeThickness = uniformLocations.u_minEdgeThickness, u_lengthToThicknessRatio = uniformLocations.u_lengthToThicknessRatio, u_widenessToThicknessRatio = uniformLocations.u_widenessToThicknessRatio;
        gl.uniformMatrix3fv(u_matrix, false, params.matrix);
        gl.uniform1f(u_sizeRatio, params.sizeRatio);
        gl.uniform1f(u_correctionRatio, params.correctionRatio);
        gl.uniform1f(u_minEdgeThickness, params.minEdgeThickness);
        gl.uniform1f(u_lengthToThicknessRatio, options.lengthToThicknessRatio);
        gl.uniform1f(u_widenessToThicknessRatio, options.widenessToThicknessRatio);
      }
    }]);
  })(EdgeProgram);
}
var EdgeArrowHeadProgram = createEdgeArrowHeadProgram();
var SHADER_SOURCE$2 = (
  /*glsl*/
  "\nprecision mediump float;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\nvarying float v_feather;\n\nconst vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);\n\nvoid main(void) {\n  // We only handle antialiasing for normal mode:\n  #ifdef PICKING_MODE\n  gl_FragColor = v_color;\n  #else\n  float dist = length(v_normal) * v_thickness;\n\n  float t = smoothstep(\n    v_thickness - v_feather,\n    v_thickness,\n    dist\n  );\n\n  gl_FragColor = mix(v_color, transparent, t);\n  #endif\n}\n"
);
var FRAGMENT_SHADER_SOURCE = SHADER_SOURCE$2;
var SHADER_SOURCE$1 = (
  /*glsl*/
  "\nattribute vec4 a_id;\nattribute vec4 a_color;\nattribute vec2 a_normal;\nattribute float a_normalCoef;\nattribute vec2 a_positionStart;\nattribute vec2 a_positionEnd;\nattribute float a_positionCoef;\nattribute float a_radius;\nattribute float a_radiusCoef;\n\nuniform mat3 u_matrix;\nuniform float u_zoomRatio;\nuniform float u_sizeRatio;\nuniform float u_pixelRatio;\nuniform float u_correctionRatio;\nuniform float u_minEdgeThickness;\nuniform float u_lengthToThicknessRatio;\nuniform float u_feather;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\nvarying float v_feather;\n\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n  float minThickness = u_minEdgeThickness;\n\n  float radius = a_radius * a_radiusCoef;\n  vec2 normal = a_normal * a_normalCoef;\n  vec2 position = a_positionStart * (1.0 - a_positionCoef) + a_positionEnd * a_positionCoef;\n\n  float normalLength = length(normal);\n  vec2 unitNormal = normal / normalLength;\n\n  // These first computations are taken from edge.vert.glsl. Please read it to\n  // get better comments on what's happening:\n  float pixelsThickness = max(normalLength, minThickness * u_sizeRatio);\n  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;\n\n  // Here, we move the point to leave space for the arrow head:\n  float direction = sign(radius);\n  float webGLNodeRadius = direction * radius * 2.0 * u_correctionRatio / u_sizeRatio;\n  float webGLArrowHeadLength = webGLThickness * u_lengthToThicknessRatio * 2.0;\n\n  vec2 compensationVector = vec2(-direction * unitNormal.y, direction * unitNormal.x) * (webGLNodeRadius + webGLArrowHeadLength);\n\n  // Here is the proper position of the vertex\n  gl_Position = vec4((u_matrix * vec3(position + unitNormal * webGLThickness + compensationVector, 1)).xy, 0, 1);\n\n  v_thickness = webGLThickness / u_zoomRatio;\n\n  v_normal = unitNormal;\n\n  v_feather = u_feather * u_correctionRatio / u_zoomRatio / u_pixelRatio * 2.0;\n\n  #ifdef PICKING_MODE\n  // For picking mode, we use the ID as the color:\n  v_color = a_id;\n  #else\n  // For normal mode, we use the color:\n  v_color = a_color;\n  #endif\n\n  v_color.a *= bias;\n}\n"
);
var VERTEX_SHADER_SOURCE$1 = SHADER_SOURCE$1;
var _WebGLRenderingContex$1 = WebGLRenderingContext;
var UNSIGNED_BYTE$1 = _WebGLRenderingContex$1.UNSIGNED_BYTE;
var FLOAT$1 = _WebGLRenderingContex$1.FLOAT;
var UNIFORMS$1 = ["u_matrix", "u_zoomRatio", "u_sizeRatio", "u_correctionRatio", "u_pixelRatio", "u_feather", "u_minEdgeThickness", "u_lengthToThicknessRatio"];
var DEFAULT_EDGE_CLAMPED_PROGRAM_OPTIONS = {
  lengthToThicknessRatio: DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS.lengthToThicknessRatio
};
function createEdgeClampedProgram(inputOptions) {
  var options = _objectSpread2(_objectSpread2({}, DEFAULT_EDGE_CLAMPED_PROGRAM_OPTIONS), inputOptions || {});
  return /* @__PURE__ */ (function(_EdgeProgram) {
    function EdgeClampedProgram2() {
      _classCallCheck(this, EdgeClampedProgram2);
      return _callSuper(this, EdgeClampedProgram2, arguments);
    }
    _inherits(EdgeClampedProgram2, _EdgeProgram);
    return _createClass(EdgeClampedProgram2, [{
      key: "getDefinition",
      value: function getDefinition() {
        return {
          VERTICES: 6,
          VERTEX_SHADER_SOURCE: VERTEX_SHADER_SOURCE$1,
          FRAGMENT_SHADER_SOURCE,
          METHOD: WebGLRenderingContext.TRIANGLES,
          UNIFORMS: UNIFORMS$1,
          ATTRIBUTES: [{
            name: "a_positionStart",
            size: 2,
            type: FLOAT$1
          }, {
            name: "a_positionEnd",
            size: 2,
            type: FLOAT$1
          }, {
            name: "a_normal",
            size: 2,
            type: FLOAT$1
          }, {
            name: "a_color",
            size: 4,
            type: UNSIGNED_BYTE$1,
            normalized: true
          }, {
            name: "a_id",
            size: 4,
            type: UNSIGNED_BYTE$1,
            normalized: true
          }, {
            name: "a_radius",
            size: 1,
            type: FLOAT$1
          }],
          CONSTANT_ATTRIBUTES: [
            // If 0, then position will be a_positionStart
            // If 1, then position will be a_positionEnd
            {
              name: "a_positionCoef",
              size: 1,
              type: FLOAT$1
            },
            {
              name: "a_normalCoef",
              size: 1,
              type: FLOAT$1
            },
            {
              name: "a_radiusCoef",
              size: 1,
              type: FLOAT$1
            }
          ],
          CONSTANT_DATA: [[0, 1, 0], [0, -1, 0], [1, 1, 1], [1, 1, 1], [0, -1, 0], [1, -1, -1]]
        };
      }
    }, {
      key: "processVisibleItem",
      value: function processVisibleItem(edgeIndex, startIndex, sourceData, targetData, data) {
        var thickness = data.size || 1;
        var x1 = sourceData.x;
        var y1 = sourceData.y;
        var x2 = targetData.x;
        var y2 = targetData.y;
        var color = floatColor(data.color);
        var dx = x2 - x1;
        var dy = y2 - y1;
        var radius = targetData.size || 1;
        var len = dx * dx + dy * dy;
        var n1 = 0;
        var n2 = 0;
        if (len) {
          len = 1 / Math.sqrt(len);
          n1 = -dy * len * thickness;
          n2 = dx * len * thickness;
        }
        var array = this.array;
        array[startIndex++] = x1;
        array[startIndex++] = y1;
        array[startIndex++] = x2;
        array[startIndex++] = y2;
        array[startIndex++] = n1;
        array[startIndex++] = n2;
        array[startIndex++] = color;
        array[startIndex++] = edgeIndex;
        array[startIndex++] = radius;
      }
    }, {
      key: "setUniforms",
      value: function setUniforms(params, _ref) {
        var gl = _ref.gl, uniformLocations = _ref.uniformLocations;
        var u_matrix = uniformLocations.u_matrix, u_zoomRatio = uniformLocations.u_zoomRatio, u_feather = uniformLocations.u_feather, u_pixelRatio = uniformLocations.u_pixelRatio, u_correctionRatio = uniformLocations.u_correctionRatio, u_sizeRatio = uniformLocations.u_sizeRatio, u_minEdgeThickness = uniformLocations.u_minEdgeThickness, u_lengthToThicknessRatio = uniformLocations.u_lengthToThicknessRatio;
        gl.uniformMatrix3fv(u_matrix, false, params.matrix);
        gl.uniform1f(u_zoomRatio, params.zoomRatio);
        gl.uniform1f(u_sizeRatio, params.sizeRatio);
        gl.uniform1f(u_correctionRatio, params.correctionRatio);
        gl.uniform1f(u_pixelRatio, params.pixelRatio);
        gl.uniform1f(u_feather, params.antiAliasingFeather);
        gl.uniform1f(u_minEdgeThickness, params.minEdgeThickness);
        gl.uniform1f(u_lengthToThicknessRatio, options.lengthToThicknessRatio);
      }
    }]);
  })(EdgeProgram);
}
var EdgeClampedProgram = createEdgeClampedProgram();
function createEdgeArrowProgram(inputOptions) {
  return createEdgeCompoundProgram([createEdgeClampedProgram(inputOptions), createEdgeArrowHeadProgram(inputOptions)]);
}
var EdgeArrowProgram = createEdgeArrowProgram();
var EdgeArrowProgram$1 = EdgeArrowProgram;
var SHADER_SOURCE = (
  /*glsl*/
  `
attribute vec4 a_id;
attribute vec4 a_color;
attribute vec2 a_normal;
attribute float a_normalCoef;
attribute vec2 a_positionStart;
attribute vec2 a_positionEnd;
attribute float a_positionCoef;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_zoomRatio;
uniform float u_pixelRatio;
uniform float u_correctionRatio;
uniform float u_minEdgeThickness;
uniform float u_feather;

varying vec4 v_color;
varying vec2 v_normal;
varying float v_thickness;
varying float v_feather;

const float bias = 255.0 / 254.0;

void main() {
  float minThickness = u_minEdgeThickness;

  vec2 normal = a_normal * a_normalCoef;
  vec2 position = a_positionStart * (1.0 - a_positionCoef) + a_positionEnd * a_positionCoef;

  float normalLength = length(normal);
  vec2 unitNormal = normal / normalLength;

  // We require edges to be at least "minThickness" pixels thick *on screen*
  // (so we need to compensate the size ratio):
  float pixelsThickness = max(normalLength, minThickness * u_sizeRatio);

  // Then, we need to retrieve the normalized thickness of the edge in the WebGL
  // referential (in a ([0, 1], [0, 1]) space), using our "magic" correction
  // ratio:
  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;

  // Here is the proper position of the vertex
  gl_Position = vec4((u_matrix * vec3(position + unitNormal * webGLThickness, 1)).xy, 0, 1);

  // For the fragment shader though, we need a thickness that takes the "magic"
  // correction ratio into account (as in webGLThickness), but so that the
  // antialiasing effect does not depend on the zoom level. So here's yet
  // another thickness version:
  v_thickness = webGLThickness / u_zoomRatio;

  v_normal = unitNormal;

  v_feather = u_feather * u_correctionRatio / u_zoomRatio / u_pixelRatio * 2.0;

  #ifdef PICKING_MODE
  // For picking mode, we use the ID as the color:
  v_color = a_id;
  #else
  // For normal mode, we use the color:
  v_color = a_color;
  #endif

  v_color.a *= bias;
}
`
);
var VERTEX_SHADER_SOURCE = SHADER_SOURCE;
var _WebGLRenderingContex = WebGLRenderingContext;
var UNSIGNED_BYTE = _WebGLRenderingContex.UNSIGNED_BYTE;
var FLOAT = _WebGLRenderingContex.FLOAT;
var UNIFORMS = ["u_matrix", "u_zoomRatio", "u_sizeRatio", "u_correctionRatio", "u_pixelRatio", "u_feather", "u_minEdgeThickness"];
var EdgeRectangleProgram = /* @__PURE__ */ (function(_EdgeProgram) {
  function EdgeRectangleProgram2() {
    _classCallCheck(this, EdgeRectangleProgram2);
    return _callSuper(this, EdgeRectangleProgram2, arguments);
  }
  _inherits(EdgeRectangleProgram2, _EdgeProgram);
  return _createClass(EdgeRectangleProgram2, [{
    key: "getDefinition",
    value: function getDefinition() {
      return {
        VERTICES: 6,
        VERTEX_SHADER_SOURCE,
        FRAGMENT_SHADER_SOURCE,
        METHOD: WebGLRenderingContext.TRIANGLES,
        UNIFORMS,
        ATTRIBUTES: [{
          name: "a_positionStart",
          size: 2,
          type: FLOAT
        }, {
          name: "a_positionEnd",
          size: 2,
          type: FLOAT
        }, {
          name: "a_normal",
          size: 2,
          type: FLOAT
        }, {
          name: "a_color",
          size: 4,
          type: UNSIGNED_BYTE,
          normalized: true
        }, {
          name: "a_id",
          size: 4,
          type: UNSIGNED_BYTE,
          normalized: true
        }],
        CONSTANT_ATTRIBUTES: [
          // If 0, then position will be a_positionStart
          // If 2, then position will be a_positionEnd
          {
            name: "a_positionCoef",
            size: 1,
            type: FLOAT
          },
          {
            name: "a_normalCoef",
            size: 1,
            type: FLOAT
          }
        ],
        CONSTANT_DATA: [[0, 1], [0, -1], [1, 1], [1, 1], [0, -1], [1, -1]]
      };
    }
  }, {
    key: "processVisibleItem",
    value: function processVisibleItem(edgeIndex, startIndex, sourceData, targetData, data) {
      var thickness = data.size || 1;
      var x1 = sourceData.x;
      var y1 = sourceData.y;
      var x2 = targetData.x;
      var y2 = targetData.y;
      var color = floatColor(data.color);
      var dx = x2 - x1;
      var dy = y2 - y1;
      var len = dx * dx + dy * dy;
      var n1 = 0;
      var n2 = 0;
      if (len) {
        len = 1 / Math.sqrt(len);
        n1 = -dy * len * thickness;
        n2 = dx * len * thickness;
      }
      var array = this.array;
      array[startIndex++] = x1;
      array[startIndex++] = y1;
      array[startIndex++] = x2;
      array[startIndex++] = y2;
      array[startIndex++] = n1;
      array[startIndex++] = n2;
      array[startIndex++] = color;
      array[startIndex++] = edgeIndex;
    }
  }, {
    key: "setUniforms",
    value: function setUniforms(params, _ref) {
      var gl = _ref.gl, uniformLocations = _ref.uniformLocations;
      var u_matrix = uniformLocations.u_matrix, u_zoomRatio = uniformLocations.u_zoomRatio, u_feather = uniformLocations.u_feather, u_pixelRatio = uniformLocations.u_pixelRatio, u_correctionRatio = uniformLocations.u_correctionRatio, u_sizeRatio = uniformLocations.u_sizeRatio, u_minEdgeThickness = uniformLocations.u_minEdgeThickness;
      gl.uniformMatrix3fv(u_matrix, false, params.matrix);
      gl.uniform1f(u_zoomRatio, params.zoomRatio);
      gl.uniform1f(u_sizeRatio, params.sizeRatio);
      gl.uniform1f(u_correctionRatio, params.correctionRatio);
      gl.uniform1f(u_pixelRatio, params.pixelRatio);
      gl.uniform1f(u_feather, params.antiAliasingFeather);
      gl.uniform1f(u_minEdgeThickness, params.minEdgeThickness);
    }
  }]);
})(EdgeProgram);

// node_modules/sigma/types/dist/sigma-types.esm.js
var import_events = __toESM(require_events());
var TypedEventEmitter = /* @__PURE__ */ (function(_ref) {
  function TypedEventEmitter2() {
    var _this;
    _classCallCheck(this, TypedEventEmitter2);
    _this = _callSuper(this, TypedEventEmitter2);
    _this.rawEmitter = _this;
    return _this;
  }
  _inherits(TypedEventEmitter2, _ref);
  return _createClass(TypedEventEmitter2);
})(import_events.EventEmitter);

// node_modules/sigma/dist/normalization-be445518.esm.js
var import_is_graph = __toESM(require_is_graph());
var linear = function linear2(k) {
  return k;
};
var quadraticIn = function quadraticIn2(k) {
  return k * k;
};
var quadraticOut = function quadraticOut2(k) {
  return k * (2 - k);
};
var quadraticInOut = function quadraticInOut2(k) {
  if ((k *= 2) < 1) return 0.5 * k * k;
  return -0.5 * (--k * (k - 2) - 1);
};
var cubicIn = function cubicIn2(k) {
  return k * k * k;
};
var cubicOut = function cubicOut2(k) {
  return --k * k * k + 1;
};
var cubicInOut = function cubicInOut2(k) {
  if ((k *= 2) < 1) return 0.5 * k * k * k;
  return 0.5 * ((k -= 2) * k * k + 2);
};
var easings = {
  linear,
  quadraticIn,
  quadraticOut,
  quadraticInOut,
  cubicIn,
  cubicOut,
  cubicInOut
};
var ANIMATE_DEFAULTS = {
  easing: "quadraticInOut",
  duration: 150
};
function identity() {
  return Float32Array.of(1, 0, 0, 0, 1, 0, 0, 0, 1);
}
function scale(m, x, y) {
  m[0] = x;
  m[4] = typeof y === "number" ? y : x;
  return m;
}
function rotate(m, r) {
  var s = Math.sin(r), c = Math.cos(r);
  m[0] = c;
  m[1] = s;
  m[3] = -s;
  m[4] = c;
  return m;
}
function translate(m, x, y) {
  m[6] = x;
  m[7] = y;
  return m;
}
function multiply(a, b) {
  var a00 = a[0], a01 = a[1], a02 = a[2];
  var a10 = a[3], a11 = a[4], a12 = a[5];
  var a20 = a[6], a21 = a[7], a22 = a[8];
  var b00 = b[0], b01 = b[1], b02 = b[2];
  var b10 = b[3], b11 = b[4], b12 = b[5];
  var b20 = b[6], b21 = b[7], b22 = b[8];
  a[0] = b00 * a00 + b01 * a10 + b02 * a20;
  a[1] = b00 * a01 + b01 * a11 + b02 * a21;
  a[2] = b00 * a02 + b01 * a12 + b02 * a22;
  a[3] = b10 * a00 + b11 * a10 + b12 * a20;
  a[4] = b10 * a01 + b11 * a11 + b12 * a21;
  a[5] = b10 * a02 + b11 * a12 + b12 * a22;
  a[6] = b20 * a00 + b21 * a10 + b22 * a20;
  a[7] = b20 * a01 + b21 * a11 + b22 * a21;
  a[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return a;
}
function multiplyVec2(a, b) {
  var z = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
  var a00 = a[0];
  var a01 = a[1];
  var a10 = a[3];
  var a11 = a[4];
  var a20 = a[6];
  var a21 = a[7];
  var b0 = b.x;
  var b1 = b.y;
  return {
    x: b0 * a00 + b1 * a10 + a20 * z,
    y: b0 * a01 + b1 * a11 + a21 * z
  };
}
function getCorrectionRatio(viewportDimensions, graphDimensions) {
  var viewportRatio = viewportDimensions.height / viewportDimensions.width;
  var graphRatio = graphDimensions.height / graphDimensions.width;
  if (viewportRatio < 1 && graphRatio > 1 || viewportRatio > 1 && graphRatio < 1) {
    return 1;
  }
  return Math.min(Math.max(graphRatio, 1 / graphRatio), Math.max(1 / viewportRatio, viewportRatio));
}
function matrixFromCamera(state, viewportDimensions, graphDimensions, padding, inverse) {
  var angle = state.angle, ratio = state.ratio, x = state.x, y = state.y;
  var width = viewportDimensions.width, height = viewportDimensions.height;
  var matrix = identity();
  var smallestDimension = Math.min(width, height) - 2 * padding;
  var correctionRatio = getCorrectionRatio(viewportDimensions, graphDimensions);
  if (!inverse) {
    multiply(matrix, scale(identity(), 2 * (smallestDimension / width) * correctionRatio, 2 * (smallestDimension / height) * correctionRatio));
    multiply(matrix, rotate(identity(), -angle));
    multiply(matrix, scale(identity(), 1 / ratio));
    multiply(matrix, translate(identity(), -x, -y));
  } else {
    multiply(matrix, translate(identity(), x, y));
    multiply(matrix, scale(identity(), ratio));
    multiply(matrix, rotate(identity(), angle));
    multiply(matrix, scale(identity(), width / smallestDimension / 2 / correctionRatio, height / smallestDimension / 2 / correctionRatio));
  }
  return matrix;
}
function getMatrixImpact(matrix, cameraState, viewportDimensions) {
  var _multiplyVec = multiplyVec2(matrix, {
    x: Math.cos(cameraState.angle),
    y: Math.sin(cameraState.angle)
  }, 0), x = _multiplyVec.x, y = _multiplyVec.y;
  return 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / viewportDimensions.width;
}
function graphExtent(graph) {
  if (!graph.order) return {
    x: [0, 1],
    y: [0, 1]
  };
  var xMin = Infinity;
  var xMax = -Infinity;
  var yMin = Infinity;
  var yMax = -Infinity;
  graph.forEachNode(function(_, attr) {
    var x = attr.x, y = attr.y;
    if (x < xMin) xMin = x;
    if (x > xMax) xMax = x;
    if (y < yMin) yMin = y;
    if (y > yMax) yMax = y;
  });
  return {
    x: [xMin, xMax],
    y: [yMin, yMax]
  };
}
function validateGraph(graph) {
  if (!(0, import_is_graph.default)(graph)) throw new Error("Sigma: invalid graph instance.");
  graph.forEachNode(function(key, attributes) {
    if (!Number.isFinite(attributes.x) || !Number.isFinite(attributes.y)) {
      throw new Error("Sigma: Coordinates of node ".concat(key, " are invalid. A node must have a numeric 'x' and 'y' attribute."));
    }
  });
}
function createElement(tag, style, attributes) {
  var element = document.createElement(tag);
  if (style) {
    for (var k in style) {
      element.style[k] = style[k];
    }
  }
  if (attributes) {
    for (var _k in attributes) {
      element.setAttribute(_k, attributes[_k]);
    }
  }
  return element;
}
function getPixelRatio() {
  if (typeof window.devicePixelRatio !== "undefined") return window.devicePixelRatio;
  return 1;
}
function zIndexOrdering(_extent, getter, elements) {
  return elements.sort(function(a, b) {
    var zA = getter(a) || 0, zB = getter(b) || 0;
    if (zA < zB) return -1;
    if (zA > zB) return 1;
    return 0;
  });
}
function createNormalizationFunction(extent) {
  var _extent$x = _slicedToArray(extent.x, 2), minX = _extent$x[0], maxX = _extent$x[1], _extent$y = _slicedToArray(extent.y, 2), minY = _extent$y[0], maxY = _extent$y[1];
  var ratio = Math.max(maxX - minX, maxY - minY), dX = (maxX + minX) / 2, dY = (maxY + minY) / 2;
  if (ratio === 0 || Math.abs(ratio) === Infinity || isNaN(ratio)) ratio = 1;
  if (isNaN(dX)) dX = 0;
  if (isNaN(dY)) dY = 0;
  var fn = function fn2(data) {
    return {
      x: 0.5 + (data.x - dX) / ratio,
      y: 0.5 + (data.y - dY) / ratio
    };
  };
  fn.applyTo = function(data) {
    data.x = 0.5 + (data.x - dX) / ratio;
    data.y = 0.5 + (data.y - dY) / ratio;
  };
  fn.inverse = function(data) {
    return {
      x: dX + ratio * (data.x - 0.5),
      y: dY + ratio * (data.y - 0.5)
    };
  };
  fn.ratio = ratio;
  return fn;
}

// node_modules/sigma/dist/data-11df7124.esm.js
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function extend(array, values) {
  var l2 = values.size;
  if (l2 === 0) return;
  var l1 = array.length;
  array.length += l2;
  var i = 0;
  values.forEach(function(value) {
    array[l1 + i] = value;
    i++;
  });
}
function assign(target) {
  target = target || {};
  for (var i = 0, l = arguments.length <= 1 ? 0 : arguments.length - 1; i < l; i++) {
    var o = i + 1 < 1 || arguments.length <= i + 1 ? void 0 : arguments[i + 1];
    if (!o) continue;
    Object.assign(target, o);
  }
  return target;
}

// node_modules/sigma/settings/dist/sigma-settings.esm.js
var DEFAULT_SETTINGS = {
  // Performance
  hideEdgesOnMove: false,
  hideLabelsOnMove: false,
  renderLabels: true,
  renderEdgeLabels: false,
  enableEdgeEvents: false,
  // Component rendering
  defaultNodeColor: "#999",
  defaultNodeType: "circle",
  defaultEdgeColor: "#ccc",
  defaultEdgeType: "line",
  labelFont: "Arial",
  labelSize: 14,
  labelWeight: "normal",
  labelColor: {
    color: "#000"
  },
  edgeLabelFont: "Arial",
  edgeLabelSize: 14,
  edgeLabelWeight: "normal",
  edgeLabelColor: {
    attribute: "color"
  },
  stagePadding: 30,
  defaultDrawEdgeLabel: drawStraightEdgeLabel,
  defaultDrawNodeLabel: drawDiscNodeLabel,
  defaultDrawNodeHover: drawDiscNodeHover,
  minEdgeThickness: 1.7,
  antiAliasingFeather: 1,
  // Mouse and touch settings
  dragTimeout: 100,
  draggedEventsTolerance: 3,
  inertiaDuration: 200,
  inertiaRatio: 3,
  zoomDuration: 250,
  zoomingRatio: 1.7,
  doubleClickTimeout: 300,
  doubleClickZoomingRatio: 2.2,
  doubleClickZoomingDuration: 200,
  tapMoveTolerance: 10,
  // Size and scaling
  zoomToSizeRatioFunction: Math.sqrt,
  itemSizesReference: "screen",
  autoRescale: true,
  autoCenter: true,
  // Labels
  labelDensity: 1,
  labelGridCellSize: 100,
  labelRenderedSizeThreshold: 6,
  // Reducers
  nodeReducer: null,
  edgeReducer: null,
  // Features
  zIndex: false,
  minCameraRatio: null,
  maxCameraRatio: null,
  enableCameraZooming: true,
  enableCameraPanning: true,
  enableCameraRotation: true,
  cameraPanBoundaries: null,
  // Lifecycle
  allowInvalidContainer: false,
  // Program classes
  nodeProgramClasses: {},
  nodeHoverProgramClasses: {},
  edgeProgramClasses: {}
};
var DEFAULT_NODE_PROGRAM_CLASSES = {
  circle: NodeCircleProgram
};
var DEFAULT_EDGE_PROGRAM_CLASSES = {
  arrow: EdgeArrowProgram$1,
  line: EdgeRectangleProgram
};
function validateSettings(settings) {
  if (typeof settings.labelDensity !== "number" || settings.labelDensity < 0) {
    throw new Error("Settings: invalid `labelDensity`. Expecting a positive number.");
  }
  var minCameraRatio = settings.minCameraRatio, maxCameraRatio = settings.maxCameraRatio;
  if (typeof minCameraRatio === "number" && typeof maxCameraRatio === "number" && maxCameraRatio < minCameraRatio) {
    throw new Error("Settings: invalid camera ratio boundaries. Expecting `maxCameraRatio` to be greater than `minCameraRatio`.");
  }
}
function resolveSettings(settings) {
  var resolvedSettings = assign({}, DEFAULT_SETTINGS, settings);
  resolvedSettings.nodeProgramClasses = assign({}, DEFAULT_NODE_PROGRAM_CLASSES, resolvedSettings.nodeProgramClasses);
  resolvedSettings.edgeProgramClasses = assign({}, DEFAULT_EDGE_PROGRAM_CLASSES, resolvedSettings.edgeProgramClasses);
  return resolvedSettings;
}

// node_modules/sigma/dist/sigma.esm.js
var import_events2 = __toESM(require_events());
var import_is_graph2 = __toESM(require_is_graph());
var DEFAULT_ZOOMING_RATIO = 1.5;
var Camera = /* @__PURE__ */ (function(_TypedEventEmitter) {
  function Camera2() {
    var _this;
    _classCallCheck(this, Camera2);
    _this = _callSuper(this, Camera2);
    _defineProperty(_this, "x", 0.5);
    _defineProperty(_this, "y", 0.5);
    _defineProperty(_this, "angle", 0);
    _defineProperty(_this, "ratio", 1);
    _defineProperty(_this, "minRatio", null);
    _defineProperty(_this, "maxRatio", null);
    _defineProperty(_this, "enabledZooming", true);
    _defineProperty(_this, "enabledPanning", true);
    _defineProperty(_this, "enabledRotation", true);
    _defineProperty(_this, "clean", null);
    _defineProperty(_this, "nextFrame", null);
    _defineProperty(_this, "previousState", null);
    _defineProperty(_this, "enabled", true);
    _this.previousState = _this.getState();
    return _this;
  }
  _inherits(Camera2, _TypedEventEmitter);
  return _createClass(Camera2, [{
    key: "enable",
    value: (
      /**
       * Method used to enable the camera.
       */
      function enable() {
        this.enabled = true;
        return this;
      }
    )
    /**
     * Method used to disable the camera.
     */
  }, {
    key: "disable",
    value: function disable() {
      this.enabled = false;
      return this;
    }
    /**
     * Method used to retrieve the camera's current state.
     */
  }, {
    key: "getState",
    value: function getState() {
      return {
        x: this.x,
        y: this.y,
        angle: this.angle,
        ratio: this.ratio
      };
    }
    /**
     * Method used to check whether the camera has the given state.
     */
  }, {
    key: "hasState",
    value: function hasState(state) {
      return this.x === state.x && this.y === state.y && this.ratio === state.ratio && this.angle === state.angle;
    }
    /**
     * Method used to retrieve the camera's previous state.
     */
  }, {
    key: "getPreviousState",
    value: function getPreviousState() {
      var state = this.previousState;
      if (!state) return null;
      return {
        x: state.x,
        y: state.y,
        angle: state.angle,
        ratio: state.ratio
      };
    }
    /**
     * Method used to check minRatio and maxRatio values.
     */
  }, {
    key: "getBoundedRatio",
    value: function getBoundedRatio(ratio) {
      var r = ratio;
      if (typeof this.minRatio === "number") r = Math.max(r, this.minRatio);
      if (typeof this.maxRatio === "number") r = Math.min(r, this.maxRatio);
      return r;
    }
    /**
     * Method used to check various things to return a legit state candidate.
     */
  }, {
    key: "validateState",
    value: function validateState(state) {
      var validatedState = {};
      if (this.enabledPanning && typeof state.x === "number") validatedState.x = state.x;
      if (this.enabledPanning && typeof state.y === "number") validatedState.y = state.y;
      if (this.enabledZooming && typeof state.ratio === "number") validatedState.ratio = this.getBoundedRatio(state.ratio);
      if (this.enabledRotation && typeof state.angle === "number") validatedState.angle = state.angle;
      return this.clean ? this.clean(_objectSpread2(_objectSpread2({}, this.getState()), validatedState)) : validatedState;
    }
    /**
     * Method used to check whether the camera is currently being animated.
     */
  }, {
    key: "isAnimated",
    value: function isAnimated() {
      return !!this.nextFrame;
    }
    /**
     * Method used to set the camera's state.
     */
  }, {
    key: "setState",
    value: function setState(state) {
      if (!this.enabled) return this;
      this.previousState = this.getState();
      var validState = this.validateState(state);
      if (typeof validState.x === "number") this.x = validState.x;
      if (typeof validState.y === "number") this.y = validState.y;
      if (typeof validState.ratio === "number") this.ratio = validState.ratio;
      if (typeof validState.angle === "number") this.angle = validState.angle;
      if (!this.hasState(this.previousState)) this.emit("updated", this.getState());
      return this;
    }
    /**
     * Method used to update the camera's state using a function.
     */
  }, {
    key: "updateState",
    value: function updateState(updater) {
      this.setState(updater(this.getState()));
      return this;
    }
    /**
     * Method used to animate the camera.
     */
  }, {
    key: "animate",
    value: function animate(state) {
      var _this2 = this;
      var opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var callback = arguments.length > 2 ? arguments[2] : void 0;
      if (!callback) return new Promise(function(resolve) {
        return _this2.animate(state, opts, resolve);
      });
      if (!this.enabled) return;
      var options = _objectSpread2(_objectSpread2({}, ANIMATE_DEFAULTS), opts);
      var validState = this.validateState(state);
      var easing = typeof options.easing === "function" ? options.easing : easings[options.easing];
      var start = Date.now(), initialState = this.getState();
      var _fn = function fn() {
        var t = (Date.now() - start) / options.duration;
        if (t >= 1) {
          _this2.nextFrame = null;
          _this2.setState(validState);
          if (_this2.animationCallback) {
            _this2.animationCallback.call(null);
            _this2.animationCallback = void 0;
          }
          return;
        }
        var coefficient = easing(t);
        var newState = {};
        if (typeof validState.x === "number") newState.x = initialState.x + (validState.x - initialState.x) * coefficient;
        if (typeof validState.y === "number") newState.y = initialState.y + (validState.y - initialState.y) * coefficient;
        if (_this2.enabledRotation && typeof validState.angle === "number") newState.angle = initialState.angle + (validState.angle - initialState.angle) * coefficient;
        if (typeof validState.ratio === "number") newState.ratio = initialState.ratio + (validState.ratio - initialState.ratio) * coefficient;
        _this2.setState(newState);
        _this2.nextFrame = requestAnimationFrame(_fn);
      };
      if (this.nextFrame) {
        cancelAnimationFrame(this.nextFrame);
        if (this.animationCallback) this.animationCallback.call(null);
        this.nextFrame = requestAnimationFrame(_fn);
      } else {
        _fn();
      }
      this.animationCallback = callback;
    }
    /**
     * Method used to zoom the camera.
     */
  }, {
    key: "animatedZoom",
    value: function animatedZoom(factorOrOptions) {
      if (!factorOrOptions) return this.animate({
        ratio: this.ratio / DEFAULT_ZOOMING_RATIO
      });
      if (typeof factorOrOptions === "number") return this.animate({
        ratio: this.ratio / factorOrOptions
      });
      return this.animate({
        ratio: this.ratio / (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO)
      }, factorOrOptions);
    }
    /**
     * Method used to unzoom the camera.
     */
  }, {
    key: "animatedUnzoom",
    value: function animatedUnzoom(factorOrOptions) {
      if (!factorOrOptions) return this.animate({
        ratio: this.ratio * DEFAULT_ZOOMING_RATIO
      });
      if (typeof factorOrOptions === "number") return this.animate({
        ratio: this.ratio * factorOrOptions
      });
      return this.animate({
        ratio: this.ratio * (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO)
      }, factorOrOptions);
    }
    /**
     * Method used to reset the camera.
     */
  }, {
    key: "animatedReset",
    value: function animatedReset(options) {
      return this.animate({
        x: 0.5,
        y: 0.5,
        ratio: 1,
        angle: 0
      }, options);
    }
    /**
     * Returns a new Camera instance, with the same state as the current camera.
     */
  }, {
    key: "copy",
    value: function copy() {
      return Camera2.from(this.getState());
    }
  }], [{
    key: "from",
    value: function from(state) {
      var camera = new Camera2();
      return camera.setState(state);
    }
  }]);
})(TypedEventEmitter);
function getPosition(e, dom) {
  var bbox = dom.getBoundingClientRect();
  return {
    x: e.clientX - bbox.left,
    y: e.clientY - bbox.top
  };
}
function getMouseCoords(e, dom) {
  var res = _objectSpread2(_objectSpread2({}, getPosition(e, dom)), {}, {
    sigmaDefaultPrevented: false,
    preventSigmaDefault: function preventSigmaDefault() {
      res.sigmaDefaultPrevented = true;
    },
    original: e
  });
  return res;
}
function cleanMouseCoords(e) {
  var res = "x" in e ? e : _objectSpread2(_objectSpread2({}, e.touches[0] || e.previousTouches[0]), {}, {
    original: e.original,
    sigmaDefaultPrevented: e.sigmaDefaultPrevented,
    preventSigmaDefault: function preventSigmaDefault() {
      e.sigmaDefaultPrevented = true;
      res.sigmaDefaultPrevented = true;
    }
  });
  return res;
}
function getWheelCoords(e, dom) {
  return _objectSpread2(_objectSpread2({}, getMouseCoords(e, dom)), {}, {
    delta: getWheelDelta(e)
  });
}
var MAX_TOUCHES = 2;
function getTouchesArray(touches) {
  var arr = [];
  for (var i = 0, l = Math.min(touches.length, MAX_TOUCHES); i < l; i++) arr.push(touches[i]);
  return arr;
}
function getTouchCoords(e, previousTouches, dom) {
  var res = {
    touches: getTouchesArray(e.touches).map(function(touch) {
      return getPosition(touch, dom);
    }),
    previousTouches: previousTouches.map(function(touch) {
      return getPosition(touch, dom);
    }),
    sigmaDefaultPrevented: false,
    preventSigmaDefault: function preventSigmaDefault() {
      res.sigmaDefaultPrevented = true;
    },
    original: e
  };
  return res;
}
function getWheelDelta(e) {
  if (typeof e.deltaY !== "undefined") return e.deltaY * -3 / 360;
  if (typeof e.detail !== "undefined") return e.detail / -9;
  throw new Error("Captor: could not extract delta from event.");
}
var Captor = /* @__PURE__ */ (function(_TypedEventEmitter) {
  function Captor2(container, renderer) {
    var _this;
    _classCallCheck(this, Captor2);
    _this = _callSuper(this, Captor2);
    _this.container = container;
    _this.renderer = renderer;
    return _this;
  }
  _inherits(Captor2, _TypedEventEmitter);
  return _createClass(Captor2);
})(TypedEventEmitter);
var MOUSE_SETTINGS_KEYS = ["doubleClickTimeout", "doubleClickZoomingDuration", "doubleClickZoomingRatio", "dragTimeout", "draggedEventsTolerance", "inertiaDuration", "inertiaRatio", "zoomDuration", "zoomingRatio"];
var DEFAULT_MOUSE_SETTINGS = MOUSE_SETTINGS_KEYS.reduce(function(iter, key) {
  return _objectSpread2(_objectSpread2({}, iter), {}, _defineProperty({}, key, DEFAULT_SETTINGS[key]));
}, {});
var MouseCaptor = /* @__PURE__ */ (function(_Captor) {
  function MouseCaptor2(container, renderer) {
    var _this;
    _classCallCheck(this, MouseCaptor2);
    _this = _callSuper(this, MouseCaptor2, [container, renderer]);
    _defineProperty(_this, "enabled", true);
    _defineProperty(_this, "draggedEvents", 0);
    _defineProperty(_this, "downStartTime", null);
    _defineProperty(_this, "lastMouseX", null);
    _defineProperty(_this, "lastMouseY", null);
    _defineProperty(_this, "isMouseDown", false);
    _defineProperty(_this, "isMoving", false);
    _defineProperty(_this, "movingTimeout", null);
    _defineProperty(_this, "startCameraState", null);
    _defineProperty(_this, "clicks", 0);
    _defineProperty(_this, "doubleClickTimeout", null);
    _defineProperty(_this, "currentWheelDirection", 0);
    _defineProperty(_this, "settings", DEFAULT_MOUSE_SETTINGS);
    _this.handleClick = _this.handleClick.bind(_this);
    _this.handleRightClick = _this.handleRightClick.bind(_this);
    _this.handleDown = _this.handleDown.bind(_this);
    _this.handleUp = _this.handleUp.bind(_this);
    _this.handleMove = _this.handleMove.bind(_this);
    _this.handleWheel = _this.handleWheel.bind(_this);
    _this.handleLeave = _this.handleLeave.bind(_this);
    _this.handleEnter = _this.handleEnter.bind(_this);
    container.addEventListener("click", _this.handleClick, {
      capture: false
    });
    container.addEventListener("contextmenu", _this.handleRightClick, {
      capture: false
    });
    container.addEventListener("mousedown", _this.handleDown, {
      capture: false
    });
    container.addEventListener("wheel", _this.handleWheel, {
      capture: false
    });
    container.addEventListener("mouseleave", _this.handleLeave, {
      capture: false
    });
    container.addEventListener("mouseenter", _this.handleEnter, {
      capture: false
    });
    document.addEventListener("mousemove", _this.handleMove, {
      capture: false
    });
    document.addEventListener("mouseup", _this.handleUp, {
      capture: false
    });
    return _this;
  }
  _inherits(MouseCaptor2, _Captor);
  return _createClass(MouseCaptor2, [{
    key: "kill",
    value: function kill() {
      var container = this.container;
      container.removeEventListener("click", this.handleClick);
      container.removeEventListener("contextmenu", this.handleRightClick);
      container.removeEventListener("mousedown", this.handleDown);
      container.removeEventListener("wheel", this.handleWheel);
      container.removeEventListener("mouseleave", this.handleLeave);
      container.removeEventListener("mouseenter", this.handleEnter);
      document.removeEventListener("mousemove", this.handleMove);
      document.removeEventListener("mouseup", this.handleUp);
    }
  }, {
    key: "handleClick",
    value: function handleClick(e) {
      var _this2 = this;
      if (!this.enabled) return;
      this.clicks++;
      if (this.clicks === 2) {
        this.clicks = 0;
        if (typeof this.doubleClickTimeout === "number") {
          clearTimeout(this.doubleClickTimeout);
          this.doubleClickTimeout = null;
        }
        return this.handleDoubleClick(e);
      }
      setTimeout(function() {
        _this2.clicks = 0;
        _this2.doubleClickTimeout = null;
      }, this.settings.doubleClickTimeout);
      if (this.draggedEvents < this.settings.draggedEventsTolerance) this.emit("click", getMouseCoords(e, this.container));
    }
  }, {
    key: "handleRightClick",
    value: function handleRightClick(e) {
      if (!this.enabled) return;
      this.emit("rightClick", getMouseCoords(e, this.container));
    }
  }, {
    key: "handleDoubleClick",
    value: function handleDoubleClick(e) {
      if (!this.enabled) return;
      e.preventDefault();
      e.stopPropagation();
      var mouseCoords = getMouseCoords(e, this.container);
      this.emit("doubleClick", mouseCoords);
      if (mouseCoords.sigmaDefaultPrevented) return;
      var camera = this.renderer.getCamera();
      var newRatio = camera.getBoundedRatio(camera.getState().ratio / this.settings.doubleClickZoomingRatio);
      camera.animate(this.renderer.getViewportZoomedState(getPosition(e, this.container), newRatio), {
        easing: "quadraticInOut",
        duration: this.settings.doubleClickZoomingDuration
      });
    }
  }, {
    key: "handleDown",
    value: function handleDown(e) {
      if (!this.enabled) return;
      if (e.button === 0) {
        this.startCameraState = this.renderer.getCamera().getState();
        var _getPosition = getPosition(e, this.container), x = _getPosition.x, y = _getPosition.y;
        this.lastMouseX = x;
        this.lastMouseY = y;
        this.draggedEvents = 0;
        this.downStartTime = Date.now();
        this.isMouseDown = true;
      }
      this.emit("mousedown", getMouseCoords(e, this.container));
    }
  }, {
    key: "handleUp",
    value: function handleUp(e) {
      var _this3 = this;
      if (!this.enabled || !this.isMouseDown) return;
      var camera = this.renderer.getCamera();
      this.isMouseDown = false;
      if (typeof this.movingTimeout === "number") {
        clearTimeout(this.movingTimeout);
        this.movingTimeout = null;
      }
      var _getPosition2 = getPosition(e, this.container), x = _getPosition2.x, y = _getPosition2.y;
      var cameraState = camera.getState(), previousCameraState = camera.getPreviousState() || {
        x: 0,
        y: 0
      };
      if (this.isMoving) {
        camera.animate({
          x: cameraState.x + this.settings.inertiaRatio * (cameraState.x - previousCameraState.x),
          y: cameraState.y + this.settings.inertiaRatio * (cameraState.y - previousCameraState.y)
        }, {
          duration: this.settings.inertiaDuration,
          easing: "quadraticOut"
        });
      } else if (this.lastMouseX !== x || this.lastMouseY !== y) {
        camera.setState({
          x: cameraState.x,
          y: cameraState.y
        });
      }
      this.isMoving = false;
      setTimeout(function() {
        var shouldRefresh = _this3.draggedEvents > 0;
        _this3.draggedEvents = 0;
        if (shouldRefresh && _this3.renderer.getSetting("hideEdgesOnMove")) _this3.renderer.refresh();
      }, 0);
      this.emit("mouseup", getMouseCoords(e, this.container));
    }
  }, {
    key: "handleMove",
    value: function handleMove(e) {
      var _this4 = this;
      if (!this.enabled) return;
      var mouseCoords = getMouseCoords(e, this.container);
      this.emit("mousemovebody", mouseCoords);
      if (e.target === this.container || e.composedPath()[0] === this.container) {
        this.emit("mousemove", mouseCoords);
      }
      if (mouseCoords.sigmaDefaultPrevented) return;
      if (this.isMouseDown) {
        this.isMoving = true;
        this.draggedEvents++;
        if (typeof this.movingTimeout === "number") {
          clearTimeout(this.movingTimeout);
        }
        this.movingTimeout = window.setTimeout(function() {
          _this4.movingTimeout = null;
          _this4.isMoving = false;
        }, this.settings.dragTimeout);
        var camera = this.renderer.getCamera();
        var _getPosition3 = getPosition(e, this.container), eX = _getPosition3.x, eY = _getPosition3.y;
        var lastMouse = this.renderer.viewportToFramedGraph({
          x: this.lastMouseX,
          y: this.lastMouseY
        });
        var mouse = this.renderer.viewportToFramedGraph({
          x: eX,
          y: eY
        });
        var offsetX = lastMouse.x - mouse.x, offsetY = lastMouse.y - mouse.y;
        var cameraState = camera.getState();
        var x = cameraState.x + offsetX, y = cameraState.y + offsetY;
        camera.setState({
          x,
          y
        });
        this.lastMouseX = eX;
        this.lastMouseY = eY;
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }, {
    key: "handleLeave",
    value: function handleLeave(e) {
      this.emit("mouseleave", getMouseCoords(e, this.container));
    }
  }, {
    key: "handleEnter",
    value: function handleEnter(e) {
      this.emit("mouseenter", getMouseCoords(e, this.container));
    }
  }, {
    key: "handleWheel",
    value: function handleWheel(e) {
      var _this5 = this;
      var camera = this.renderer.getCamera();
      if (!this.enabled || !camera.enabledZooming) return;
      var delta = getWheelDelta(e);
      if (!delta) return;
      var wheelCoords = getWheelCoords(e, this.container);
      this.emit("wheel", wheelCoords);
      if (wheelCoords.sigmaDefaultPrevented) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      var currentRatio = camera.getState().ratio;
      var ratioDiff = delta > 0 ? 1 / this.settings.zoomingRatio : this.settings.zoomingRatio;
      var newRatio = camera.getBoundedRatio(currentRatio * ratioDiff);
      var wheelDirection = delta > 0 ? 1 : -1;
      var now = Date.now();
      if (currentRatio === newRatio) return;
      e.preventDefault();
      e.stopPropagation();
      if (this.currentWheelDirection === wheelDirection && this.lastWheelTriggerTime && now - this.lastWheelTriggerTime < this.settings.zoomDuration / 5) {
        return;
      }
      camera.animate(this.renderer.getViewportZoomedState(getPosition(e, this.container), newRatio), {
        easing: "quadraticOut",
        duration: this.settings.zoomDuration
      }, function() {
        _this5.currentWheelDirection = 0;
      });
      this.currentWheelDirection = wheelDirection;
      this.lastWheelTriggerTime = now;
    }
  }, {
    key: "setSettings",
    value: function setSettings(settings) {
      this.settings = settings;
    }
  }]);
})(Captor);
var TOUCH_SETTINGS_KEYS = ["dragTimeout", "inertiaDuration", "inertiaRatio", "doubleClickTimeout", "doubleClickZoomingRatio", "doubleClickZoomingDuration", "tapMoveTolerance"];
var DEFAULT_TOUCH_SETTINGS = TOUCH_SETTINGS_KEYS.reduce(function(iter, key) {
  return _objectSpread2(_objectSpread2({}, iter), {}, _defineProperty({}, key, DEFAULT_SETTINGS[key]));
}, {});
var TouchCaptor = /* @__PURE__ */ (function(_Captor) {
  function TouchCaptor2(container, renderer) {
    var _this;
    _classCallCheck(this, TouchCaptor2);
    _this = _callSuper(this, TouchCaptor2, [container, renderer]);
    _defineProperty(_this, "enabled", true);
    _defineProperty(_this, "isMoving", false);
    _defineProperty(_this, "hasMoved", false);
    _defineProperty(_this, "touchMode", 0);
    _defineProperty(_this, "startTouchesPositions", []);
    _defineProperty(_this, "lastTouches", []);
    _defineProperty(_this, "lastTap", null);
    _defineProperty(_this, "settings", DEFAULT_TOUCH_SETTINGS);
    _this.handleStart = _this.handleStart.bind(_this);
    _this.handleLeave = _this.handleLeave.bind(_this);
    _this.handleMove = _this.handleMove.bind(_this);
    container.addEventListener("touchstart", _this.handleStart, {
      capture: false
    });
    container.addEventListener("touchcancel", _this.handleLeave, {
      capture: false
    });
    document.addEventListener("touchend", _this.handleLeave, {
      capture: false,
      passive: false
    });
    document.addEventListener("touchmove", _this.handleMove, {
      capture: false,
      passive: false
    });
    return _this;
  }
  _inherits(TouchCaptor2, _Captor);
  return _createClass(TouchCaptor2, [{
    key: "kill",
    value: function kill() {
      var container = this.container;
      container.removeEventListener("touchstart", this.handleStart);
      container.removeEventListener("touchcancel", this.handleLeave);
      document.removeEventListener("touchend", this.handleLeave);
      document.removeEventListener("touchmove", this.handleMove);
    }
  }, {
    key: "getDimensions",
    value: function getDimensions() {
      return {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight
      };
    }
  }, {
    key: "handleStart",
    value: function handleStart(e) {
      var _this2 = this;
      if (!this.enabled) return;
      e.preventDefault();
      var touches = getTouchesArray(e.touches);
      this.touchMode = touches.length;
      this.startCameraState = this.renderer.getCamera().getState();
      this.startTouchesPositions = touches.map(function(touch) {
        return getPosition(touch, _this2.container);
      });
      if (this.touchMode === 2) {
        var _this$startTouchesPos = _slicedToArray(this.startTouchesPositions, 2), _this$startTouchesPos2 = _this$startTouchesPos[0], x0 = _this$startTouchesPos2.x, y0 = _this$startTouchesPos2.y, _this$startTouchesPos3 = _this$startTouchesPos[1], x1 = _this$startTouchesPos3.x, y1 = _this$startTouchesPos3.y;
        this.startTouchesAngle = Math.atan2(y1 - y0, x1 - x0);
        this.startTouchesDistance = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
      }
      this.emit("touchdown", getTouchCoords(e, this.lastTouches, this.container));
      this.lastTouches = touches;
      this.lastTouchesPositions = this.startTouchesPositions;
    }
  }, {
    key: "handleLeave",
    value: function handleLeave(e) {
      if (!this.enabled || !this.startTouchesPositions.length) return;
      if (e.cancelable) e.preventDefault();
      if (this.movingTimeout) {
        this.isMoving = false;
        clearTimeout(this.movingTimeout);
      }
      switch (this.touchMode) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        case 2:
          if (e.touches.length === 1) {
            this.handleStart(e);
            e.preventDefault();
            break;
          }
        /* falls through */
        case 1:
          if (this.isMoving) {
            var camera = this.renderer.getCamera();
            var cameraState = camera.getState(), previousCameraState = camera.getPreviousState() || {
              x: 0,
              y: 0
            };
            camera.animate({
              x: cameraState.x + this.settings.inertiaRatio * (cameraState.x - previousCameraState.x),
              y: cameraState.y + this.settings.inertiaRatio * (cameraState.y - previousCameraState.y)
            }, {
              duration: this.settings.inertiaDuration,
              easing: "quadraticOut"
            });
          }
          this.hasMoved = false;
          this.isMoving = false;
          this.touchMode = 0;
          break;
      }
      this.emit("touchup", getTouchCoords(e, this.lastTouches, this.container));
      if (!e.touches.length) {
        var position = getPosition(this.lastTouches[0], this.container);
        var downPosition = this.startTouchesPositions[0];
        var dSquare = Math.pow(position.x - downPosition.x, 2) + Math.pow(position.y - downPosition.y, 2);
        if (!e.touches.length && dSquare < Math.pow(this.settings.tapMoveTolerance, 2)) {
          if (this.lastTap && Date.now() - this.lastTap.time < this.settings.doubleClickTimeout) {
            var touchCoords = getTouchCoords(e, this.lastTouches, this.container);
            this.emit("doubletap", touchCoords);
            this.lastTap = null;
            if (!touchCoords.sigmaDefaultPrevented) {
              var _camera = this.renderer.getCamera();
              var newRatio = _camera.getBoundedRatio(_camera.getState().ratio / this.settings.doubleClickZoomingRatio);
              _camera.animate(this.renderer.getViewportZoomedState(position, newRatio), {
                easing: "quadraticInOut",
                duration: this.settings.doubleClickZoomingDuration
              });
            }
          } else {
            var _touchCoords = getTouchCoords(e, this.lastTouches, this.container);
            this.emit("tap", _touchCoords);
            this.lastTap = {
              time: Date.now(),
              position: _touchCoords.touches[0] || _touchCoords.previousTouches[0]
            };
          }
        }
      }
      this.lastTouches = getTouchesArray(e.touches);
      this.startTouchesPositions = [];
    }
  }, {
    key: "handleMove",
    value: function handleMove(e) {
      var _this3 = this;
      if (!this.enabled || !this.startTouchesPositions.length) return;
      e.preventDefault();
      var touches = getTouchesArray(e.touches);
      var touchesPositions = touches.map(function(touch) {
        return getPosition(touch, _this3.container);
      });
      var lastTouches = this.lastTouches;
      this.lastTouches = touches;
      this.lastTouchesPositions = touchesPositions;
      var touchCoords = getTouchCoords(e, lastTouches, this.container);
      this.emit("touchmove", touchCoords);
      if (touchCoords.sigmaDefaultPrevented) return;
      this.hasMoved || (this.hasMoved = touchesPositions.some(function(position, idx) {
        var startPosition = _this3.startTouchesPositions[idx];
        return startPosition && (position.x !== startPosition.x || position.y !== startPosition.y);
      }));
      if (!this.hasMoved) {
        return;
      }
      this.isMoving = true;
      if (this.movingTimeout) clearTimeout(this.movingTimeout);
      this.movingTimeout = window.setTimeout(function() {
        _this3.isMoving = false;
      }, this.settings.dragTimeout);
      var camera = this.renderer.getCamera();
      var startCameraState = this.startCameraState;
      var padding = this.renderer.getSetting("stagePadding");
      switch (this.touchMode) {
        case 1: {
          var _this$renderer$viewpo = this.renderer.viewportToFramedGraph((this.startTouchesPositions || [])[0]), xStart = _this$renderer$viewpo.x, yStart = _this$renderer$viewpo.y;
          var _this$renderer$viewpo2 = this.renderer.viewportToFramedGraph(touchesPositions[0]), x = _this$renderer$viewpo2.x, y = _this$renderer$viewpo2.y;
          camera.setState({
            x: startCameraState.x + xStart - x,
            y: startCameraState.y + yStart - y
          });
          break;
        }
        case 2: {
          var newCameraState = {
            x: 0.5,
            y: 0.5,
            angle: 0,
            ratio: 1
          };
          var _touchesPositions$ = touchesPositions[0], x0 = _touchesPositions$.x, y0 = _touchesPositions$.y;
          var _touchesPositions$2 = touchesPositions[1], x1 = _touchesPositions$2.x, y1 = _touchesPositions$2.y;
          var angleDiff = Math.atan2(y1 - y0, x1 - x0) - this.startTouchesAngle;
          var ratioDiff = Math.hypot(y1 - y0, x1 - x0) / this.startTouchesDistance;
          var newRatio = camera.getBoundedRatio(startCameraState.ratio / ratioDiff);
          newCameraState.ratio = newRatio;
          newCameraState.angle = startCameraState.angle + angleDiff;
          var dimensions = this.getDimensions();
          var touchGraphPosition = this.renderer.viewportToFramedGraph((this.startTouchesPositions || [])[0], {
            cameraState: startCameraState
          });
          var smallestDimension = Math.min(dimensions.width, dimensions.height) - 2 * padding;
          var dx = smallestDimension / dimensions.width;
          var dy = smallestDimension / dimensions.height;
          var ratio = newRatio / smallestDimension;
          var _x = x0 - smallestDimension / 2 / dx;
          var _y = y0 - smallestDimension / 2 / dy;
          var _ref = [_x * Math.cos(-newCameraState.angle) - _y * Math.sin(-newCameraState.angle), _y * Math.cos(-newCameraState.angle) + _x * Math.sin(-newCameraState.angle)];
          _x = _ref[0];
          _y = _ref[1];
          newCameraState.x = touchGraphPosition.x - _x * ratio;
          newCameraState.y = touchGraphPosition.y + _y * ratio;
          camera.setState(newCameraState);
          break;
        }
      }
    }
  }, {
    key: "setSettings",
    value: function setSettings(settings) {
      this.settings = settings;
    }
  }]);
})(Captor);
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
var LabelCandidate = /* @__PURE__ */ (function() {
  function LabelCandidate2(key, size) {
    _classCallCheck(this, LabelCandidate2);
    this.key = key;
    this.size = size;
  }
  return _createClass(LabelCandidate2, null, [{
    key: "compare",
    value: function compare(first, second) {
      if (first.size > second.size) return -1;
      if (first.size < second.size) return 1;
      if (first.key > second.key) return 1;
      return -1;
    }
  }]);
})();
var LabelGrid = /* @__PURE__ */ (function() {
  function LabelGrid2() {
    _classCallCheck(this, LabelGrid2);
    _defineProperty(this, "width", 0);
    _defineProperty(this, "height", 0);
    _defineProperty(this, "cellSize", 0);
    _defineProperty(this, "columns", 0);
    _defineProperty(this, "rows", 0);
    _defineProperty(this, "cells", {});
  }
  return _createClass(LabelGrid2, [{
    key: "resizeAndClear",
    value: function resizeAndClear(dimensions, cellSize) {
      this.width = dimensions.width;
      this.height = dimensions.height;
      this.cellSize = cellSize;
      this.columns = Math.ceil(dimensions.width / cellSize);
      this.rows = Math.ceil(dimensions.height / cellSize);
      this.cells = {};
    }
  }, {
    key: "getIndex",
    value: function getIndex(pos) {
      var xIndex = Math.floor(pos.x / this.cellSize);
      var yIndex = Math.floor(pos.y / this.cellSize);
      return yIndex * this.columns + xIndex;
    }
  }, {
    key: "add",
    value: function add(key, size, pos) {
      var candidate = new LabelCandidate(key, size);
      var index = this.getIndex(pos);
      var cell = this.cells[index];
      if (!cell) {
        cell = [];
        this.cells[index] = cell;
      }
      cell.push(candidate);
    }
  }, {
    key: "organize",
    value: function organize() {
      for (var k in this.cells) {
        var cell = this.cells[k];
        cell.sort(LabelCandidate.compare);
      }
    }
  }, {
    key: "getLabelsToDisplay",
    value: function getLabelsToDisplay(ratio, density) {
      var cellArea = this.cellSize * this.cellSize;
      var scaledCellArea = cellArea / ratio / ratio;
      var scaledDensity = scaledCellArea * density / cellArea;
      var labelsToDisplayPerCell = Math.ceil(scaledDensity);
      var labels = [];
      for (var k in this.cells) {
        var cell = this.cells[k];
        for (var i = 0; i < Math.min(labelsToDisplayPerCell, cell.length); i++) {
          labels.push(cell[i].key);
        }
      }
      return labels;
    }
  }]);
})();
function edgeLabelsToDisplayFromNodes(params) {
  var graph = params.graph, hoveredNode = params.hoveredNode, highlightedNodes = params.highlightedNodes, displayedNodeLabels = params.displayedNodeLabels;
  var worthyEdges = [];
  graph.forEachEdge(function(edge, _, source, target) {
    if (source === hoveredNode || target === hoveredNode || highlightedNodes.has(source) || highlightedNodes.has(target) || displayedNodeLabels.has(source) && displayedNodeLabels.has(target)) {
      worthyEdges.push(edge);
    }
  });
  return worthyEdges;
}
var X_LABEL_MARGIN = 150;
var Y_LABEL_MARGIN = 50;
var hasOwnProperty = Object.prototype.hasOwnProperty;
function applyNodeDefaults(settings, key, data) {
  if (!hasOwnProperty.call(data, "x") || !hasOwnProperty.call(data, "y")) throw new Error('Sigma: could not find a valid position (x, y) for node "'.concat(key, '". All your nodes must have a number "x" and "y". Maybe your forgot to apply a layout or your "nodeReducer" is not returning the correct data?'));
  if (!data.color) data.color = settings.defaultNodeColor;
  if (!data.label && data.label !== "") data.label = null;
  if (data.label !== void 0 && data.label !== null) data.label = "" + data.label;
  else data.label = null;
  if (!data.size) data.size = 2;
  if (!hasOwnProperty.call(data, "hidden")) data.hidden = false;
  if (!hasOwnProperty.call(data, "highlighted")) data.highlighted = false;
  if (!hasOwnProperty.call(data, "forceLabel")) data.forceLabel = false;
  if (!data.type || data.type === "") data.type = settings.defaultNodeType;
  if (!data.zIndex) data.zIndex = 0;
  return data;
}
function applyEdgeDefaults(settings, _key, data) {
  if (!data.color) data.color = settings.defaultEdgeColor;
  if (!data.label) data.label = "";
  if (!data.size) data.size = 0.5;
  if (!hasOwnProperty.call(data, "hidden")) data.hidden = false;
  if (!hasOwnProperty.call(data, "forceLabel")) data.forceLabel = false;
  if (!data.type || data.type === "") data.type = settings.defaultEdgeType;
  if (!data.zIndex) data.zIndex = 0;
  return data;
}
var Sigma$1 = /* @__PURE__ */ (function(_TypedEventEmitter) {
  function Sigma2(graph, container) {
    var _this;
    var settings = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    _classCallCheck(this, Sigma2);
    _this = _callSuper(this, Sigma2);
    _defineProperty(_this, "elements", {});
    _defineProperty(_this, "canvasContexts", {});
    _defineProperty(_this, "webGLContexts", {});
    _defineProperty(_this, "pickingLayers", /* @__PURE__ */ new Set());
    _defineProperty(_this, "textures", {});
    _defineProperty(_this, "frameBuffers", {});
    _defineProperty(_this, "activeListeners", {});
    _defineProperty(_this, "labelGrid", new LabelGrid());
    _defineProperty(_this, "nodeDataCache", {});
    _defineProperty(_this, "edgeDataCache", {});
    _defineProperty(_this, "nodeProgramIndex", {});
    _defineProperty(_this, "edgeProgramIndex", {});
    _defineProperty(_this, "nodesWithForcedLabels", /* @__PURE__ */ new Set());
    _defineProperty(_this, "edgesWithForcedLabels", /* @__PURE__ */ new Set());
    _defineProperty(_this, "nodeExtent", {
      x: [0, 1],
      y: [0, 1]
    });
    _defineProperty(_this, "nodeZExtent", [Infinity, -Infinity]);
    _defineProperty(_this, "edgeZExtent", [Infinity, -Infinity]);
    _defineProperty(_this, "matrix", identity());
    _defineProperty(_this, "invMatrix", identity());
    _defineProperty(_this, "correctionRatio", 1);
    _defineProperty(_this, "customBBox", null);
    _defineProperty(_this, "normalizationFunction", createNormalizationFunction({
      x: [0, 1],
      y: [0, 1]
    }));
    _defineProperty(_this, "graphToViewportRatio", 1);
    _defineProperty(_this, "itemIDsIndex", {});
    _defineProperty(_this, "nodeIndices", {});
    _defineProperty(_this, "edgeIndices", {});
    _defineProperty(_this, "width", 0);
    _defineProperty(_this, "height", 0);
    _defineProperty(_this, "pixelRatio", getPixelRatio());
    _defineProperty(_this, "pickingDownSizingRatio", 2 * _this.pixelRatio);
    _defineProperty(_this, "displayedNodeLabels", /* @__PURE__ */ new Set());
    _defineProperty(_this, "displayedEdgeLabels", /* @__PURE__ */ new Set());
    _defineProperty(_this, "highlightedNodes", /* @__PURE__ */ new Set());
    _defineProperty(_this, "hoveredNode", null);
    _defineProperty(_this, "hoveredEdge", null);
    _defineProperty(_this, "renderFrame", null);
    _defineProperty(_this, "renderHighlightedNodesFrame", null);
    _defineProperty(_this, "needToProcess", false);
    _defineProperty(_this, "checkEdgesEventsFrame", null);
    _defineProperty(_this, "nodePrograms", {});
    _defineProperty(_this, "nodeHoverPrograms", {});
    _defineProperty(_this, "edgePrograms", {});
    _this.settings = resolveSettings(settings);
    validateSettings(_this.settings);
    validateGraph(graph);
    if (!(container instanceof HTMLElement)) throw new Error("Sigma: container should be an html element.");
    _this.graph = graph;
    _this.container = container;
    _this.createWebGLContext("edges", {
      picking: settings.enableEdgeEvents
    });
    _this.createCanvasContext("edgeLabels");
    _this.createWebGLContext("nodes", {
      picking: true
    });
    _this.createCanvasContext("labels");
    _this.createCanvasContext("hovers");
    _this.createWebGLContext("hoverNodes");
    _this.createCanvasContext("mouse", {
      style: {
        touchAction: "none",
        userSelect: "none"
      }
    });
    _this.resize();
    for (var type in _this.settings.nodeProgramClasses) {
      _this.registerNodeProgram(type, _this.settings.nodeProgramClasses[type], _this.settings.nodeHoverProgramClasses[type]);
    }
    for (var _type in _this.settings.edgeProgramClasses) {
      _this.registerEdgeProgram(_type, _this.settings.edgeProgramClasses[_type]);
    }
    _this.camera = new Camera();
    _this.bindCameraHandlers();
    _this.mouseCaptor = new MouseCaptor(_this.elements.mouse, _this);
    _this.mouseCaptor.setSettings(_this.settings);
    _this.touchCaptor = new TouchCaptor(_this.elements.mouse, _this);
    _this.touchCaptor.setSettings(_this.settings);
    _this.bindEventHandlers();
    _this.bindGraphHandlers();
    _this.handleSettingsUpdate();
    _this.refresh();
    return _this;
  }
  _inherits(Sigma2, _TypedEventEmitter);
  return _createClass(Sigma2, [{
    key: "registerNodeProgram",
    value: function registerNodeProgram(key, NodeProgramClass, NodeHoverProgram) {
      if (this.nodePrograms[key]) this.nodePrograms[key].kill();
      if (this.nodeHoverPrograms[key]) this.nodeHoverPrograms[key].kill();
      this.nodePrograms[key] = new NodeProgramClass(this.webGLContexts.nodes, this.frameBuffers.nodes, this);
      this.nodeHoverPrograms[key] = new (NodeHoverProgram || NodeProgramClass)(this.webGLContexts.hoverNodes, null, this);
      return this;
    }
    /**
     * Internal function used to register an edge program
     *
     * @param  {string}          key              - The program's key, matching the related edges "type" values.
     * @param  {EdgeProgramType} EdgeProgramClass - An edges program class.
     * @return {Sigma}
     */
  }, {
    key: "registerEdgeProgram",
    value: function registerEdgeProgram(key, EdgeProgramClass) {
      if (this.edgePrograms[key]) this.edgePrograms[key].kill();
      this.edgePrograms[key] = new EdgeProgramClass(this.webGLContexts.edges, this.frameBuffers.edges, this);
      return this;
    }
    /**
     * Internal function used to unregister a node program
     *
     * @param  {string} key - The program's key, matching the related nodes "type" values.
     * @return {Sigma}
     */
  }, {
    key: "unregisterNodeProgram",
    value: function unregisterNodeProgram(key) {
      if (this.nodePrograms[key]) {
        var _this$nodePrograms = this.nodePrograms, program = _this$nodePrograms[key], programs = _objectWithoutProperties(_this$nodePrograms, [key].map(_toPropertyKey));
        program.kill();
        this.nodePrograms = programs;
      }
      if (this.nodeHoverPrograms[key]) {
        var _this$nodeHoverProgra = this.nodeHoverPrograms, _program = _this$nodeHoverProgra[key], _programs = _objectWithoutProperties(_this$nodeHoverProgra, [key].map(_toPropertyKey));
        _program.kill();
        this.nodePrograms = _programs;
      }
      return this;
    }
    /**
     * Internal function used to unregister an edge program
     *
     * @param  {string} key - The program's key, matching the related edges "type" values.
     * @return {Sigma}
     */
  }, {
    key: "unregisterEdgeProgram",
    value: function unregisterEdgeProgram(key) {
      if (this.edgePrograms[key]) {
        var _this$edgePrograms = this.edgePrograms, program = _this$edgePrograms[key], programs = _objectWithoutProperties(_this$edgePrograms, [key].map(_toPropertyKey));
        program.kill();
        this.edgePrograms = programs;
      }
      return this;
    }
    /**
     * Method (re)binding WebGL texture (for picking).
     *
     * @return {Sigma}
     */
  }, {
    key: "resetWebGLTexture",
    value: function resetWebGLTexture(id) {
      var gl = this.webGLContexts[id];
      var frameBuffer = this.frameBuffers[id];
      var currentTexture = this.textures[id];
      if (currentTexture) gl.deleteTexture(currentTexture);
      var pickingTexture = gl.createTexture();
      gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
      gl.bindTexture(gl.TEXTURE_2D, pickingTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, pickingTexture, 0);
      this.textures[id] = pickingTexture;
      return this;
    }
    /**
     * Method binding camera handlers.
     *
     * @return {Sigma}
     */
  }, {
    key: "bindCameraHandlers",
    value: function bindCameraHandlers() {
      var _this2 = this;
      this.activeListeners.camera = function() {
        _this2.scheduleRender();
      };
      this.camera.on("updated", this.activeListeners.camera);
      return this;
    }
    /**
     * Method unbinding camera handlers.
     *
     * @return {Sigma}
     */
  }, {
    key: "unbindCameraHandlers",
    value: function unbindCameraHandlers() {
      this.camera.removeListener("updated", this.activeListeners.camera);
      return this;
    }
    /**
     * Method that returns the closest node to a given position.
     */
  }, {
    key: "getNodeAtPosition",
    value: function getNodeAtPosition(position) {
      var x = position.x, y = position.y;
      var color = getPixelColor(this.webGLContexts.nodes, this.frameBuffers.nodes, x, y, this.pixelRatio, this.pickingDownSizingRatio);
      var index = colorToIndex.apply(void 0, _toConsumableArray(color));
      var itemAt = this.itemIDsIndex[index];
      return itemAt && itemAt.type === "node" ? itemAt.id : null;
    }
    /**
     * Method binding event handlers.
     *
     * @return {Sigma}
     */
  }, {
    key: "bindEventHandlers",
    value: function bindEventHandlers() {
      var _this3 = this;
      this.activeListeners.handleResize = function() {
        _this3.scheduleRefresh();
      };
      window.addEventListener("resize", this.activeListeners.handleResize);
      this.activeListeners.handleMove = function(e) {
        var event = cleanMouseCoords(e);
        var baseEvent = {
          event,
          preventSigmaDefault: function preventSigmaDefault() {
            event.preventSigmaDefault();
          }
        };
        var nodeToHover = _this3.getNodeAtPosition(event);
        if (nodeToHover && _this3.hoveredNode !== nodeToHover && !_this3.nodeDataCache[nodeToHover].hidden) {
          if (_this3.hoveredNode) _this3.emit("leaveNode", _objectSpread2(_objectSpread2({}, baseEvent), {}, {
            node: _this3.hoveredNode
          }));
          _this3.hoveredNode = nodeToHover;
          _this3.emit("enterNode", _objectSpread2(_objectSpread2({}, baseEvent), {}, {
            node: nodeToHover
          }));
          _this3.scheduleHighlightedNodesRender();
          return;
        }
        if (_this3.hoveredNode) {
          if (_this3.getNodeAtPosition(event) !== _this3.hoveredNode) {
            var node = _this3.hoveredNode;
            _this3.hoveredNode = null;
            _this3.emit("leaveNode", _objectSpread2(_objectSpread2({}, baseEvent), {}, {
              node
            }));
            _this3.scheduleHighlightedNodesRender();
            return;
          }
        }
        if (_this3.settings.enableEdgeEvents) {
          var edgeToHover = _this3.hoveredNode ? null : _this3.getEdgeAtPoint(baseEvent.event.x, baseEvent.event.y);
          if (edgeToHover !== _this3.hoveredEdge) {
            if (_this3.hoveredEdge) _this3.emit("leaveEdge", _objectSpread2(_objectSpread2({}, baseEvent), {}, {
              edge: _this3.hoveredEdge
            }));
            if (edgeToHover) _this3.emit("enterEdge", _objectSpread2(_objectSpread2({}, baseEvent), {}, {
              edge: edgeToHover
            }));
            _this3.hoveredEdge = edgeToHover;
          }
        }
      };
      this.activeListeners.handleMoveBody = function(e) {
        var event = cleanMouseCoords(e);
        _this3.emit("moveBody", {
          event,
          preventSigmaDefault: function preventSigmaDefault() {
            event.preventSigmaDefault();
          }
        });
      };
      this.activeListeners.handleLeave = function(e) {
        var event = cleanMouseCoords(e);
        var baseEvent = {
          event,
          preventSigmaDefault: function preventSigmaDefault() {
            event.preventSigmaDefault();
          }
        };
        if (_this3.hoveredNode) {
          _this3.emit("leaveNode", _objectSpread2(_objectSpread2({}, baseEvent), {}, {
            node: _this3.hoveredNode
          }));
          _this3.scheduleHighlightedNodesRender();
        }
        if (_this3.settings.enableEdgeEvents && _this3.hoveredEdge) {
          _this3.emit("leaveEdge", _objectSpread2(_objectSpread2({}, baseEvent), {}, {
            edge: _this3.hoveredEdge
          }));
          _this3.scheduleHighlightedNodesRender();
        }
        _this3.emit("leaveStage", _objectSpread2({}, baseEvent));
      };
      this.activeListeners.handleEnter = function(e) {
        var event = cleanMouseCoords(e);
        var baseEvent = {
          event,
          preventSigmaDefault: function preventSigmaDefault() {
            event.preventSigmaDefault();
          }
        };
        _this3.emit("enterStage", _objectSpread2({}, baseEvent));
      };
      var createInteractionListener = function createInteractionListener2(eventType) {
        return function(e) {
          var event = cleanMouseCoords(e);
          var baseEvent = {
            event,
            preventSigmaDefault: function preventSigmaDefault() {
              event.preventSigmaDefault();
            }
          };
          var nodeAtPosition = _this3.getNodeAtPosition(event);
          if (nodeAtPosition) return _this3.emit("".concat(eventType, "Node"), _objectSpread2(_objectSpread2({}, baseEvent), {}, {
            node: nodeAtPosition
          }));
          if (_this3.settings.enableEdgeEvents) {
            var edge = _this3.getEdgeAtPoint(event.x, event.y);
            if (edge) return _this3.emit("".concat(eventType, "Edge"), _objectSpread2(_objectSpread2({}, baseEvent), {}, {
              edge
            }));
          }
          return _this3.emit("".concat(eventType, "Stage"), baseEvent);
        };
      };
      this.activeListeners.handleClick = createInteractionListener("click");
      this.activeListeners.handleRightClick = createInteractionListener("rightClick");
      this.activeListeners.handleDoubleClick = createInteractionListener("doubleClick");
      this.activeListeners.handleWheel = createInteractionListener("wheel");
      this.activeListeners.handleDown = createInteractionListener("down");
      this.activeListeners.handleUp = createInteractionListener("up");
      this.mouseCaptor.on("mousemove", this.activeListeners.handleMove);
      this.mouseCaptor.on("mousemovebody", this.activeListeners.handleMoveBody);
      this.mouseCaptor.on("click", this.activeListeners.handleClick);
      this.mouseCaptor.on("rightClick", this.activeListeners.handleRightClick);
      this.mouseCaptor.on("doubleClick", this.activeListeners.handleDoubleClick);
      this.mouseCaptor.on("wheel", this.activeListeners.handleWheel);
      this.mouseCaptor.on("mousedown", this.activeListeners.handleDown);
      this.mouseCaptor.on("mouseup", this.activeListeners.handleUp);
      this.mouseCaptor.on("mouseleave", this.activeListeners.handleLeave);
      this.mouseCaptor.on("mouseenter", this.activeListeners.handleEnter);
      this.touchCaptor.on("touchdown", this.activeListeners.handleDown);
      this.touchCaptor.on("touchdown", this.activeListeners.handleMove);
      this.touchCaptor.on("touchup", this.activeListeners.handleUp);
      this.touchCaptor.on("touchmove", this.activeListeners.handleMove);
      this.touchCaptor.on("tap", this.activeListeners.handleClick);
      this.touchCaptor.on("doubletap", this.activeListeners.handleDoubleClick);
      this.touchCaptor.on("touchmove", this.activeListeners.handleMoveBody);
      return this;
    }
    /**
     * Method binding graph handlers
     *
     * @return {Sigma}
     */
  }, {
    key: "bindGraphHandlers",
    value: function bindGraphHandlers() {
      var _this4 = this;
      var graph = this.graph;
      var LAYOUT_IMPACTING_FIELDS = /* @__PURE__ */ new Set(["x", "y", "zIndex", "type"]);
      this.activeListeners.eachNodeAttributesUpdatedGraphUpdate = function(e) {
        var _e$hints;
        var updatedFields = (_e$hints = e.hints) === null || _e$hints === void 0 ? void 0 : _e$hints.attributes;
        _this4.graph.forEachNode(function(node) {
          return _this4.updateNode(node);
        });
        var layoutChanged = !updatedFields || updatedFields.some(function(f) {
          return LAYOUT_IMPACTING_FIELDS.has(f);
        });
        _this4.refresh({
          partialGraph: {
            nodes: graph.nodes()
          },
          skipIndexation: !layoutChanged,
          schedule: true
        });
      };
      this.activeListeners.eachEdgeAttributesUpdatedGraphUpdate = function(e) {
        var _e$hints2;
        var updatedFields = (_e$hints2 = e.hints) === null || _e$hints2 === void 0 ? void 0 : _e$hints2.attributes;
        _this4.graph.forEachEdge(function(edge) {
          return _this4.updateEdge(edge);
        });
        var layoutChanged = updatedFields && ["zIndex", "type"].some(function(f) {
          return updatedFields === null || updatedFields === void 0 ? void 0 : updatedFields.includes(f);
        });
        _this4.refresh({
          partialGraph: {
            edges: graph.edges()
          },
          skipIndexation: !layoutChanged,
          schedule: true
        });
      };
      this.activeListeners.addNodeGraphUpdate = function(payload) {
        var node = payload.key;
        _this4.addNode(node);
        _this4.refresh({
          partialGraph: {
            nodes: [node]
          },
          skipIndexation: false,
          schedule: true
        });
      };
      this.activeListeners.updateNodeGraphUpdate = function(payload) {
        var node = payload.key;
        _this4.refresh({
          partialGraph: {
            nodes: [node]
          },
          skipIndexation: false,
          schedule: true
        });
      };
      this.activeListeners.dropNodeGraphUpdate = function(payload) {
        var node = payload.key;
        _this4.removeNode(node);
        _this4.refresh({
          schedule: true
        });
      };
      this.activeListeners.addEdgeGraphUpdate = function(payload) {
        var edge = payload.key;
        _this4.addEdge(edge);
        _this4.refresh({
          partialGraph: {
            edges: [edge]
          },
          schedule: true
        });
      };
      this.activeListeners.updateEdgeGraphUpdate = function(payload) {
        var edge = payload.key;
        _this4.refresh({
          partialGraph: {
            edges: [edge]
          },
          skipIndexation: false,
          schedule: true
        });
      };
      this.activeListeners.dropEdgeGraphUpdate = function(payload) {
        var edge = payload.key;
        _this4.removeEdge(edge);
        _this4.refresh({
          schedule: true
        });
      };
      this.activeListeners.clearEdgesGraphUpdate = function() {
        _this4.clearEdgeState();
        _this4.clearEdgeIndices();
        _this4.refresh({
          schedule: true
        });
      };
      this.activeListeners.clearGraphUpdate = function() {
        _this4.clearEdgeState();
        _this4.clearNodeState();
        _this4.clearEdgeIndices();
        _this4.clearNodeIndices();
        _this4.refresh({
          schedule: true
        });
      };
      graph.on("nodeAdded", this.activeListeners.addNodeGraphUpdate);
      graph.on("nodeDropped", this.activeListeners.dropNodeGraphUpdate);
      graph.on("nodeAttributesUpdated", this.activeListeners.updateNodeGraphUpdate);
      graph.on("eachNodeAttributesUpdated", this.activeListeners.eachNodeAttributesUpdatedGraphUpdate);
      graph.on("edgeAdded", this.activeListeners.addEdgeGraphUpdate);
      graph.on("edgeDropped", this.activeListeners.dropEdgeGraphUpdate);
      graph.on("edgeAttributesUpdated", this.activeListeners.updateEdgeGraphUpdate);
      graph.on("eachEdgeAttributesUpdated", this.activeListeners.eachEdgeAttributesUpdatedGraphUpdate);
      graph.on("edgesCleared", this.activeListeners.clearEdgesGraphUpdate);
      graph.on("cleared", this.activeListeners.clearGraphUpdate);
      return this;
    }
    /**
     * Method used to unbind handlers from the graph.
     *
     * @return {undefined}
     */
  }, {
    key: "unbindGraphHandlers",
    value: function unbindGraphHandlers() {
      var graph = this.graph;
      graph.removeListener("nodeAdded", this.activeListeners.addNodeGraphUpdate);
      graph.removeListener("nodeDropped", this.activeListeners.dropNodeGraphUpdate);
      graph.removeListener("nodeAttributesUpdated", this.activeListeners.updateNodeGraphUpdate);
      graph.removeListener("eachNodeAttributesUpdated", this.activeListeners.eachNodeAttributesUpdatedGraphUpdate);
      graph.removeListener("edgeAdded", this.activeListeners.addEdgeGraphUpdate);
      graph.removeListener("edgeDropped", this.activeListeners.dropEdgeGraphUpdate);
      graph.removeListener("edgeAttributesUpdated", this.activeListeners.updateEdgeGraphUpdate);
      graph.removeListener("eachEdgeAttributesUpdated", this.activeListeners.eachEdgeAttributesUpdatedGraphUpdate);
      graph.removeListener("edgesCleared", this.activeListeners.clearEdgesGraphUpdate);
      graph.removeListener("cleared", this.activeListeners.clearGraphUpdate);
    }
    /**
     * Method looking for an edge colliding with a given point at (x, y). Returns
     * the key of the edge if any, or null else.
     */
  }, {
    key: "getEdgeAtPoint",
    value: function getEdgeAtPoint(x, y) {
      var color = getPixelColor(this.webGLContexts.edges, this.frameBuffers.edges, x, y, this.pixelRatio, this.pickingDownSizingRatio);
      var index = colorToIndex.apply(void 0, _toConsumableArray(color));
      var itemAt = this.itemIDsIndex[index];
      return itemAt && itemAt.type === "edge" ? itemAt.id : null;
    }
    /**
     * Method used to process the whole graph's data.
     *  - extent
     *  - normalizationFunction
     *  - compute node's coordinate
     *  - labelgrid
     *  - program data allocation
     * @return {Sigma}
     */
  }, {
    key: "process",
    value: function process() {
      var _this5 = this;
      this.emit("beforeProcess");
      var graph = this.graph;
      var settings = this.settings;
      var dimensions = this.getDimensions();
      this.nodeExtent = graphExtent(this.graph);
      if (!this.settings.autoRescale) {
        var width = dimensions.width, height = dimensions.height;
        var _this$nodeExtent = this.nodeExtent, x = _this$nodeExtent.x, y = _this$nodeExtent.y;
        this.nodeExtent = {
          x: [(x[0] + x[1]) / 2 - width / 2, (x[0] + x[1]) / 2 + width / 2],
          y: [(y[0] + y[1]) / 2 - height / 2, (y[0] + y[1]) / 2 + height / 2]
        };
      }
      this.normalizationFunction = createNormalizationFunction(this.customBBox || this.nodeExtent);
      var nullCamera = new Camera();
      var nullCameraMatrix = matrixFromCamera(nullCamera.getState(), dimensions, this.getGraphDimensions(), this.getStagePadding());
      this.labelGrid.resizeAndClear(dimensions, settings.labelGridCellSize);
      var nodesPerPrograms = {};
      var nodeIndices = {};
      var edgeIndices = {};
      var itemIDsIndex = {};
      var incrID = 1;
      var nodes = graph.nodes();
      for (var i = 0, l = nodes.length; i < l; i++) {
        var node = nodes[i];
        var data = this.nodeDataCache[node];
        var attrs = graph.getNodeAttributes(node);
        data.x = attrs.x;
        data.y = attrs.y;
        this.normalizationFunction.applyTo(data);
        if (typeof data.label === "string" && !data.hidden) this.labelGrid.add(node, data.size, this.framedGraphToViewport(data, {
          matrix: nullCameraMatrix
        }));
        nodesPerPrograms[data.type] = (nodesPerPrograms[data.type] || 0) + 1;
      }
      this.labelGrid.organize();
      for (var type in this.nodePrograms) {
        if (!hasOwnProperty.call(this.nodePrograms, type)) {
          throw new Error('Sigma: could not find a suitable program for node type "'.concat(type, '"!'));
        }
        this.nodePrograms[type].reallocate(nodesPerPrograms[type] || 0);
        nodesPerPrograms[type] = 0;
      }
      if (this.settings.zIndex && this.nodeZExtent[0] !== this.nodeZExtent[1]) nodes = zIndexOrdering(this.nodeZExtent, function(node2) {
        return _this5.nodeDataCache[node2].zIndex;
      }, nodes);
      for (var _i = 0, _l = nodes.length; _i < _l; _i++) {
        var _node = nodes[_i];
        nodeIndices[_node] = incrID;
        itemIDsIndex[nodeIndices[_node]] = {
          type: "node",
          id: _node
        };
        incrID++;
        var _data = this.nodeDataCache[_node];
        this.addNodeToProgram(_node, nodeIndices[_node], nodesPerPrograms[_data.type]++);
      }
      var edgesPerPrograms = {};
      var edges = graph.edges();
      for (var _i2 = 0, _l2 = edges.length; _i2 < _l2; _i2++) {
        var edge = edges[_i2];
        var _data2 = this.edgeDataCache[edge];
        edgesPerPrograms[_data2.type] = (edgesPerPrograms[_data2.type] || 0) + 1;
      }
      if (this.settings.zIndex && this.edgeZExtent[0] !== this.edgeZExtent[1]) edges = zIndexOrdering(this.edgeZExtent, function(edge2) {
        return _this5.edgeDataCache[edge2].zIndex;
      }, edges);
      for (var _type2 in this.edgePrograms) {
        if (!hasOwnProperty.call(this.edgePrograms, _type2)) {
          throw new Error('Sigma: could not find a suitable program for edge type "'.concat(_type2, '"!'));
        }
        this.edgePrograms[_type2].reallocate(edgesPerPrograms[_type2] || 0);
        edgesPerPrograms[_type2] = 0;
      }
      for (var _i3 = 0, _l3 = edges.length; _i3 < _l3; _i3++) {
        var _edge = edges[_i3];
        edgeIndices[_edge] = incrID;
        itemIDsIndex[edgeIndices[_edge]] = {
          type: "edge",
          id: _edge
        };
        incrID++;
        var _data3 = this.edgeDataCache[_edge];
        this.addEdgeToProgram(_edge, edgeIndices[_edge], edgesPerPrograms[_data3.type]++);
      }
      this.itemIDsIndex = itemIDsIndex;
      this.nodeIndices = nodeIndices;
      this.edgeIndices = edgeIndices;
      this.emit("afterProcess");
      return this;
    }
    /**
     * Method that backports potential settings updates where it's needed.
     * @private
     */
  }, {
    key: "handleSettingsUpdate",
    value: function handleSettingsUpdate(oldSettings) {
      var _this6 = this;
      var settings = this.settings;
      this.camera.minRatio = settings.minCameraRatio;
      this.camera.maxRatio = settings.maxCameraRatio;
      this.camera.enabledZooming = settings.enableCameraZooming;
      this.camera.enabledPanning = settings.enableCameraPanning;
      this.camera.enabledRotation = settings.enableCameraRotation;
      if (settings.cameraPanBoundaries) {
        this.camera.clean = function(state) {
          return _this6.cleanCameraState(state, settings.cameraPanBoundaries && _typeof(settings.cameraPanBoundaries) === "object" ? settings.cameraPanBoundaries : {});
        };
      } else {
        this.camera.clean = null;
      }
      this.camera.setState(this.camera.validateState(this.camera.getState()));
      if (oldSettings) {
        if (oldSettings.edgeProgramClasses !== settings.edgeProgramClasses) {
          for (var type in settings.edgeProgramClasses) {
            if (settings.edgeProgramClasses[type] !== oldSettings.edgeProgramClasses[type]) {
              this.registerEdgeProgram(type, settings.edgeProgramClasses[type]);
            }
          }
          for (var _type3 in oldSettings.edgeProgramClasses) {
            if (!settings.edgeProgramClasses[_type3]) this.unregisterEdgeProgram(_type3);
          }
        }
        if (oldSettings.nodeProgramClasses !== settings.nodeProgramClasses || oldSettings.nodeHoverProgramClasses !== settings.nodeHoverProgramClasses) {
          for (var _type4 in settings.nodeProgramClasses) {
            if (settings.nodeProgramClasses[_type4] !== oldSettings.nodeProgramClasses[_type4] || settings.nodeHoverProgramClasses[_type4] !== oldSettings.nodeHoverProgramClasses[_type4]) {
              this.registerNodeProgram(_type4, settings.nodeProgramClasses[_type4], settings.nodeHoverProgramClasses[_type4]);
            }
          }
          for (var _type5 in oldSettings.nodeProgramClasses) {
            if (!settings.nodeProgramClasses[_type5]) this.unregisterNodeProgram(_type5);
          }
        }
      }
      this.mouseCaptor.setSettings(this.settings);
      this.touchCaptor.setSettings(this.settings);
      return this;
    }
  }, {
    key: "cleanCameraState",
    value: function cleanCameraState(state) {
      var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$tolerance = _ref.tolerance, tolerance = _ref$tolerance === void 0 ? 0 : _ref$tolerance, boundaries = _ref.boundaries;
      var newState = _objectSpread2({}, state);
      var _ref2 = boundaries || this.nodeExtent, _ref2$x = _slicedToArray(_ref2.x, 2), xMinGraph = _ref2$x[0], xMaxGraph = _ref2$x[1], _ref2$y = _slicedToArray(_ref2.y, 2), yMinGraph = _ref2$y[0], yMaxGraph = _ref2$y[1];
      var corners = [this.graphToViewport({
        x: xMinGraph,
        y: yMinGraph
      }, {
        cameraState: state
      }), this.graphToViewport({
        x: xMaxGraph,
        y: yMinGraph
      }, {
        cameraState: state
      }), this.graphToViewport({
        x: xMinGraph,
        y: yMaxGraph
      }, {
        cameraState: state
      }), this.graphToViewport({
        x: xMaxGraph,
        y: yMaxGraph
      }, {
        cameraState: state
      })];
      var xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
      corners.forEach(function(_ref3) {
        var x = _ref3.x, y = _ref3.y;
        xMin = Math.min(xMin, x);
        xMax = Math.max(xMax, x);
        yMin = Math.min(yMin, y);
        yMax = Math.max(yMax, y);
      });
      var graphWidth = xMax - xMin;
      var graphHeight = yMax - yMin;
      var _this$getDimensions = this.getDimensions(), width = _this$getDimensions.width, height = _this$getDimensions.height;
      var dx = 0;
      var dy = 0;
      if (graphWidth >= width) {
        if (xMax < width - tolerance) dx = xMax - (width - tolerance);
        else if (xMin > tolerance) dx = xMin - tolerance;
      } else {
        if (xMax > width + tolerance) dx = xMax - (width + tolerance);
        else if (xMin < -tolerance) dx = xMin + tolerance;
      }
      if (graphHeight >= height) {
        if (yMax < height - tolerance) dy = yMax - (height - tolerance);
        else if (yMin > tolerance) dy = yMin - tolerance;
      } else {
        if (yMax > height + tolerance) dy = yMax - (height + tolerance);
        else if (yMin < -tolerance) dy = yMin + tolerance;
      }
      if (dx || dy) {
        var origin = this.viewportToFramedGraph({
          x: 0,
          y: 0
        }, {
          cameraState: state
        });
        var delta = this.viewportToFramedGraph({
          x: dx,
          y: dy
        }, {
          cameraState: state
        });
        dx = delta.x - origin.x;
        dy = delta.y - origin.y;
        newState.x += dx;
        newState.y += dy;
      }
      return newState;
    }
    /**
     * Method used to render labels.
     *
     * @return {Sigma}
     */
  }, {
    key: "renderLabels",
    value: function renderLabels() {
      if (!this.settings.renderLabels) return this;
      var cameraState = this.camera.getState();
      var labelsToDisplay = this.labelGrid.getLabelsToDisplay(cameraState.ratio, this.settings.labelDensity);
      extend(labelsToDisplay, this.nodesWithForcedLabels);
      this.displayedNodeLabels = /* @__PURE__ */ new Set();
      var context = this.canvasContexts.labels;
      for (var i = 0, l = labelsToDisplay.length; i < l; i++) {
        var node = labelsToDisplay[i];
        var data = this.nodeDataCache[node];
        if (this.displayedNodeLabels.has(node)) continue;
        if (data.hidden) continue;
        var _this$framedGraphToVi = this.framedGraphToViewport(data), x = _this$framedGraphToVi.x, y = _this$framedGraphToVi.y;
        var size = this.scaleSize(data.size);
        if (!data.forceLabel && size < this.settings.labelRenderedSizeThreshold) continue;
        if (x < -X_LABEL_MARGIN || x > this.width + X_LABEL_MARGIN || y < -Y_LABEL_MARGIN || y > this.height + Y_LABEL_MARGIN) continue;
        this.displayedNodeLabels.add(node);
        var defaultDrawNodeLabel = this.settings.defaultDrawNodeLabel;
        var nodeProgram = this.nodePrograms[data.type];
        var drawLabel = (nodeProgram === null || nodeProgram === void 0 ? void 0 : nodeProgram.drawLabel) || defaultDrawNodeLabel;
        drawLabel(context, _objectSpread2(_objectSpread2({
          key: node
        }, data), {}, {
          size,
          x,
          y
        }), this.settings);
      }
      return this;
    }
    /**
     * Method used to render edge labels, based on which node labels were
     * rendered.
     *
     * @return {Sigma}
     */
  }, {
    key: "renderEdgeLabels",
    value: function renderEdgeLabels() {
      if (!this.settings.renderEdgeLabels) return this;
      var context = this.canvasContexts.edgeLabels;
      context.clearRect(0, 0, this.width, this.height);
      var edgeLabelsToDisplay = edgeLabelsToDisplayFromNodes({
        graph: this.graph,
        hoveredNode: this.hoveredNode,
        displayedNodeLabels: this.displayedNodeLabels,
        highlightedNodes: this.highlightedNodes
      });
      extend(edgeLabelsToDisplay, this.edgesWithForcedLabels);
      var displayedLabels = /* @__PURE__ */ new Set();
      for (var i = 0, l = edgeLabelsToDisplay.length; i < l; i++) {
        var edge = edgeLabelsToDisplay[i], extremities = this.graph.extremities(edge), sourceData = this.nodeDataCache[extremities[0]], targetData = this.nodeDataCache[extremities[1]], edgeData = this.edgeDataCache[edge];
        if (displayedLabels.has(edge)) continue;
        if (edgeData.hidden || sourceData.hidden || targetData.hidden) {
          continue;
        }
        var defaultDrawEdgeLabel = this.settings.defaultDrawEdgeLabel;
        var edgeProgram = this.edgePrograms[edgeData.type];
        var drawLabel = (edgeProgram === null || edgeProgram === void 0 ? void 0 : edgeProgram.drawLabel) || defaultDrawEdgeLabel;
        drawLabel(context, _objectSpread2(_objectSpread2({
          key: edge
        }, edgeData), {}, {
          size: this.scaleSize(edgeData.size)
        }), _objectSpread2(_objectSpread2(_objectSpread2({
          key: extremities[0]
        }, sourceData), this.framedGraphToViewport(sourceData)), {}, {
          size: this.scaleSize(sourceData.size)
        }), _objectSpread2(_objectSpread2(_objectSpread2({
          key: extremities[1]
        }, targetData), this.framedGraphToViewport(targetData)), {}, {
          size: this.scaleSize(targetData.size)
        }), this.settings);
        displayedLabels.add(edge);
      }
      this.displayedEdgeLabels = displayedLabels;
      return this;
    }
    /**
     * Method used to render the highlighted nodes.
     *
     * @return {Sigma}
     */
  }, {
    key: "renderHighlightedNodes",
    value: function renderHighlightedNodes() {
      var _this7 = this;
      var context = this.canvasContexts.hovers;
      context.clearRect(0, 0, this.width, this.height);
      var render = function render2(node) {
        var data = _this7.nodeDataCache[node];
        var _this7$framedGraphToV = _this7.framedGraphToViewport(data), x = _this7$framedGraphToV.x, y = _this7$framedGraphToV.y;
        var size = _this7.scaleSize(data.size);
        var defaultDrawNodeHover = _this7.settings.defaultDrawNodeHover;
        var nodeProgram = _this7.nodePrograms[data.type];
        var drawHover = (nodeProgram === null || nodeProgram === void 0 ? void 0 : nodeProgram.drawHover) || defaultDrawNodeHover;
        drawHover(context, _objectSpread2(_objectSpread2({
          key: node
        }, data), {}, {
          size,
          x,
          y
        }), _this7.settings);
      };
      var nodesToRender = [];
      if (this.hoveredNode && !this.nodeDataCache[this.hoveredNode].hidden) {
        nodesToRender.push(this.hoveredNode);
      }
      this.highlightedNodes.forEach(function(node) {
        if (node !== _this7.hoveredNode) nodesToRender.push(node);
      });
      nodesToRender.forEach(function(node) {
        return render(node);
      });
      var nodesPerPrograms = {};
      nodesToRender.forEach(function(node) {
        var type2 = _this7.nodeDataCache[node].type;
        nodesPerPrograms[type2] = (nodesPerPrograms[type2] || 0) + 1;
      });
      for (var type in this.nodeHoverPrograms) {
        this.nodeHoverPrograms[type].reallocate(nodesPerPrograms[type] || 0);
        nodesPerPrograms[type] = 0;
      }
      nodesToRender.forEach(function(node) {
        var data = _this7.nodeDataCache[node];
        _this7.nodeHoverPrograms[data.type].process(0, nodesPerPrograms[data.type]++, data);
      });
      this.webGLContexts.hoverNodes.clear(this.webGLContexts.hoverNodes.COLOR_BUFFER_BIT);
      var renderParams = this.getRenderParams();
      for (var _type6 in this.nodeHoverPrograms) {
        var program = this.nodeHoverPrograms[_type6];
        program.render(renderParams);
      }
    }
    /**
     * Method used to schedule a hover render.
     *
     */
  }, {
    key: "scheduleHighlightedNodesRender",
    value: function scheduleHighlightedNodesRender() {
      var _this8 = this;
      if (this.renderHighlightedNodesFrame || this.renderFrame) return;
      this.renderHighlightedNodesFrame = requestAnimationFrame(function() {
        _this8.renderHighlightedNodesFrame = null;
        _this8.renderHighlightedNodes();
        _this8.renderEdgeLabels();
      });
    }
    /**
     * Method used to render.
     *
     * @return {Sigma}
     */
  }, {
    key: "render",
    value: function render() {
      var _this9 = this;
      this.emit("beforeRender");
      var exitRender = function exitRender2() {
        _this9.emit("afterRender");
        return _this9;
      };
      if (this.renderFrame) {
        cancelAnimationFrame(this.renderFrame);
        this.renderFrame = null;
      }
      this.resize();
      if (this.needToProcess) this.process();
      this.needToProcess = false;
      this.clear();
      this.pickingLayers.forEach(function(layer) {
        return _this9.resetWebGLTexture(layer);
      });
      if (!this.graph.order) return exitRender();
      var mouseCaptor = this.mouseCaptor;
      var moving = this.camera.isAnimated() || mouseCaptor.isMoving || mouseCaptor.draggedEvents || mouseCaptor.currentWheelDirection;
      var cameraState = this.camera.getState();
      var viewportDimensions = this.getDimensions();
      var graphDimensions = this.getGraphDimensions();
      var padding = this.getStagePadding();
      this.matrix = matrixFromCamera(cameraState, viewportDimensions, graphDimensions, padding);
      this.invMatrix = matrixFromCamera(cameraState, viewportDimensions, graphDimensions, padding, true);
      this.correctionRatio = getMatrixImpact(this.matrix, cameraState, viewportDimensions);
      this.graphToViewportRatio = this.getGraphToViewportRatio();
      var params = this.getRenderParams();
      for (var type in this.nodePrograms) {
        var program = this.nodePrograms[type];
        program.render(params);
      }
      if (!this.settings.hideEdgesOnMove || !moving) {
        for (var _type7 in this.edgePrograms) {
          var _program2 = this.edgePrograms[_type7];
          _program2.render(params);
        }
      }
      if (this.settings.hideLabelsOnMove && moving) return exitRender();
      this.renderLabels();
      this.renderEdgeLabels();
      this.renderHighlightedNodes();
      return exitRender();
    }
    /**
     * Add a node in the internal data structures.
     * @private
     * @param key The node's graphology ID
     */
  }, {
    key: "addNode",
    value: function addNode(key) {
      var attr = Object.assign({}, this.graph.getNodeAttributes(key));
      if (this.settings.nodeReducer) attr = this.settings.nodeReducer(key, attr);
      var data = applyNodeDefaults(this.settings, key, attr);
      this.nodeDataCache[key] = data;
      this.nodesWithForcedLabels["delete"](key);
      if (data.forceLabel && !data.hidden) this.nodesWithForcedLabels.add(key);
      this.highlightedNodes["delete"](key);
      if (data.highlighted && !data.hidden) this.highlightedNodes.add(key);
      if (this.settings.zIndex) {
        if (data.zIndex < this.nodeZExtent[0]) this.nodeZExtent[0] = data.zIndex;
        if (data.zIndex > this.nodeZExtent[1]) this.nodeZExtent[1] = data.zIndex;
      }
    }
    /**
     * Update a node the internal data structures.
     * @private
     * @param key The node's graphology ID
     */
  }, {
    key: "updateNode",
    value: function updateNode(key) {
      this.addNode(key);
      var data = this.nodeDataCache[key];
      this.normalizationFunction.applyTo(data);
    }
    /**
     * Remove a node from the internal data structures.
     * @private
     * @param key The node's graphology ID
     */
  }, {
    key: "removeNode",
    value: function removeNode(key) {
      delete this.nodeDataCache[key];
      delete this.nodeProgramIndex[key];
      this.highlightedNodes["delete"](key);
      if (this.hoveredNode === key) this.hoveredNode = null;
      this.nodesWithForcedLabels["delete"](key);
    }
    /**
     * Add an edge into the internal data structures.
     * @private
     * @param key The edge's graphology ID
     */
  }, {
    key: "addEdge",
    value: function addEdge(key) {
      var attr = Object.assign({}, this.graph.getEdgeAttributes(key));
      if (this.settings.edgeReducer) attr = this.settings.edgeReducer(key, attr);
      var data = applyEdgeDefaults(this.settings, key, attr);
      this.edgeDataCache[key] = data;
      this.edgesWithForcedLabels["delete"](key);
      if (data.forceLabel && !data.hidden) this.edgesWithForcedLabels.add(key);
      if (this.settings.zIndex) {
        if (data.zIndex < this.edgeZExtent[0]) this.edgeZExtent[0] = data.zIndex;
        if (data.zIndex > this.edgeZExtent[1]) this.edgeZExtent[1] = data.zIndex;
      }
    }
    /**
     * Update an edge in the internal data structures.
     * @private
     * @param key The edge's graphology ID
     */
  }, {
    key: "updateEdge",
    value: function updateEdge(key) {
      this.addEdge(key);
    }
    /**
     * Remove an edge from the internal data structures.
     * @private
     * @param key The edge's graphology ID
     */
  }, {
    key: "removeEdge",
    value: function removeEdge(key) {
      delete this.edgeDataCache[key];
      delete this.edgeProgramIndex[key];
      if (this.hoveredEdge === key) this.hoveredEdge = null;
      this.edgesWithForcedLabels["delete"](key);
    }
    /**
     * Clear all indices related to nodes.
     * @private
     */
  }, {
    key: "clearNodeIndices",
    value: function clearNodeIndices() {
      this.labelGrid = new LabelGrid();
      this.nodeExtent = {
        x: [0, 1],
        y: [0, 1]
      };
      this.nodeDataCache = {};
      this.edgeProgramIndex = {};
      this.nodesWithForcedLabels = /* @__PURE__ */ new Set();
      this.nodeZExtent = [Infinity, -Infinity];
      this.highlightedNodes = /* @__PURE__ */ new Set();
    }
    /**
     * Clear all indices related to edges.
     * @private
     */
  }, {
    key: "clearEdgeIndices",
    value: function clearEdgeIndices() {
      this.edgeDataCache = {};
      this.edgeProgramIndex = {};
      this.edgesWithForcedLabels = /* @__PURE__ */ new Set();
      this.edgeZExtent = [Infinity, -Infinity];
    }
    /**
     * Clear all indices.
     * @private
     */
  }, {
    key: "clearIndices",
    value: function clearIndices() {
      this.clearEdgeIndices();
      this.clearNodeIndices();
    }
    /**
     * Clear all graph state related to nodes.
     * @private
     */
  }, {
    key: "clearNodeState",
    value: function clearNodeState() {
      this.displayedNodeLabels = /* @__PURE__ */ new Set();
      this.highlightedNodes = /* @__PURE__ */ new Set();
      this.hoveredNode = null;
    }
    /**
     * Clear all graph state related to edges.
     * @private
     */
  }, {
    key: "clearEdgeState",
    value: function clearEdgeState() {
      this.displayedEdgeLabels = /* @__PURE__ */ new Set();
      this.highlightedNodes = /* @__PURE__ */ new Set();
      this.hoveredEdge = null;
    }
    /**
     * Clear all graph state.
     * @private
     */
  }, {
    key: "clearState",
    value: function clearState() {
      this.clearEdgeState();
      this.clearNodeState();
    }
    /**
     * Add the node data to its program.
     * @private
     * @param node The node's graphology ID
     * @param fingerprint A fingerprint used to identity the node with picking
     * @param position The index where to place the node in the program
     */
  }, {
    key: "addNodeToProgram",
    value: function addNodeToProgram(node, fingerprint, position) {
      var data = this.nodeDataCache[node];
      var nodeProgram = this.nodePrograms[data.type];
      if (!nodeProgram) throw new Error('Sigma: could not find a suitable program for node type "'.concat(data.type, '"!'));
      nodeProgram.process(fingerprint, position, data);
      this.nodeProgramIndex[node] = position;
    }
    /**
     * Add the edge data to its program.
     * @private
     * @param edge The edge's graphology ID
     * @param fingerprint A fingerprint used to identity the edge with picking
     * @param position The index where to place the edge in the program
     */
  }, {
    key: "addEdgeToProgram",
    value: function addEdgeToProgram(edge, fingerprint, position) {
      var data = this.edgeDataCache[edge];
      var edgeProgram = this.edgePrograms[data.type];
      if (!edgeProgram) throw new Error('Sigma: could not find a suitable program for edge type "'.concat(data.type, '"!'));
      var extremities = this.graph.extremities(edge), sourceData = this.nodeDataCache[extremities[0]], targetData = this.nodeDataCache[extremities[1]];
      edgeProgram.process(fingerprint, position, sourceData, targetData, data);
      this.edgeProgramIndex[edge] = position;
    }
    /**---------------------------------------------------------------------------
     * Public API.
     **---------------------------------------------------------------------------
     */
    /**
     * Function used to get the render params.
     *
     * @return {RenderParams}
     */
  }, {
    key: "getRenderParams",
    value: function getRenderParams() {
      return {
        matrix: this.matrix,
        invMatrix: this.invMatrix,
        width: this.width,
        height: this.height,
        pixelRatio: this.pixelRatio,
        zoomRatio: this.camera.ratio,
        cameraAngle: this.camera.angle,
        sizeRatio: 1 / this.scaleSize(),
        correctionRatio: this.correctionRatio,
        downSizingRatio: this.pickingDownSizingRatio,
        minEdgeThickness: this.settings.minEdgeThickness,
        antiAliasingFeather: this.settings.antiAliasingFeather
      };
    }
    /**
     * Function used to retrieve the actual stage padding value.
     *
     * @return {number}
     */
  }, {
    key: "getStagePadding",
    value: function getStagePadding() {
      var _this$settings = this.settings, stagePadding = _this$settings.stagePadding, autoRescale = _this$settings.autoRescale;
      return autoRescale ? stagePadding || 0 : 0;
    }
    /**
     * Function used to create a layer element.
     *
     * @param {string} id - Context's id.
     * @param {string} tag - The HTML tag to use.
     * @param options
     * @return {Sigma}
     */
  }, {
    key: "createLayer",
    value: function createLayer(id, tag) {
      var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (this.elements[id]) throw new Error('Sigma: a layer named "'.concat(id, '" already exists'));
      var element = createElement(tag, {
        position: "absolute"
      }, {
        "class": "sigma-".concat(id)
      });
      if (options.style) Object.assign(element.style, options.style);
      this.elements[id] = element;
      if ("beforeLayer" in options && options.beforeLayer) {
        this.elements[options.beforeLayer].before(element);
      } else if ("afterLayer" in options && options.afterLayer) {
        this.elements[options.afterLayer].after(element);
      } else {
        this.container.appendChild(element);
      }
      return element;
    }
    /**
     * Function used to create a canvas element.
     *
     * @param {string} id - Context's id.
     * @param options
     * @return {Sigma}
     */
  }, {
    key: "createCanvas",
    value: function createCanvas(id) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.createLayer(id, "canvas", options);
    }
    /**
     * Function used to create a canvas context and add the relevant DOM elements.
     *
     * @param  {string} id - Context's id.
     * @param  options
     * @return {Sigma}
     */
  }, {
    key: "createCanvasContext",
    value: function createCanvasContext(id) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var canvas = this.createCanvas(id, options);
      var contextOptions = {
        preserveDrawingBuffer: false,
        antialias: false
      };
      this.canvasContexts[id] = canvas.getContext("2d", contextOptions);
      return this;
    }
    /**
     * Function used to create a WebGL context and add the relevant DOM
     * elements.
     *
     * @param  {string}  id      - Context's id.
     * @param  {object?} options - #getContext params to override (optional)
     * @return {WebGLRenderingContext}
     */
  }, {
    key: "createWebGLContext",
    value: function createWebGLContext(id) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var canvas = (options === null || options === void 0 ? void 0 : options.canvas) || this.createCanvas(id, options);
      if (options.hidden) canvas.remove();
      var contextOptions = _objectSpread2({
        preserveDrawingBuffer: false,
        antialias: false
      }, options);
      var context;
      context = canvas.getContext("webgl2", contextOptions);
      if (!context) context = canvas.getContext("webgl", contextOptions);
      if (!context) context = canvas.getContext("experimental-webgl", contextOptions);
      var gl = context;
      this.webGLContexts[id] = gl;
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      if (options.picking) {
        this.pickingLayers.add(id);
        var newFrameBuffer = gl.createFramebuffer();
        if (!newFrameBuffer) throw new Error("Sigma: cannot create a new frame buffer for layer ".concat(id));
        this.frameBuffers[id] = newFrameBuffer;
      }
      return gl;
    }
    /**
     * Function used to properly kill a layer.
     *
     * @param  {string} id - Layer id.
     * @return {Sigma}
     */
  }, {
    key: "killLayer",
    value: function killLayer(id) {
      var element = this.elements[id];
      if (!element) throw new Error("Sigma: cannot kill layer ".concat(id, ", which does not exist"));
      if (this.webGLContexts[id]) {
        var _gl$getExtension;
        var gl = this.webGLContexts[id];
        (_gl$getExtension = gl.getExtension("WEBGL_lose_context")) === null || _gl$getExtension === void 0 || _gl$getExtension.loseContext();
        delete this.webGLContexts[id];
      } else if (this.canvasContexts[id]) {
        delete this.canvasContexts[id];
      }
      element.remove();
      delete this.elements[id];
      return this;
    }
    /**
     * Method returning the renderer's camera.
     *
     * @return {Camera}
     */
  }, {
    key: "getCamera",
    value: function getCamera() {
      return this.camera;
    }
    /**
     * Method setting the renderer's camera.
     *
     * @param  {Camera} camera - New camera.
     * @return {Sigma}
     */
  }, {
    key: "setCamera",
    value: function setCamera(camera) {
      this.unbindCameraHandlers();
      this.camera = camera;
      this.bindCameraHandlers();
    }
    /**
     * Method returning the container DOM element.
     *
     * @return {HTMLElement}
     */
  }, {
    key: "getContainer",
    value: function getContainer() {
      return this.container;
    }
    /**
     * Method returning the renderer's graph.
     *
     * @return {Graph}
     */
  }, {
    key: "getGraph",
    value: function getGraph() {
      return this.graph;
    }
    /**
     * Method used to set the renderer's graph.
     *
     * @return {Graph}
     */
  }, {
    key: "setGraph",
    value: function setGraph(graph) {
      if (graph === this.graph) return;
      if (this.hoveredNode && !graph.hasNode(this.hoveredNode)) this.hoveredNode = null;
      if (this.hoveredEdge && !graph.hasEdge(this.hoveredEdge)) this.hoveredEdge = null;
      this.unbindGraphHandlers();
      if (this.checkEdgesEventsFrame !== null) {
        cancelAnimationFrame(this.checkEdgesEventsFrame);
        this.checkEdgesEventsFrame = null;
      }
      this.graph = graph;
      this.bindGraphHandlers();
      this.refresh();
    }
    /**
     * Method returning the mouse captor.
     *
     * @return {MouseCaptor}
     */
  }, {
    key: "getMouseCaptor",
    value: function getMouseCaptor() {
      return this.mouseCaptor;
    }
    /**
     * Method returning the touch captor.
     *
     * @return {TouchCaptor}
     */
  }, {
    key: "getTouchCaptor",
    value: function getTouchCaptor() {
      return this.touchCaptor;
    }
    /**
     * Method returning the current renderer's dimensions.
     *
     * @return {Dimensions}
     */
  }, {
    key: "getDimensions",
    value: function getDimensions() {
      return {
        width: this.width,
        height: this.height
      };
    }
    /**
     * Method returning the current graph's dimensions.
     *
     * @return {Dimensions}
     */
  }, {
    key: "getGraphDimensions",
    value: function getGraphDimensions() {
      var extent = this.customBBox || this.nodeExtent;
      return {
        width: extent.x[1] - extent.x[0] || 1,
        height: extent.y[1] - extent.y[0] || 1
      };
    }
    /**
     * Method used to get all the sigma node attributes.
     * It's useful for example to get the position of a node
     * and to get values that are set by the nodeReducer
     *
     * @param  {string} key - The node's key.
     * @return {NodeDisplayData | undefined} A copy of the desired node's attribute or undefined if not found
     */
  }, {
    key: "getNodeDisplayData",
    value: function getNodeDisplayData(key) {
      var node = this.nodeDataCache[key];
      return node ? Object.assign({}, node) : void 0;
    }
    /**
     * Method used to get all the sigma edge attributes.
     * It's useful for example to get values that are set by the edgeReducer.
     *
     * @param  {string} key - The edge's key.
     * @return {EdgeDisplayData | undefined} A copy of the desired edge's attribute or undefined if not found
     */
  }, {
    key: "getEdgeDisplayData",
    value: function getEdgeDisplayData(key) {
      var edge = this.edgeDataCache[key];
      return edge ? Object.assign({}, edge) : void 0;
    }
    /**
     * Method used to get the set of currently displayed node labels.
     *
     * @return {Set<string>} A set of node keys whose label is displayed.
     */
  }, {
    key: "getNodeDisplayedLabels",
    value: function getNodeDisplayedLabels() {
      return new Set(this.displayedNodeLabels);
    }
    /**
     * Method used to get the set of currently displayed edge labels.
     *
     * @return {Set<string>} A set of edge keys whose label is displayed.
     */
  }, {
    key: "getEdgeDisplayedLabels",
    value: function getEdgeDisplayedLabels() {
      return new Set(this.displayedEdgeLabels);
    }
    /**
     * Method returning a copy of the settings collection.
     *
     * @return {Settings} A copy of the settings collection.
     */
  }, {
    key: "getSettings",
    value: function getSettings() {
      return _objectSpread2({}, this.settings);
    }
    /**
     * Method returning the current value for a given setting key.
     *
     * @param  {string} key - The setting key to get.
     * @return {any} The value attached to this setting key or undefined if not found
     */
  }, {
    key: "getSetting",
    value: function getSetting(key) {
      return this.settings[key];
    }
    /**
     * Method setting the value of a given setting key. Note that this will schedule
     * a new render next frame.
     *
     * @param  {string} key - The setting key to set.
     * @param  {any}    value - The value to set.
     * @return {Sigma}
     */
  }, {
    key: "setSetting",
    value: function setSetting(key, value) {
      var oldValues = _objectSpread2({}, this.settings);
      this.settings[key] = value;
      validateSettings(this.settings);
      this.handleSettingsUpdate(oldValues);
      this.scheduleRefresh();
      return this;
    }
    /**
     * Method updating the value of a given setting key using the provided function.
     * Note that this will schedule a new render next frame.
     *
     * @param  {string}   key     - The setting key to set.
     * @param  {function} updater - The update function.
     * @return {Sigma}
     */
  }, {
    key: "updateSetting",
    value: function updateSetting(key, updater) {
      this.setSetting(key, updater(this.settings[key]));
      return this;
    }
    /**
     * Method setting multiple settings at once.
     *
     * @param  {Partial<Settings>} settings - The settings to set.
     * @return {Sigma}
     */
  }, {
    key: "setSettings",
    value: function setSettings(settings) {
      var oldValues = _objectSpread2({}, this.settings);
      this.settings = _objectSpread2(_objectSpread2({}, this.settings), settings);
      validateSettings(this.settings);
      this.handleSettingsUpdate(oldValues);
      this.scheduleRefresh();
      return this;
    }
    /**
     * Method used to resize the renderer.
     *
     * @param  {boolean} force - If true, then resize is processed even if size is unchanged (optional).
     * @return {Sigma}
     */
  }, {
    key: "resize",
    value: function resize(force) {
      var previousWidth = this.width, previousHeight = this.height;
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;
      this.pixelRatio = getPixelRatio();
      if (this.width === 0) {
        if (this.settings.allowInvalidContainer) this.width = 1;
        else throw new Error("Sigma: Container has no width. You can set the allowInvalidContainer setting to true to stop seeing this error.");
      }
      if (this.height === 0) {
        if (this.settings.allowInvalidContainer) this.height = 1;
        else throw new Error("Sigma: Container has no height. You can set the allowInvalidContainer setting to true to stop seeing this error.");
      }
      if (!force && previousWidth === this.width && previousHeight === this.height) return this;
      for (var id in this.elements) {
        var element = this.elements[id];
        element.style.width = this.width + "px";
        element.style.height = this.height + "px";
      }
      for (var _id in this.canvasContexts) {
        this.elements[_id].setAttribute("width", this.width * this.pixelRatio + "px");
        this.elements[_id].setAttribute("height", this.height * this.pixelRatio + "px");
        if (this.pixelRatio !== 1) this.canvasContexts[_id].scale(this.pixelRatio, this.pixelRatio);
      }
      for (var _id2 in this.webGLContexts) {
        this.elements[_id2].setAttribute("width", this.width * this.pixelRatio + "px");
        this.elements[_id2].setAttribute("height", this.height * this.pixelRatio + "px");
        var gl = this.webGLContexts[_id2];
        gl.viewport(0, 0, this.width * this.pixelRatio, this.height * this.pixelRatio);
        if (this.pickingLayers.has(_id2)) {
          var currentTexture = this.textures[_id2];
          if (currentTexture) gl.deleteTexture(currentTexture);
        }
      }
      this.emit("resize");
      return this;
    }
    /**
     * Method used to clear all the canvases.
     *
     * @return {Sigma}
     */
  }, {
    key: "clear",
    value: function clear() {
      this.emit("beforeClear");
      this.webGLContexts.nodes.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
      this.webGLContexts.nodes.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
      this.webGLContexts.edges.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
      this.webGLContexts.edges.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
      this.webGLContexts.hoverNodes.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
      this.canvasContexts.labels.clearRect(0, 0, this.width, this.height);
      this.canvasContexts.hovers.clearRect(0, 0, this.width, this.height);
      this.canvasContexts.edgeLabels.clearRect(0, 0, this.width, this.height);
      this.emit("afterClear");
      return this;
    }
    /**
     * Method used to refresh, i.e. force the renderer to reprocess graph
     * data and render, but keep the state.
     * - if a partialGraph is provided, we only reprocess those nodes & edges.
     * - if schedule is TRUE, we schedule a render instead of sync render
     * - if skipIndexation is TRUE, then labelGrid & program indexation are skipped (can be used if you haven't modify x, y, zIndex & size)
     *
     * @return {Sigma}
     */
  }, {
    key: "refresh",
    value: function refresh(opts) {
      var _this10 = this;
      var skipIndexation = (opts === null || opts === void 0 ? void 0 : opts.skipIndexation) !== void 0 ? opts === null || opts === void 0 ? void 0 : opts.skipIndexation : false;
      var schedule = (opts === null || opts === void 0 ? void 0 : opts.schedule) !== void 0 ? opts.schedule : false;
      var fullRefresh = !opts || !opts.partialGraph;
      if (fullRefresh) {
        this.clearEdgeIndices();
        this.clearNodeIndices();
        this.graph.forEachNode(function(node2) {
          return _this10.addNode(node2);
        });
        this.graph.forEachEdge(function(edge2) {
          return _this10.addEdge(edge2);
        });
      } else {
        var _opts$partialGraph, _opts$partialGraph2;
        var nodes = ((_opts$partialGraph = opts.partialGraph) === null || _opts$partialGraph === void 0 ? void 0 : _opts$partialGraph.nodes) || [];
        for (var i = 0, l = (nodes === null || nodes === void 0 ? void 0 : nodes.length) || 0; i < l; i++) {
          var node = nodes[i];
          this.updateNode(node);
          if (skipIndexation) {
            var programIndex = this.nodeProgramIndex[node];
            if (programIndex === void 0) throw new Error('Sigma: node "'.concat(node, `" can't be repaint`));
            this.addNodeToProgram(node, this.nodeIndices[node], programIndex);
          }
        }
        var edges = (opts === null || opts === void 0 || (_opts$partialGraph2 = opts.partialGraph) === null || _opts$partialGraph2 === void 0 ? void 0 : _opts$partialGraph2.edges) || [];
        for (var _i4 = 0, _l4 = edges.length; _i4 < _l4; _i4++) {
          var edge = edges[_i4];
          this.updateEdge(edge);
          if (skipIndexation) {
            var _programIndex = this.edgeProgramIndex[edge];
            if (_programIndex === void 0) throw new Error('Sigma: edge "'.concat(edge, `" can't be repaint`));
            this.addEdgeToProgram(edge, this.edgeIndices[edge], _programIndex);
          }
        }
      }
      if (fullRefresh || !skipIndexation) this.needToProcess = true;
      if (schedule) this.scheduleRender();
      else this.render();
      return this;
    }
    /**
     * Method used to schedule a render at the next available frame.
     * This method can be safely called on a same frame because it basically
     * debounces refresh to the next frame.
     *
     * @return {Sigma}
     */
  }, {
    key: "scheduleRender",
    value: function scheduleRender() {
      var _this11 = this;
      if (!this.renderFrame) {
        this.renderFrame = requestAnimationFrame(function() {
          _this11.render();
        });
      }
      return this;
    }
    /**
     * Method used to schedule a refresh (i.e. fully reprocess graph data and render)
     * at the next available frame.
     * This method can be safely called on a same frame because it basically
     * debounces refresh to the next frame.
     *
     * @return {Sigma}
     */
  }, {
    key: "scheduleRefresh",
    value: function scheduleRefresh(opts) {
      return this.refresh(_objectSpread2(_objectSpread2({}, opts), {}, {
        schedule: true
      }));
    }
    /**
     * Method used to (un)zoom, while preserving the position of a viewport point.
     * Used for instance to zoom "on the mouse cursor".
     *
     * @param viewportTarget
     * @param newRatio
     * @return {CameraState}
     */
  }, {
    key: "getViewportZoomedState",
    value: function getViewportZoomedState(viewportTarget, newRatio) {
      var _this$camera$getState = this.camera.getState(), ratio = _this$camera$getState.ratio, angle = _this$camera$getState.angle, x = _this$camera$getState.x, y = _this$camera$getState.y;
      var _this$settings2 = this.settings, minCameraRatio = _this$settings2.minCameraRatio, maxCameraRatio = _this$settings2.maxCameraRatio;
      if (typeof maxCameraRatio === "number") newRatio = Math.min(newRatio, maxCameraRatio);
      if (typeof minCameraRatio === "number") newRatio = Math.max(newRatio, minCameraRatio);
      var ratioDiff = newRatio / ratio;
      var center = {
        x: this.width / 2,
        y: this.height / 2
      };
      var graphMousePosition = this.viewportToFramedGraph(viewportTarget);
      var graphCenterPosition = this.viewportToFramedGraph(center);
      return {
        angle,
        x: (graphMousePosition.x - graphCenterPosition.x) * (1 - ratioDiff) + x,
        y: (graphMousePosition.y - graphCenterPosition.y) * (1 - ratioDiff) + y,
        ratio: newRatio
      };
    }
    /**
     * Method returning the abstract rectangle containing the graph according
     * to the camera's state.
     *
     * @return {object} - The view's rectangle.
     */
  }, {
    key: "viewRectangle",
    value: function viewRectangle() {
      var p1 = this.viewportToFramedGraph({
        x: 0,
        y: 0
      }), p2 = this.viewportToFramedGraph({
        x: this.width,
        y: 0
      }), h = this.viewportToFramedGraph({
        x: 0,
        y: this.height
      });
      return {
        x1: p1.x,
        y1: p1.y,
        x2: p2.x,
        y2: p2.y,
        height: p2.y - h.y
      };
    }
    /**
     * Method returning the coordinates of a point from the framed graph system to the viewport system. It allows
     * overriding anything that is used to get the translation matrix, or even the matrix itself.
     *
     * Be careful if overriding dimensions, padding or cameraState, as the computation of the matrix is not the lightest
     * of computations.
     */
  }, {
    key: "framedGraphToViewport",
    value: function framedGraphToViewport(coordinates) {
      var override = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var recomputeMatrix = !!override.cameraState || !!override.viewportDimensions || !!override.graphDimensions;
      var matrix = override.matrix ? override.matrix : recomputeMatrix ? matrixFromCamera(override.cameraState || this.camera.getState(), override.viewportDimensions || this.getDimensions(), override.graphDimensions || this.getGraphDimensions(), override.padding || this.getStagePadding()) : this.matrix;
      var viewportPos = multiplyVec2(matrix, coordinates);
      return {
        x: (1 + viewportPos.x) * this.width / 2,
        y: (1 - viewportPos.y) * this.height / 2
      };
    }
    /**
     * Method returning the coordinates of a point from the viewport system to the framed graph system. It allows
     * overriding anything that is used to get the translation matrix, or even the matrix itself.
     *
     * Be careful if overriding dimensions, padding or cameraState, as the computation of the matrix is not the lightest
     * of computations.
     */
  }, {
    key: "viewportToFramedGraph",
    value: function viewportToFramedGraph(coordinates) {
      var override = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var recomputeMatrix = !!override.cameraState || !!override.viewportDimensions || !override.graphDimensions;
      var invMatrix = override.matrix ? override.matrix : recomputeMatrix ? matrixFromCamera(override.cameraState || this.camera.getState(), override.viewportDimensions || this.getDimensions(), override.graphDimensions || this.getGraphDimensions(), override.padding || this.getStagePadding(), true) : this.invMatrix;
      var res = multiplyVec2(invMatrix, {
        x: coordinates.x / this.width * 2 - 1,
        y: 1 - coordinates.y / this.height * 2
      });
      if (isNaN(res.x)) res.x = 0;
      if (isNaN(res.y)) res.y = 0;
      return res;
    }
    /**
     * Method used to translate a point's coordinates from the viewport system (pixel distance from the top-left of the
     * stage) to the graph system (the reference system of data as they are in the given graph instance).
     *
     * This method accepts an optional camera which can be useful if you need to translate coordinates
     * based on a different view than the one being currently being displayed on screen.
     *
     * @param {Coordinates}                  viewportPoint
     * @param {CoordinateConversionOverride} override
     */
  }, {
    key: "viewportToGraph",
    value: function viewportToGraph(viewportPoint) {
      var override = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.normalizationFunction.inverse(this.viewportToFramedGraph(viewportPoint, override));
    }
    /**
     * Method used to translate a point's coordinates from the graph system (the reference system of data as they are in
     * the given graph instance) to the viewport system (pixel distance from the top-left of the stage).
     *
     * This method accepts an optional camera which can be useful if you need to translate coordinates
     * based on a different view than the one being currently being displayed on screen.
     *
     * @param {Coordinates}                  graphPoint
     * @param {CoordinateConversionOverride} override
     */
  }, {
    key: "graphToViewport",
    value: function graphToViewport(graphPoint) {
      var override = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.framedGraphToViewport(this.normalizationFunction(graphPoint), override);
    }
    /**
     * Method returning the distance multiplier between the graph system and the
     * viewport system.
     */
  }, {
    key: "getGraphToViewportRatio",
    value: function getGraphToViewportRatio() {
      var graphP1 = {
        x: 0,
        y: 0
      };
      var graphP2 = {
        x: 1,
        y: 1
      };
      var graphD = Math.sqrt(Math.pow(graphP1.x - graphP2.x, 2) + Math.pow(graphP1.y - graphP2.y, 2));
      var viewportP1 = this.graphToViewport(graphP1);
      var viewportP2 = this.graphToViewport(graphP2);
      var viewportD = Math.sqrt(Math.pow(viewportP1.x - viewportP2.x, 2) + Math.pow(viewportP1.y - viewportP2.y, 2));
      return viewportD / graphD;
    }
    /**
     * Method returning the graph's bounding box.
     *
     * @return {{ x: Extent, y: Extent }}
     */
  }, {
    key: "getBBox",
    value: function getBBox() {
      return this.nodeExtent;
    }
    /**
     * Method returning the graph's custom bounding box, if any.
     *
     * @return {{ x: Extent, y: Extent } | null}
     */
  }, {
    key: "getCustomBBox",
    value: function getCustomBBox() {
      return this.customBBox;
    }
    /**
     * Method used to override the graph's bounding box with a custom one. Give `null` as the argument to stop overriding.
     *
     * @return {Sigma}
     */
  }, {
    key: "setCustomBBox",
    value: function setCustomBBox(customBBox) {
      this.customBBox = customBBox;
      this.scheduleRender();
      return this;
    }
    /**
     * Method used to shut the container & release event listeners.
     *
     * @return {undefined}
     */
  }, {
    key: "kill",
    value: function kill() {
      this.emit("kill");
      this.removeAllListeners();
      this.unbindCameraHandlers();
      window.removeEventListener("resize", this.activeListeners.handleResize);
      this.mouseCaptor.kill();
      this.touchCaptor.kill();
      this.unbindGraphHandlers();
      this.clearIndices();
      this.clearState();
      this.nodeDataCache = {};
      this.edgeDataCache = {};
      this.highlightedNodes.clear();
      if (this.renderFrame) {
        cancelAnimationFrame(this.renderFrame);
        this.renderFrame = null;
      }
      if (this.renderHighlightedNodesFrame) {
        cancelAnimationFrame(this.renderHighlightedNodesFrame);
        this.renderHighlightedNodesFrame = null;
      }
      var container = this.container;
      while (container.firstChild) container.removeChild(container.firstChild);
      for (var type in this.nodePrograms) {
        this.nodePrograms[type].kill();
      }
      for (var _type8 in this.nodeHoverPrograms) {
        this.nodeHoverPrograms[_type8].kill();
      }
      for (var _type9 in this.edgePrograms) {
        this.edgePrograms[_type9].kill();
      }
      this.nodePrograms = {};
      this.nodeHoverPrograms = {};
      this.edgePrograms = {};
      for (var id in this.elements) {
        this.killLayer(id);
      }
      this.canvasContexts = {};
      this.webGLContexts = {};
      this.elements = {};
    }
    /**
     * Method used to scale the given size according to the camera's ratio, i.e.
     * zooming state.
     *
     * @param  {number?} size -        The size to scale (node size, edge thickness etc.).
     * @param  {number?} cameraRatio - A camera ratio (defaults to the actual camera ratio).
     * @return {number}              - The scaled size.
     */
  }, {
    key: "scaleSize",
    value: function scaleSize() {
      var size = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1;
      var cameraRatio = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.camera.ratio;
      return size / this.settings.zoomToSizeRatioFunction(cameraRatio) * (this.getSetting("itemSizesReference") === "positions" ? cameraRatio * this.graphToViewportRatio : 1);
    }
    /**
     * Method that returns the collection of all used canvases.
     * At the moment, the instantiated canvases are the following, and in the
     * following order in the DOM:
     * - `edges`
     * - `nodes`
     * - `edgeLabels`
     * - `labels`
     * - `hovers`
     * - `hoverNodes`
     * - `mouse`
     *
     * @return {PlainObject<HTMLCanvasElement>} - The collection of canvases.
     */
  }, {
    key: "getCanvases",
    value: function getCanvases() {
      var res = {};
      for (var layer in this.elements) if (this.elements[layer] instanceof HTMLCanvasElement) res[layer] = this.elements[layer];
      return res;
    }
  }]);
})(TypedEventEmitter);
var Sigma = Sigma$1;

// node_modules/sigma/rendering/dist/sigma-rendering.esm.js
var _WebGLRenderingContex$32 = WebGLRenderingContext;
var UNSIGNED_BYTE$32 = _WebGLRenderingContex$32.UNSIGNED_BYTE;
var FLOAT$32 = _WebGLRenderingContex$32.FLOAT;
var SHADER_SOURCE$42 = (
  /*glsl*/
  "\nattribute vec4 a_id;\nattribute vec4 a_color;\nattribute vec2 a_normal;\nattribute float a_normalCoef;\nattribute vec2 a_positionStart;\nattribute vec2 a_positionEnd;\nattribute float a_positionCoef;\nattribute float a_sourceRadius;\nattribute float a_targetRadius;\nattribute float a_sourceRadiusCoef;\nattribute float a_targetRadiusCoef;\n\nuniform mat3 u_matrix;\nuniform float u_zoomRatio;\nuniform float u_sizeRatio;\nuniform float u_pixelRatio;\nuniform float u_correctionRatio;\nuniform float u_minEdgeThickness;\nuniform float u_lengthToThicknessRatio;\nuniform float u_feather;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\nvarying float v_feather;\n\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n  float minThickness = u_minEdgeThickness;\n\n  vec2 normal = a_normal * a_normalCoef;\n  vec2 position = a_positionStart * (1.0 - a_positionCoef) + a_positionEnd * a_positionCoef;\n\n  float normalLength = length(normal);\n  vec2 unitNormal = normal / normalLength;\n\n  // These first computations are taken from edge.vert.glsl. Please read it to\n  // get better comments on what's happening:\n  float pixelsThickness = max(normalLength, minThickness * u_sizeRatio);\n  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;\n\n  // Here, we move the point to leave space for the arrow heads:\n  // Source arrow head\n  float sourceRadius = a_sourceRadius * a_sourceRadiusCoef;\n  float sourceDirection = sign(sourceRadius);\n  float webGLSourceRadius = sourceDirection * sourceRadius * 2.0 * u_correctionRatio / u_sizeRatio;\n  float webGLSourceArrowHeadLength = webGLThickness * u_lengthToThicknessRatio * 2.0;\n  vec2 sourceCompensationVector =\n    vec2(-sourceDirection * unitNormal.y, sourceDirection * unitNormal.x)\n    * (webGLSourceRadius + webGLSourceArrowHeadLength);\n    \n  // Target arrow head\n  float targetRadius = a_targetRadius * a_targetRadiusCoef;\n  float targetDirection = sign(targetRadius);\n  float webGLTargetRadius = targetDirection * targetRadius * 2.0 * u_correctionRatio / u_sizeRatio;\n  float webGLTargetArrowHeadLength = webGLThickness * u_lengthToThicknessRatio * 2.0;\n  vec2 targetCompensationVector =\n  vec2(-targetDirection * unitNormal.y, targetDirection * unitNormal.x)\n    * (webGLTargetRadius + webGLTargetArrowHeadLength);\n\n  // Here is the proper position of the vertex\n  gl_Position = vec4((u_matrix * vec3(position + unitNormal * webGLThickness + sourceCompensationVector + targetCompensationVector, 1)).xy, 0, 1);\n\n  v_thickness = webGLThickness / u_zoomRatio;\n\n  v_normal = unitNormal;\n\n  v_feather = u_feather * u_correctionRatio / u_zoomRatio / u_pixelRatio * 2.0;\n\n  #ifdef PICKING_MODE\n  // For picking mode, we use the ID as the color:\n  v_color = a_id;\n  #else\n  // For normal mode, we use the color:\n  v_color = a_color;\n  #endif\n\n  v_color.a *= bias;\n}\n"
);
var VERTEX_SHADER_SOURCE$22 = SHADER_SOURCE$42;
var _WebGLRenderingContex$22 = WebGLRenderingContext;
var UNSIGNED_BYTE$22 = _WebGLRenderingContex$22.UNSIGNED_BYTE;
var FLOAT$22 = _WebGLRenderingContex$22.FLOAT;
var UNIFORMS$22 = ["u_matrix", "u_zoomRatio", "u_sizeRatio", "u_correctionRatio", "u_pixelRatio", "u_feather", "u_minEdgeThickness", "u_lengthToThicknessRatio"];
var DEFAULT_EDGE_DOUBLE_CLAMPED_PROGRAM_OPTIONS = {
  lengthToThicknessRatio: DEFAULT_EDGE_ARROW_HEAD_PROGRAM_OPTIONS.lengthToThicknessRatio
};
function createEdgeDoubleClampedProgram(inputOptions) {
  var options = _objectSpread2(_objectSpread2({}, DEFAULT_EDGE_DOUBLE_CLAMPED_PROGRAM_OPTIONS), inputOptions || {});
  return /* @__PURE__ */ (function(_EdgeProgram) {
    function EdgeDoubleClampedProgram2() {
      _classCallCheck(this, EdgeDoubleClampedProgram2);
      return _callSuper(this, EdgeDoubleClampedProgram2, arguments);
    }
    _inherits(EdgeDoubleClampedProgram2, _EdgeProgram);
    return _createClass(EdgeDoubleClampedProgram2, [{
      key: "getDefinition",
      value: function getDefinition() {
        return {
          VERTICES: 6,
          VERTEX_SHADER_SOURCE: VERTEX_SHADER_SOURCE$22,
          FRAGMENT_SHADER_SOURCE,
          METHOD: WebGLRenderingContext.TRIANGLES,
          UNIFORMS: UNIFORMS$22,
          ATTRIBUTES: [{
            name: "a_positionStart",
            size: 2,
            type: FLOAT$22
          }, {
            name: "a_positionEnd",
            size: 2,
            type: FLOAT$22
          }, {
            name: "a_normal",
            size: 2,
            type: FLOAT$22
          }, {
            name: "a_color",
            size: 4,
            type: UNSIGNED_BYTE$22,
            normalized: true
          }, {
            name: "a_id",
            size: 4,
            type: UNSIGNED_BYTE$22,
            normalized: true
          }, {
            name: "a_sourceRadius",
            size: 1,
            type: FLOAT$22
          }, {
            name: "a_targetRadius",
            size: 1,
            type: FLOAT$22
          }],
          CONSTANT_ATTRIBUTES: [
            // If 0, then position will be a_positionStart
            // If 1, then position will be a_positionEnd
            {
              name: "a_positionCoef",
              size: 1,
              type: FLOAT$22
            },
            {
              name: "a_normalCoef",
              size: 1,
              type: FLOAT$22
            },
            {
              name: "a_sourceRadiusCoef",
              size: 1,
              type: FLOAT$22
            },
            {
              name: "a_targetRadiusCoef",
              size: 1,
              type: FLOAT$22
            }
          ],
          CONSTANT_DATA: [[0, 1, -1, 0], [0, -1, 1, 0], [1, 1, 0, 1], [1, 1, 0, 1], [0, -1, 1, 0], [1, -1, 0, -1]]
        };
      }
    }, {
      key: "processVisibleItem",
      value: function processVisibleItem(edgeIndex, startIndex, sourceData, targetData, data) {
        var thickness = data.size || 1;
        var x1 = sourceData.x;
        var y1 = sourceData.y;
        var x2 = targetData.x;
        var y2 = targetData.y;
        var color = floatColor(data.color);
        var dx = x2 - x1;
        var dy = y2 - y1;
        var sourceRadius = sourceData.size || 1;
        var targetRadius = targetData.size || 1;
        var len = dx * dx + dy * dy;
        var n1 = 0;
        var n2 = 0;
        if (len) {
          len = 1 / Math.sqrt(len);
          n1 = -dy * len * thickness;
          n2 = dx * len * thickness;
        }
        var array = this.array;
        array[startIndex++] = x1;
        array[startIndex++] = y1;
        array[startIndex++] = x2;
        array[startIndex++] = y2;
        array[startIndex++] = n1;
        array[startIndex++] = n2;
        array[startIndex++] = color;
        array[startIndex++] = edgeIndex;
        array[startIndex++] = sourceRadius;
        array[startIndex++] = targetRadius;
      }
    }, {
      key: "setUniforms",
      value: function setUniforms(params, _ref) {
        var gl = _ref.gl, uniformLocations = _ref.uniformLocations;
        var u_matrix = uniformLocations.u_matrix, u_zoomRatio = uniformLocations.u_zoomRatio, u_feather = uniformLocations.u_feather, u_pixelRatio = uniformLocations.u_pixelRatio, u_correctionRatio = uniformLocations.u_correctionRatio, u_sizeRatio = uniformLocations.u_sizeRatio, u_minEdgeThickness = uniformLocations.u_minEdgeThickness, u_lengthToThicknessRatio = uniformLocations.u_lengthToThicknessRatio;
        gl.uniformMatrix3fv(u_matrix, false, params.matrix);
        gl.uniform1f(u_zoomRatio, params.zoomRatio);
        gl.uniform1f(u_sizeRatio, params.sizeRatio);
        gl.uniform1f(u_correctionRatio, params.correctionRatio);
        gl.uniform1f(u_pixelRatio, params.pixelRatio);
        gl.uniform1f(u_feather, params.antiAliasingFeather);
        gl.uniform1f(u_minEdgeThickness, params.minEdgeThickness);
        gl.uniform1f(u_lengthToThicknessRatio, options.lengthToThicknessRatio);
      }
    }]);
  })(EdgeProgram);
}
var EdgeDoubleClampedProgram = createEdgeDoubleClampedProgram();
function createEdgeDoubleArrowProgram(inputOptions) {
  return createEdgeCompoundProgram([createEdgeDoubleClampedProgram(inputOptions), createEdgeArrowHeadProgram(inputOptions), createEdgeArrowHeadProgram(_objectSpread2(_objectSpread2({}, inputOptions), {}, {
    extremity: "source"
  }))]);
}
var EdgeDoubleArrowProgram = createEdgeDoubleArrowProgram();
var _WebGLRenderingContex$12 = WebGLRenderingContext;
var UNSIGNED_BYTE$12 = _WebGLRenderingContex$12.UNSIGNED_BYTE;
var FLOAT$12 = _WebGLRenderingContex$12.FLOAT;
var _WebGLRenderingContex2 = WebGLRenderingContext;
var UNSIGNED_BYTE2 = _WebGLRenderingContex2.UNSIGNED_BYTE;
var FLOAT2 = _WebGLRenderingContex2.FLOAT;

// node_modules/sigma/utils/dist/sigma-utils.esm.js
var import_is_graph3 = __toESM(require_is_graph());

// node_modules/@sigma/node-image/dist/sigma-node-image.esm.js
var import_events3 = __toESM(require_events());
function _arrayLikeToArray2(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithoutHoles2(r) {
  if (Array.isArray(r)) return _arrayLikeToArray2(r);
}
function _iterableToArray2(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _unsupportedIterableToArray2(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray2(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray2(r, a) : void 0;
  }
}
function _nonIterableSpread2() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toConsumableArray2(r) {
  return _arrayWithoutHoles2(r) || _iterableToArray2(r) || _unsupportedIterableToArray2(r) || _nonIterableSpread2();
}
function _classCallCheck2(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _toPrimitive2(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey2(t) {
  var i = _toPrimitive2(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _defineProperties2(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey2(o.key), o);
  }
}
function _createClass2(e, r, t) {
  return r && _defineProperties2(e.prototype, r), t && _defineProperties2(e, t), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _getPrototypeOf2(t) {
  return _getPrototypeOf2 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t2) {
    return t2.__proto__ || Object.getPrototypeOf(t2);
  }, _getPrototypeOf2(t);
}
function _isNativeReflectConstruct2() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch (t2) {
  }
  return (_isNativeReflectConstruct2 = function() {
    return !!t;
  })();
}
function _assertThisInitialized2(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _possibleConstructorReturn2(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized2(t);
}
function _callSuper2(t, o, e) {
  return o = _getPrototypeOf2(o), _possibleConstructorReturn2(t, _isNativeReflectConstruct2() ? Reflect.construct(o, e || [], _getPrototypeOf2(t).constructor) : o.apply(t, e));
}
function _superPropBase2(t, o) {
  for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf2(t)); ) ;
  return t;
}
function _get2() {
  return _get2 = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function(e, t, r) {
    var p = _superPropBase2(e, t);
    if (p) {
      var n = Object.getOwnPropertyDescriptor(p, t);
      return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value;
    }
  }, _get2.apply(null, arguments);
}
function _superPropGet2(t, o, e, r) {
  var p = _get2(_getPrototypeOf2(1 & r ? t.prototype : t), o, e);
  return 2 & r && "function" == typeof p ? function(t2) {
    return p.apply(e, t2);
  } : p;
}
function _setPrototypeOf2(t, e) {
  return _setPrototypeOf2 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t2, e2) {
    return t2.__proto__ = e2, t2;
  }, _setPrototypeOf2(t, e);
}
function _inherits2(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: true,
      configurable: true
    }
  }), Object.defineProperty(t, "prototype", {
    writable: false
  }), e && _setPrototypeOf2(t, e);
}
function _defineProperty2(e, r, t) {
  return (r = _toPropertyKey2(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _objectWithoutPropertiesLoose2(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (e.includes(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function _objectWithoutProperties2(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose2(e, t);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function ownKeys2(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread22(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys2(Object(t), true).forEach(function(r2) {
      _defineProperty2(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys2(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function getFragmentShader(_ref) {
  var texturesCount = _ref.texturesCount;
  var SHADER = (
    /*glsl*/
    "\nprecision highp float;\n\nvarying vec4 v_color;\nvarying vec2 v_diffVector;\nvarying float v_radius;\nvarying vec4 v_texture;\nvarying float v_textureIndex;\n\nuniform sampler2D u_atlas[".concat(texturesCount, "];\nuniform float u_correctionRatio;\nuniform float u_cameraAngle;\nuniform float u_percentagePadding;\nuniform bool u_colorizeImages;\nuniform bool u_keepWithinCircle;\n\nconst vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);\n\nconst float radius = 0.5;\n\nvoid main(void) {\n  float border = 2.0 * u_correctionRatio;\n  float dist = length(v_diffVector);\n  vec4 color = gl_FragColor;\n\n  float c = cos(-u_cameraAngle);\n  float s = sin(-u_cameraAngle);\n  vec2 diffVector = mat2(c, s, -s, c) * (v_diffVector);\n\n  // No antialiasing for picking mode:\n  #ifdef PICKING_MODE\n  border = 0.0;\n  color = v_color;\n\n  #else\n  // First case: No image to display\n  if (v_texture.w <= 0.0) {\n    if (!u_colorizeImages) {\n      color = v_color;\n    }\n  }\n\n  // Second case: Image loaded into the texture\n  else {\n    float paddingRatio = 1.0 + 2.0 * u_percentagePadding;\n    float coef = u_keepWithinCircle ? 1.0 : ").concat(Math.SQRT2, ";\n    vec2 coordinateInTexture = diffVector * vec2(paddingRatio, -paddingRatio) / v_radius / 2.0 * coef + vec2(0.5, 0.5);\n    int index = int(v_textureIndex + 0.5); // +0.5 avoid rounding errors\n\n    bool noTextureFound = false;\n    vec4 texel;\n\n    ").concat(_toConsumableArray2(new Array(texturesCount)).map(function(_, i) {
      return "if (index == ".concat(i, ") texel = texture2D(u_atlas[").concat(i, "], (v_texture.xy + coordinateInTexture * v_texture.zw), -1.0);");
    }).join("\n    else ") + "else {\n      texel = texture2D(u_atlas[0], (v_texture.xy + coordinateInTexture * v_texture.zw), -1.0);\n      noTextureFound = true;\n    }", '\n\n    if (noTextureFound) {\n      color = v_color;\n    } else {\n      // Colorize all visible image pixels:\n      if (u_colorizeImages) {\n        color = mix(gl_FragColor, v_color, texel.a);\n      }\n\n      // Colorize background pixels, keep image pixel colors:\n      else {\n        color = vec4(mix(v_color, texel, texel.a).rgb, max(texel.a, v_color.a));\n      }\n\n      // Erase pixels "in the padding":\n      if (abs(diffVector.x) > v_radius / paddingRatio || abs(diffVector.y) > v_radius / paddingRatio) {\n        color = u_colorizeImages ? gl_FragColor : v_color;\n      }\n    }\n  }\n  #endif\n\n  // Crop in a circle when u_keepWithinCircle is truthy:\n  if (u_keepWithinCircle) {\n    if (dist < v_radius - border) {\n      gl_FragColor = color;\n    } else if (dist < v_radius) {\n      gl_FragColor = mix(transparent, color, (v_radius - dist) / border);\n    }\n  }\n\n  // Crop in a square else:\n  else {\n    float squareHalfSize = v_radius * ').concat(Math.SQRT1_2 * Math.cos(Math.PI / 12), ";\n    if (abs(diffVector.x) > squareHalfSize || abs(diffVector.y) > squareHalfSize) {\n      gl_FragColor = transparent;\n    } else {\n      gl_FragColor = color;\n    }\n  }\n}\n")
  );
  return SHADER;
}
var VERTEX_SHADER_SOURCE2 = (
  /*glsl*/
  "\nattribute vec4 a_id;\nattribute vec4 a_color;\nattribute vec2 a_position;\nattribute float a_size;\nattribute float a_angle;\nattribute vec4 a_texture;\nattribute float a_textureIndex;\n\nuniform mat3 u_matrix;\nuniform float u_sizeRatio;\nuniform float u_correctionRatio;\n\nvarying vec4 v_color;\nvarying vec2 v_diffVector;\nvarying float v_radius;\nvarying vec4 v_texture;\nvarying float v_textureIndex;\n\nconst float bias = 255.0 / 254.0;\nconst float marginRatio = 1.05;\n\nvoid main() {\n  float size = a_size * u_correctionRatio / u_sizeRatio * 4.0;\n  vec2 diffVector = size * vec2(cos(a_angle), sin(a_angle));\n  vec2 position = a_position + diffVector * marginRatio;\n  gl_Position = vec4(\n    (u_matrix * vec3(position, 1)).xy,\n    0,\n    1\n  );\n\n  v_diffVector = diffVector;\n  v_radius = size / 2.0 / marginRatio;\n\n  #ifdef PICKING_MODE\n  // For picking mode, we use the ID as the color:\n  v_color = a_id;\n  #else\n  // For normal mode, we use the color:\n  v_color = a_color;\n\n  // Pass the texture coordinates:\n  v_textureIndex = a_textureIndex;\n  v_texture = a_texture;\n  #endif\n\n  v_color.a *= bias;\n}\n"
);
var VERTEX_SHADER_SOURCE$12 = VERTEX_SHADER_SOURCE2;
function _regeneratorRuntime() {
  _regeneratorRuntime = function() {
    return e;
  };
  var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function(t2, e2, r2) {
    t2[e2] = r2.value;
  }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag";
  function define2(t2, e2, r2) {
    return Object.defineProperty(t2, e2, {
      value: r2,
      enumerable: true,
      configurable: true,
      writable: true
    }), t2[e2];
  }
  try {
    define2({}, "");
  } catch (t2) {
    define2 = function(t3, e2, r2) {
      return t3[e2] = r2;
    };
  }
  function wrap(t2, e2, r2, n2) {
    var i2 = e2 && e2.prototype instanceof Generator ? e2 : Generator, a2 = Object.create(i2.prototype), c2 = new Context(n2 || []);
    return o(a2, "_invoke", {
      value: makeInvokeMethod(t2, r2, c2)
    }), a2;
  }
  function tryCatch(t2, e2, r2) {
    try {
      return {
        type: "normal",
        arg: t2.call(e2, r2)
      };
    } catch (t3) {
      return {
        type: "throw",
        arg: t3
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {};
  function Generator() {
  }
  function GeneratorFunction() {
  }
  function GeneratorFunctionPrototype() {
  }
  var p = {};
  define2(p, a, function() {
    return this;
  });
  var d = Object.getPrototypeOf, v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t2) {
    ["next", "throw", "return"].forEach(function(e2) {
      define2(t2, e2, function(t3) {
        return this._invoke(e2, t3);
      });
    });
  }
  function AsyncIterator(t2, e2) {
    function invoke(r3, o2, i2, a2) {
      var c2 = tryCatch(t2[r3], t2, o2);
      if ("throw" !== c2.type) {
        var u2 = c2.arg, h2 = u2.value;
        return h2 && "object" == typeof h2 && n.call(h2, "__await") ? e2.resolve(h2.__await).then(function(t3) {
          invoke("next", t3, i2, a2);
        }, function(t3) {
          invoke("throw", t3, i2, a2);
        }) : e2.resolve(h2).then(function(t3) {
          u2.value = t3, i2(u2);
        }, function(t3) {
          return invoke("throw", t3, i2, a2);
        });
      }
      a2(c2.arg);
    }
    var r2;
    o(this, "_invoke", {
      value: function(t3, n2) {
        function callInvokeWithMethodAndArg() {
          return new e2(function(e3, r3) {
            invoke(t3, n2, e3, r3);
          });
        }
        return r2 = r2 ? r2.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e2, r2, n2) {
    var o2 = h;
    return function(i2, a2) {
      if (o2 === f) throw Error("Generator is already running");
      if (o2 === s) {
        if ("throw" === i2) throw a2;
        return {
          value: t,
          done: true
        };
      }
      for (n2.method = i2, n2.arg = a2; ; ) {
        var c2 = n2.delegate;
        if (c2) {
          var u2 = maybeInvokeDelegate(c2, n2);
          if (u2) {
            if (u2 === y) continue;
            return u2;
          }
        }
        if ("next" === n2.method) n2.sent = n2._sent = n2.arg;
        else if ("throw" === n2.method) {
          if (o2 === h) throw o2 = s, n2.arg;
          n2.dispatchException(n2.arg);
        } else "return" === n2.method && n2.abrupt("return", n2.arg);
        o2 = f;
        var p2 = tryCatch(e2, r2, n2);
        if ("normal" === p2.type) {
          if (o2 = n2.done ? s : l, p2.arg === y) continue;
          return {
            value: p2.arg,
            done: n2.done
          };
        }
        "throw" === p2.type && (o2 = s, n2.method = "throw", n2.arg = p2.arg);
      }
    };
  }
  function maybeInvokeDelegate(e2, r2) {
    var n2 = r2.method, o2 = e2.iterator[n2];
    if (o2 === t) return r2.delegate = null, "throw" === n2 && e2.iterator.return && (r2.method = "return", r2.arg = t, maybeInvokeDelegate(e2, r2), "throw" === r2.method) || "return" !== n2 && (r2.method = "throw", r2.arg = new TypeError("The iterator does not provide a '" + n2 + "' method")), y;
    var i2 = tryCatch(o2, e2.iterator, r2.arg);
    if ("throw" === i2.type) return r2.method = "throw", r2.arg = i2.arg, r2.delegate = null, y;
    var a2 = i2.arg;
    return a2 ? a2.done ? (r2[e2.resultName] = a2.value, r2.next = e2.nextLoc, "return" !== r2.method && (r2.method = "next", r2.arg = t), r2.delegate = null, y) : a2 : (r2.method = "throw", r2.arg = new TypeError("iterator result is not an object"), r2.delegate = null, y);
  }
  function pushTryEntry(t2) {
    var e2 = {
      tryLoc: t2[0]
    };
    1 in t2 && (e2.catchLoc = t2[1]), 2 in t2 && (e2.finallyLoc = t2[2], e2.afterLoc = t2[3]), this.tryEntries.push(e2);
  }
  function resetTryEntry(t2) {
    var e2 = t2.completion || {};
    e2.type = "normal", delete e2.arg, t2.completion = e2;
  }
  function Context(t2) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t2.forEach(pushTryEntry, this), this.reset(true);
  }
  function values(e2) {
    if (e2 || "" === e2) {
      var r2 = e2[a];
      if (r2) return r2.call(e2);
      if ("function" == typeof e2.next) return e2;
      if (!isNaN(e2.length)) {
        var o2 = -1, i2 = function next() {
          for (; ++o2 < e2.length; ) if (n.call(e2, o2)) return next.value = e2[o2], next.done = false, next;
          return next.value = t, next.done = true, next;
        };
        return i2.next = i2;
      }
    }
    throw new TypeError(typeof e2 + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: true
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: true
  }), GeneratorFunction.displayName = define2(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function(t2) {
    var e2 = "function" == typeof t2 && t2.constructor;
    return !!e2 && (e2 === GeneratorFunction || "GeneratorFunction" === (e2.displayName || e2.name));
  }, e.mark = function(t2) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t2, GeneratorFunctionPrototype) : (t2.__proto__ = GeneratorFunctionPrototype, define2(t2, u, "GeneratorFunction")), t2.prototype = Object.create(g), t2;
  }, e.awrap = function(t2) {
    return {
      __await: t2
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define2(AsyncIterator.prototype, c, function() {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function(t2, r2, n2, o2, i2) {
    void 0 === i2 && (i2 = Promise);
    var a2 = new AsyncIterator(wrap(t2, r2, n2, o2), i2);
    return e.isGeneratorFunction(r2) ? a2 : a2.next().then(function(t3) {
      return t3.done ? t3.value : a2.next();
    });
  }, defineIteratorMethods(g), define2(g, u, "Generator"), define2(g, a, function() {
    return this;
  }), define2(g, "toString", function() {
    return "[object Generator]";
  }), e.keys = function(t2) {
    var e2 = Object(t2), r2 = [];
    for (var n2 in e2) r2.push(n2);
    return r2.reverse(), function next() {
      for (; r2.length; ) {
        var t3 = r2.pop();
        if (t3 in e2) return next.value = t3, next.done = false, next;
      }
      return next.done = true, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function(e2) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = false, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e2) for (var r2 in this) "t" === r2.charAt(0) && n.call(this, r2) && !isNaN(+r2.slice(1)) && (this[r2] = t);
    },
    stop: function() {
      this.done = true;
      var t2 = this.tryEntries[0].completion;
      if ("throw" === t2.type) throw t2.arg;
      return this.rval;
    },
    dispatchException: function(e2) {
      if (this.done) throw e2;
      var r2 = this;
      function handle(n2, o3) {
        return a2.type = "throw", a2.arg = e2, r2.next = n2, o3 && (r2.method = "next", r2.arg = t), !!o3;
      }
      for (var o2 = this.tryEntries.length - 1; o2 >= 0; --o2) {
        var i2 = this.tryEntries[o2], a2 = i2.completion;
        if ("root" === i2.tryLoc) return handle("end");
        if (i2.tryLoc <= this.prev) {
          var c2 = n.call(i2, "catchLoc"), u2 = n.call(i2, "finallyLoc");
          if (c2 && u2) {
            if (this.prev < i2.catchLoc) return handle(i2.catchLoc, true);
            if (this.prev < i2.finallyLoc) return handle(i2.finallyLoc);
          } else if (c2) {
            if (this.prev < i2.catchLoc) return handle(i2.catchLoc, true);
          } else {
            if (!u2) throw Error("try statement without catch or finally");
            if (this.prev < i2.finallyLoc) return handle(i2.finallyLoc);
          }
        }
      }
    },
    abrupt: function(t2, e2) {
      for (var r2 = this.tryEntries.length - 1; r2 >= 0; --r2) {
        var o2 = this.tryEntries[r2];
        if (o2.tryLoc <= this.prev && n.call(o2, "finallyLoc") && this.prev < o2.finallyLoc) {
          var i2 = o2;
          break;
        }
      }
      i2 && ("break" === t2 || "continue" === t2) && i2.tryLoc <= e2 && e2 <= i2.finallyLoc && (i2 = null);
      var a2 = i2 ? i2.completion : {};
      return a2.type = t2, a2.arg = e2, i2 ? (this.method = "next", this.next = i2.finallyLoc, y) : this.complete(a2);
    },
    complete: function(t2, e2) {
      if ("throw" === t2.type) throw t2.arg;
      return "break" === t2.type || "continue" === t2.type ? this.next = t2.arg : "return" === t2.type ? (this.rval = this.arg = t2.arg, this.method = "return", this.next = "end") : "normal" === t2.type && e2 && (this.next = e2), y;
    },
    finish: function(t2) {
      for (var e2 = this.tryEntries.length - 1; e2 >= 0; --e2) {
        var r2 = this.tryEntries[e2];
        if (r2.finallyLoc === t2) return this.complete(r2.completion, r2.afterLoc), resetTryEntry(r2), y;
      }
    },
    catch: function(t2) {
      for (var e2 = this.tryEntries.length - 1; e2 >= 0; --e2) {
        var r2 = this.tryEntries[e2];
        if (r2.tryLoc === t2) {
          var n2 = r2.completion;
          if ("throw" === n2.type) {
            var o2 = n2.arg;
            resetTryEntry(r2);
          }
          return o2;
        }
      }
      throw Error("illegal catch attempt");
    },
    delegateYield: function(e2, r2, n2) {
      return this.delegate = {
        iterator: values(e2),
        resultName: r2,
        nextLoc: n2
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c), u = i.value;
  } catch (n2) {
    return void e(n2);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function() {
    var t = this, e = arguments;
    return new Promise(function(r, o) {
      var a = n.apply(t, e);
      function _next(n2) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n2);
      }
      function _throw(n2) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n2);
      }
      _next(void 0);
    });
  };
}
var DEFAULT_TEXTURE_MANAGER_OPTIONS = {
  size: {
    mode: "max",
    value: 512
  },
  objectFit: "cover",
  correctCentering: false,
  maxTextureSize: 4096,
  debounceTimeout: 500,
  crossOrigin: "anonymous"
};
var MARGIN_IN_TEXTURE = 1;
function loadRasterImage(imageSource) {
  var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, crossOrigin = _ref.crossOrigin;
  return new Promise(function(resolve, reject) {
    var image = new Image();
    image.addEventListener("load", function() {
      resolve(image);
    }, {
      once: true
    });
    image.addEventListener("error", function(e) {
      reject(e.error);
    }, {
      once: true
    });
    if (crossOrigin) {
      image.setAttribute("crossOrigin", crossOrigin);
    }
    image.src = imageSource;
  });
}
function loadSVGImage(_x) {
  return _loadSVGImage.apply(this, arguments);
}
function _loadSVGImage() {
  _loadSVGImage = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime().mark(function _callee2(imageSource) {
    var _ref2, size, crossOrigin, resp, svgString, svg, root, originalWidth, originalHeight, correctedSvgString, blob, url, res, _args2 = arguments;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _ref2 = _args2.length > 1 && _args2[1] !== void 0 ? _args2[1] : {}, size = _ref2.size, crossOrigin = _ref2.crossOrigin;
          if (!(crossOrigin === "use-credentials")) {
            _context2.next = 7;
            break;
          }
          _context2.next = 4;
          return fetch(imageSource, {
            credentials: "include"
          });
        case 4:
          resp = _context2.sent;
          _context2.next = 10;
          break;
        case 7:
          _context2.next = 9;
          return fetch(imageSource);
        case 9:
          resp = _context2.sent;
        case 10:
          _context2.next = 12;
          return resp.text();
        case 12:
          svgString = _context2.sent;
          svg = new DOMParser().parseFromString(svgString, "image/svg+xml");
          root = svg.documentElement;
          originalWidth = root.getAttribute("width");
          originalHeight = root.getAttribute("height");
          if (!(!originalWidth || !originalHeight)) {
            _context2.next = 19;
            break;
          }
          throw new Error("loadSVGImage: cannot use `size` if target SVG has no definite dimensions.");
        case 19:
          if (typeof size === "number") {
            root.setAttribute("width", "" + size);
            root.setAttribute("height", "" + size);
          }
          correctedSvgString = new XMLSerializer().serializeToString(svg);
          blob = new Blob([correctedSvgString], {
            type: "image/svg+xml"
          });
          url = URL.createObjectURL(blob);
          res = loadRasterImage(url);
          res["finally"](function() {
            return URL.revokeObjectURL(url);
          });
          return _context2.abrupt("return", res);
        case 26:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _loadSVGImage.apply(this, arguments);
}
function loadImage(_x2) {
  return _loadImage.apply(this, arguments);
}
function _loadImage() {
  _loadImage = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime().mark(function _callee3(imageSource) {
    var _imageSource$split$0$;
    var _ref3, size, crossOrigin, isSVG, image, _args3 = arguments;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _ref3 = _args3.length > 1 && _args3[1] !== void 0 ? _args3[1] : {}, size = _ref3.size, crossOrigin = _ref3.crossOrigin;
          isSVG = ((_imageSource$split$0$ = imageSource.split(/[#?]/)[0].split(".").pop()) === null || _imageSource$split$0$ === void 0 ? void 0 : _imageSource$split$0$.trim().toLowerCase()) === "svg";
          if (!(isSVG && size)) {
            _context3.next = 16;
            break;
          }
          _context3.prev = 3;
          _context3.next = 6;
          return loadSVGImage(imageSource, {
            size,
            crossOrigin
          });
        case 6:
          image = _context3.sent;
          _context3.next = 14;
          break;
        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](3);
          _context3.next = 13;
          return loadRasterImage(imageSource, {
            crossOrigin
          });
        case 13:
          image = _context3.sent;
        case 14:
          _context3.next = 19;
          break;
        case 16:
          _context3.next = 18;
          return loadRasterImage(imageSource, {
            crossOrigin
          });
        case 18:
          image = _context3.sent;
        case 19:
          return _context3.abrupt("return", image);
        case 20:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[3, 9]]);
  }));
  return _loadImage.apply(this, arguments);
}
function refineImage(image, corrector, _ref4) {
  var objectFit = _ref4.objectFit, size = _ref4.size, correctCentering = _ref4.correctCentering;
  var sourceSize = objectFit === "contain" ? Math.max(image.width, image.height) : Math.min(image.width, image.height);
  var destinationSize = size.mode === "auto" ? sourceSize : size.mode === "force" ? size.value : Math.min(size.value, sourceSize);
  var sourceX = (image.width - sourceSize) / 2;
  var sourceY = (image.height - sourceSize) / 2;
  if (correctCentering) {
    var correction = corrector.getCorrectionOffset(image, sourceSize);
    sourceX = correction.x;
    sourceY = correction.y;
  }
  return {
    sourceX,
    sourceY,
    sourceSize,
    destinationSize
  };
}
function drawTexture(images, ctx, cursor) {
  var _ctx$canvas = ctx.canvas, width = _ctx$canvas.width, height = _ctx$canvas.height;
  var refinedImagesArray = [];
  var x = cursor.x, y = cursor.y, rowHeight = cursor.rowHeight, maxRowWidth = cursor.maxRowWidth;
  var atlas = {};
  for (var i = 0, l = images.length; i < l; i++) {
    var _images$i = images[i], key = _images$i.key, image = _images$i.image, sourceSize = _images$i.sourceSize, sourceX = _images$i.sourceX, sourceY = _images$i.sourceY, destinationSize = _images$i.destinationSize;
    var destinationSizeWithMargin = destinationSize + MARGIN_IN_TEXTURE;
    if (y + destinationSizeWithMargin > height || x + destinationSizeWithMargin > width && y + destinationSizeWithMargin + rowHeight > height) {
      continue;
    }
    if (x + destinationSizeWithMargin > width) {
      maxRowWidth = Math.max(maxRowWidth, x);
      x = 0;
      y += rowHeight;
      rowHeight = destinationSizeWithMargin;
    }
    refinedImagesArray.push({
      key,
      image,
      sourceX,
      sourceY,
      sourceSize,
      destinationX: x,
      destinationY: y,
      destinationSize
    });
    atlas[key] = {
      x,
      y,
      size: destinationSize
    };
    x += destinationSizeWithMargin;
    rowHeight = Math.max(rowHeight, destinationSizeWithMargin);
  }
  maxRowWidth = Math.max(maxRowWidth, x);
  var effectiveWidth = maxRowWidth;
  var effectiveHeight = y + rowHeight;
  for (var _i = 0, _l = refinedImagesArray.length; _i < _l; _i++) {
    var _refinedImagesArray$_ = refinedImagesArray[_i], _image = _refinedImagesArray$_.image, _sourceSize = _refinedImagesArray$_.sourceSize, _sourceX = _refinedImagesArray$_.sourceX, _sourceY = _refinedImagesArray$_.sourceY, _destinationSize = _refinedImagesArray$_.destinationSize, destinationX = _refinedImagesArray$_.destinationX, destinationY = _refinedImagesArray$_.destinationY;
    ctx.drawImage(_image, _sourceX, _sourceY, _sourceSize, _sourceSize, destinationX, destinationY, _destinationSize, _destinationSize);
  }
  return {
    atlas,
    texture: ctx.getImageData(0, 0, effectiveWidth, effectiveHeight),
    cursor: {
      x,
      y,
      rowHeight,
      maxRowWidth
    }
  };
}
function drawTextures(_ref5, images, ctx) {
  var prevAtlas = _ref5.atlas, prevTextures = _ref5.textures, prevCursor = _ref5.cursor;
  var res = {
    atlas: _objectSpread22({}, prevAtlas),
    textures: _toConsumableArray2(prevTextures.slice(0, -1)),
    cursor: _objectSpread22({}, prevCursor)
  };
  var imagesToDraw = [];
  for (var key in images) {
    var _prevAtlas$key;
    var imageState = images[key];
    if (imageState.status !== "ready") continue;
    var textureIndex = (_prevAtlas$key = prevAtlas[key]) === null || _prevAtlas$key === void 0 ? void 0 : _prevAtlas$key.textureIndex;
    if (typeof textureIndex === "number") continue;
    imagesToDraw.push(_objectSpread22({
      key
    }, imageState));
  }
  var _loop = function _loop2() {
    var _drawTexture = drawTexture(imagesToDraw, ctx, res.cursor), atlas = _drawTexture.atlas, texture = _drawTexture.texture, cursor = _drawTexture.cursor;
    res.cursor = cursor;
    var remainingImages = [];
    imagesToDraw.forEach(function(image) {
      if (atlas[image.key]) {
        res.atlas[image.key] = _objectSpread22(_objectSpread22({}, atlas[image.key]), {}, {
          textureIndex: res.textures.length
        });
      } else {
        remainingImages.push(image);
      }
    });
    res.textures.push(texture);
    imagesToDraw = remainingImages;
    if (imagesToDraw.length) {
      res.cursor = {
        x: 0,
        y: 0,
        rowHeight: 0,
        maxRowWidth: 0
      };
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  };
  while (imagesToDraw.length) {
    _loop();
  }
  return res;
}
var PictogramCenteringCorrector = /* @__PURE__ */ (function() {
  function PictogramCenteringCorrector2() {
    _classCallCheck2(this, PictogramCenteringCorrector2);
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d", {
      willReadFrequently: true
    });
  }
  _createClass2(PictogramCenteringCorrector2, [{
    key: "getCorrectionOffset",
    value: function getCorrectionOffset(image, size) {
      this.canvas.width = size;
      this.canvas.height = size;
      this.context.clearRect(0, 0, size, size);
      this.context.drawImage(image, 0, 0, size, size);
      var data = this.context.getImageData(0, 0, size, size).data;
      var alpha = new Uint8ClampedArray(data.length / 4);
      for (var i = 0; i < data.length; i++) {
        alpha[i] = data[i * 4 + 3];
      }
      var sumX = 0;
      var sumY = 0;
      var total = 0;
      for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
          var a = alpha[y * size + x];
          total += a;
          sumX += a * x;
          sumY += a * y;
        }
      }
      var barycenterX = sumX / total;
      var barycenterY = sumY / total;
      return {
        x: barycenterX - size / 2,
        y: barycenterY - size / 2
      };
    }
  }]);
  return PictogramCenteringCorrector2;
})();
var TextureManager = /* @__PURE__ */ (function(_EventEmitter) {
  _inherits2(TextureManager2, _EventEmitter);
  function TextureManager2() {
    var _this;
    var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    _classCallCheck2(this, TextureManager2);
    _this = _callSuper2(this, TextureManager2);
    _defineProperty2(_assertThisInitialized2(_this), "canvas", document.createElement("canvas"));
    _defineProperty2(_assertThisInitialized2(_this), "ctx", _this.canvas.getContext("2d", {
      willReadFrequently: true
    }));
    _defineProperty2(_assertThisInitialized2(_this), "corrector", new PictogramCenteringCorrector());
    _defineProperty2(_assertThisInitialized2(_this), "imageStates", {});
    _defineProperty2(_assertThisInitialized2(_this), "textures", [_this.ctx.getImageData(0, 0, 1, 1)]);
    _defineProperty2(_assertThisInitialized2(_this), "lastTextureCursor", {
      x: 0,
      y: 0,
      rowHeight: 0,
      maxRowWidth: 0
    });
    _defineProperty2(_assertThisInitialized2(_this), "atlas", {});
    _this.options = _objectSpread22(_objectSpread22({}, DEFAULT_TEXTURE_MANAGER_OPTIONS), options);
    _this.canvas.width = _this.options.maxTextureSize;
    _this.canvas.height = _this.options.maxTextureSize;
    return _this;
  }
  _createClass2(TextureManager2, [{
    key: "scheduleGenerateTexture",
    value: function scheduleGenerateTexture() {
      var _this2 = this;
      if (typeof this.frameId === "number") return;
      if (typeof this.options.debounceTimeout === "number") {
        this.frameId = window.setTimeout(function() {
          _this2.generateTextures();
          _this2.frameId = void 0;
        }, this.options.debounceTimeout);
      } else {
        this.generateTextures();
      }
    }
  }, {
    key: "generateTextures",
    value: function generateTextures() {
      var _drawTextures = drawTextures({
        atlas: this.atlas,
        textures: this.textures,
        cursor: this.lastTextureCursor
      }, this.imageStates, this.ctx), atlas = _drawTextures.atlas, textures = _drawTextures.textures, cursor = _drawTextures.cursor;
      this.atlas = atlas;
      this.textures = textures;
      this.lastTextureCursor = cursor;
      this.emit(TextureManager2.NEW_TEXTURE_EVENT, {
        atlas,
        textures
      });
    }
    // PUBLIC API:
  }, {
    key: "registerImage",
    value: (function() {
      var _registerImage = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime().mark(function _callee(source) {
        var size, image;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!this.imageStates[source]) {
                _context.next = 2;
                break;
              }
              return _context.abrupt("return");
            case 2:
              this.imageStates[source] = {
                status: "loading"
              };
              _context.prev = 3;
              size = this.options.size;
              _context.next = 7;
              return loadImage(source, {
                size: size.mode === "force" ? size.value : void 0,
                crossOrigin: this.options.crossOrigin || void 0
              });
            case 7:
              image = _context.sent;
              this.imageStates[source] = _objectSpread22({
                status: "ready",
                image
              }, refineImage(image, this.corrector, this.options));
              this.scheduleGenerateTexture();
              _context.next = 15;
              break;
            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](3);
              this.imageStates[source] = {
                status: "error"
              };
            case 15:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[3, 12]]);
      }));
      function registerImage(_x3) {
        return _registerImage.apply(this, arguments);
      }
      return registerImage;
    })()
  }, {
    key: "getAtlas",
    value: function getAtlas() {
      return this.atlas;
    }
  }, {
    key: "getTextures",
    value: function getTextures() {
      return this.textures;
    }
  }]);
  return TextureManager2;
})(import_events3.EventEmitter);
_defineProperty2(TextureManager, "NEW_TEXTURE_EVENT", "newTexture");
var _excluded = ["drawHover", "drawLabel", "drawingMode", "keepWithinCircle", "padding", "colorAttribute", "imageAttribute"];
var _WebGLRenderingContex3 = WebGLRenderingContext;
var UNSIGNED_BYTE3 = _WebGLRenderingContex3.UNSIGNED_BYTE;
var FLOAT3 = _WebGLRenderingContex3.FLOAT;
var DEFAULT_CREATE_NODE_IMAGE_OPTIONS = _objectSpread22(_objectSpread22({}, DEFAULT_TEXTURE_MANAGER_OPTIONS), {}, {
  drawingMode: "background",
  keepWithinCircle: true,
  drawLabel: void 0,
  drawHover: void 0,
  padding: 0,
  colorAttribute: "color",
  imageAttribute: "image"
});
var UNIFORMS2 = ["u_sizeRatio", "u_correctionRatio", "u_cameraAngle", "u_percentagePadding", "u_matrix", "u_colorizeImages", "u_keepWithinCircle", "u_atlas"];
function createNodeImageProgram(options) {
  var _NodeImageProgram;
  var gl = document.createElement("canvas").getContext("webgl");
  var defaultMaxTextureSize = Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE), DEFAULT_TEXTURE_MANAGER_OPTIONS.maxTextureSize);
  gl.canvas.remove();
  var _maxTextureSize = _objectSpread22(_objectSpread22(_objectSpread22({}, DEFAULT_CREATE_NODE_IMAGE_OPTIONS), {
    maxTextureSize: defaultMaxTextureSize
  }), options || {}), drawHover = _maxTextureSize.drawHover, drawLabel = _maxTextureSize.drawLabel, drawingMode = _maxTextureSize.drawingMode, keepWithinCircle = _maxTextureSize.keepWithinCircle, padding = _maxTextureSize.padding, colorAttribute = _maxTextureSize.colorAttribute, imageAttribute = _maxTextureSize.imageAttribute, textureManagerOptions = _objectWithoutProperties2(_maxTextureSize, _excluded);
  var textureManager = new TextureManager(textureManagerOptions);
  return _NodeImageProgram = /* @__PURE__ */ (function(_NodeProgram) {
    _inherits2(NodeImageProgram2, _NodeProgram);
    function NodeImageProgram2(gl2, pickingBuffer, renderer) {
      var _this;
      _classCallCheck2(this, NodeImageProgram2);
      _this = _callSuper2(this, NodeImageProgram2, [gl2, pickingBuffer, renderer]);
      _defineProperty2(_assertThisInitialized2(_this), "drawLabel", drawLabel);
      _defineProperty2(_assertThisInitialized2(_this), "drawHover", drawHover);
      _defineProperty2(_assertThisInitialized2(_this), "textureManagerCallback", null);
      _this.textureManagerCallback = function(_ref) {
        var atlas = _ref.atlas, textures = _ref.textures;
        var shouldUpgradeShaders = textures.length !== _this.textures.length;
        _this.atlas = atlas;
        _this.textureImages = textures;
        if (shouldUpgradeShaders) _this.upgradeShaders();
        _this.bindTextures();
        if (_this.latestRenderParams) _this.render(_this.latestRenderParams);
        if (_this.renderer && _this.renderer.refresh) _this.renderer.refresh();
      };
      textureManager.on(TextureManager.NEW_TEXTURE_EVENT, _this.textureManagerCallback);
      _this.atlas = textureManager.getAtlas();
      _this.textureImages = textureManager.getTextures();
      _this.textures = _this.textureImages.map(function() {
        return gl2.createTexture();
      });
      _this.bindTextures();
      return _this;
    }
    _createClass2(NodeImageProgram2, [{
      key: "getDefinition",
      value: function getDefinition() {
        return {
          VERTICES: 3,
          VERTEX_SHADER_SOURCE: VERTEX_SHADER_SOURCE$12,
          FRAGMENT_SHADER_SOURCE: getFragmentShader({
            texturesCount: textureManager.getTextures().length
          }),
          METHOD: WebGLRenderingContext.TRIANGLES,
          UNIFORMS: UNIFORMS2,
          ATTRIBUTES: [{
            name: "a_position",
            size: 2,
            type: FLOAT3
          }, {
            name: "a_size",
            size: 1,
            type: FLOAT3
          }, {
            name: "a_color",
            size: 4,
            type: UNSIGNED_BYTE3,
            normalized: true
          }, {
            name: "a_id",
            size: 4,
            type: UNSIGNED_BYTE3,
            normalized: true
          }, {
            name: "a_texture",
            size: 4,
            type: FLOAT3
          }, {
            name: "a_textureIndex",
            size: 1,
            type: FLOAT3
          }],
          CONSTANT_ATTRIBUTES: [{
            name: "a_angle",
            size: 1,
            type: FLOAT3
          }],
          CONSTANT_DATA: [[NodeImageProgram2.ANGLE_1], [NodeImageProgram2.ANGLE_2], [NodeImageProgram2.ANGLE_3]]
        };
      }
    }, {
      key: "upgradeShaders",
      value: function upgradeShaders() {
        var def = this.getDefinition();
        var _this$normalProgram = this.normalProgram, program = _this$normalProgram.program, buffer = _this$normalProgram.buffer, vertexShader = _this$normalProgram.vertexShader, fragmentShader = _this$normalProgram.fragmentShader, gl2 = _this$normalProgram.gl;
        gl2.deleteProgram(program);
        gl2.deleteBuffer(buffer);
        gl2.deleteShader(vertexShader);
        gl2.deleteShader(fragmentShader);
        this.normalProgram = this.getProgramInfo("normal", gl2, def.VERTEX_SHADER_SOURCE, def.FRAGMENT_SHADER_SOURCE, null);
      }
    }, {
      key: "kill",
      value: function kill() {
        var _this$normalProgram2;
        var gl2 = (_this$normalProgram2 = this.normalProgram) === null || _this$normalProgram2 === void 0 ? void 0 : _this$normalProgram2.gl;
        if (gl2) {
          for (var i = 0; i < this.textures.length; i++) {
            gl2.deleteTexture(this.textures[i]);
          }
        }
        if (this.textureManagerCallback) {
          textureManager.off(TextureManager.NEW_TEXTURE_EVENT, this.textureManagerCallback);
          this.textureManagerCallback = null;
        }
        _superPropGet2(NodeImageProgram2, "kill", this, 3)([]);
      }
    }, {
      key: "bindTextures",
      value: function bindTextures() {
        var gl2 = this.normalProgram.gl;
        for (var i = 0; i < this.textureImages.length; i++) {
          if (i >= this.textures.length) {
            var texture = gl2.createTexture();
            if (texture) this.textures.push(texture);
          }
          gl2.activeTexture(gl2.TEXTURE0 + i);
          gl2.bindTexture(gl2.TEXTURE_2D, this.textures[i]);
          gl2.texImage2D(gl2.TEXTURE_2D, 0, gl2.RGBA, gl2.RGBA, gl2.UNSIGNED_BYTE, this.textureImages[i]);
          gl2.generateMipmap(gl2.TEXTURE_2D);
        }
      }
    }, {
      key: "renderProgram",
      value: function renderProgram(params, programInfo) {
        if (!programInfo.isPicking) {
          var _gl = programInfo.gl;
          for (var i = 0; i < this.textureImages.length; i++) {
            _gl.activeTexture(_gl.TEXTURE0 + i);
            _gl.bindTexture(_gl.TEXTURE_2D, this.textures[i]);
          }
        }
        _superPropGet2(NodeImageProgram2, "renderProgram", this, 3)([params, programInfo]);
      }
    }, {
      key: "processVisibleItem",
      value: function processVisibleItem(nodeIndex, startIndex, data) {
        var array = this.array;
        var color = floatColor(data[colorAttribute]);
        var imageSource = data[imageAttribute];
        var imagePosition = imageSource ? this.atlas[imageSource] : void 0;
        if (typeof imageSource === "string" && !imagePosition) textureManager.registerImage(imageSource);
        array[startIndex++] = data.x;
        array[startIndex++] = data.y;
        array[startIndex++] = data.size;
        array[startIndex++] = color;
        array[startIndex++] = nodeIndex;
        if (imagePosition && typeof imagePosition.textureIndex === "number") {
          var _this$textureImages$i = this.textureImages[imagePosition.textureIndex], width = _this$textureImages$i.width, height = _this$textureImages$i.height;
          array[startIndex++] = imagePosition.x / width;
          array[startIndex++] = imagePosition.y / height;
          array[startIndex++] = imagePosition.size / width;
          array[startIndex++] = imagePosition.size / height;
          array[startIndex++] = imagePosition.textureIndex;
        } else {
          array[startIndex++] = 0;
          array[startIndex++] = 0;
          array[startIndex++] = 0;
          array[startIndex++] = 0;
          array[startIndex++] = 0;
        }
      }
    }, {
      key: "setUniforms",
      value: function setUniforms(params, _ref2) {
        var gl2 = _ref2.gl, uniformLocations = _ref2.uniformLocations;
        var u_sizeRatio = uniformLocations.u_sizeRatio, u_correctionRatio = uniformLocations.u_correctionRatio, u_matrix = uniformLocations.u_matrix, u_atlas = uniformLocations.u_atlas, u_colorizeImages = uniformLocations.u_colorizeImages, u_keepWithinCircle = uniformLocations.u_keepWithinCircle, u_cameraAngle = uniformLocations.u_cameraAngle, u_percentagePadding = uniformLocations.u_percentagePadding;
        this.latestRenderParams = params;
        gl2.uniform1f(u_correctionRatio, params.correctionRatio);
        gl2.uniform1f(u_sizeRatio, keepWithinCircle ? params.sizeRatio : params.sizeRatio / Math.SQRT2);
        gl2.uniform1f(u_cameraAngle, params.cameraAngle);
        gl2.uniform1f(u_percentagePadding, padding);
        gl2.uniformMatrix3fv(u_matrix, false, params.matrix);
        gl2.uniform1iv(u_atlas, _toConsumableArray2(new Array(this.textureImages.length)).map(function(_, i) {
          return i;
        }));
        gl2.uniform1i(u_colorizeImages, drawingMode === "color" ? 1 : 0);
        gl2.uniform1i(u_keepWithinCircle, keepWithinCircle ? 1 : 0);
      }
    }]);
    return NodeImageProgram2;
  })(NodeProgram), _defineProperty2(_NodeImageProgram, "ANGLE_1", 0), _defineProperty2(_NodeImageProgram, "ANGLE_2", 2 * Math.PI / 3), _defineProperty2(_NodeImageProgram, "ANGLE_3", 4 * Math.PI / 3), _defineProperty2(_NodeImageProgram, "textureManager", textureManager), _NodeImageProgram;
}
var NodeImageProgram = createNodeImageProgram();
var NodePictogramProgram = createNodeImageProgram({
  keepWithinCircle: false,
  size: {
    mode: "force",
    value: 256
  },
  drawingMode: "color",
  correctCentering: true
});

// main.js
var FadingNodeImageProgram = class extends NodeImageProgram {
  getDefinition() {
    const def = super.getDefinition();
    def.FRAGMENT_SHADER_SOURCE = def.FRAGMENT_SHADER_SOURCE.replace("max(texel.a, v_color.a)", "v_color.a").replace(
      "  #endif\n\n  // Crop in a circle when u_keepWithinCircle is truthy:",
      "  color.rgb *= v_color.a;\n  #endif\n\n  // Crop in a circle when u_keepWithinCircle is truthy:"
    );
    return def;
  }
};
function drawNodeLabel(context, data, settings) {
  if (!data.label) return;
  const lines = String(data.label).split("\n");
  const size = settings.labelSize;
  const weight = settings.labelWeight;
  const color = settings.labelColor.attribute ? data[settings.labelColor.attribute] || settings.labelColor.color || "#000" : settings.labelColor.color;
  const lineHeight = size * 1.25;
  const x = data.x + data.size + 3;
  const totalHeight = lineHeight * lines.length;
  const firstBaseline = data.y - totalHeight / 2 + lineHeight / 2;
  context.font = weight + " " + size + "px " + settings.labelFont;
  context.textAlign = "left";
  context.textBaseline = "middle";
  let maxWidth = 0;
  for (const line of lines) {
    maxWidth = Math.max(maxWidth, context.measureText(line).width);
  }
  const padX = size * 0.4;
  const padY = size * 0.25;
  const bx = x - padX;
  const by = data.y - totalHeight / 2 - padY;
  const bw = maxWidth + padX * 2;
  const bh = totalHeight + padY * 2;
  context.fillStyle = "rgba(0, 0, 0, 0.3)";
  context.fillRect(bx, by, bw, bh);
  context.fillStyle = color;
  for (let i = 0; i < lines.length; i++) {
    context.fillText(lines[i], x, firstBaseline + i * lineHeight);
  }
}
var GRAPH_URL = "graph.json";
var PALETTE = [
  "#e6194b",
  "#3cb44b",
  "#ffe119",
  "#4363d8",
  "#f58231",
  "#911eb4",
  "#42d4f4",
  "#f032e6",
  "#bfef45",
  "#fabed4",
  "#469990",
  "#dcbeff",
  "#9a6324",
  "#fffac8",
  "#800000",
  "#aaffc3",
  "#808000",
  "#ffd8b1",
  "#000075",
  "#a9a9a9"
];
var EXTERNAL_COLOR = "#9e9e9e";
var ISOLATED_COLOR = "#d6d6d6";
var EDGE_ALPHA = 0.3;
var DEPENDENCY_EDGE_RGB = [255, 182, 193];
var INTERACTION_EDGE_RGB = [173, 216, 230];
function premulRgba(rgb, alpha) {
  return "rgba(" + Math.round(rgb[0] * alpha) + "," + Math.round(rgb[1] * alpha) + "," + Math.round(rgb[2] * alpha) + "," + alpha.toFixed(4) + ")";
}
var DEPENDENCY_EDGE_COLOR = premulRgba(DEPENDENCY_EDGE_RGB, EDGE_ALPHA);
var INTERACTION_EDGE_COLOR = premulRgba(INTERACTION_EDGE_RGB, EDGE_ALPHA);
function rgbaString(rgb, alpha) {
  return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + alpha + ")";
}
var LOD_MAX_THRESHOLD = 50;
var LOD_FULL_ZOOM_RATIO = 0.05;
var LOD_THROTTLE_MS = 33;
var NODE_LOD_MIN_VISIBLE = 300;
var NODE_LOD_ENABLED = true;
var NODE_DIAMETER_SCREEN_RATIO = 0.1;
var LABEL_FONT_SIZE = 14;
var HIGHLIGHT_NODE_COLOR = "#ffd700";
var HIGHLIGHT_EDGE_RGB = [255, 215, 0];
var HIGHLIGHT_EDGE_COLOR = premulRgba(HIGHLIGHT_EDGE_RGB, 1);
var COVER_MANIFEST_URL = "covers/manifest.json";
function communityColor(community, type) {
  if (type === "external") return EXTERNAL_COLOR;
  if (community < 0) return ISOLATED_COLOR;
  return PALETTE[community % PALETTE.length];
}
function nodeSize(inDegree, type) {
  const d = Math.max(0, inDegree || 0);
  const s = 2 + Math.sqrt(d);
  return type === "external" ? Math.min(s, 10) : Math.min(s, 48);
}
function formatNum(n) {
  if (n >= 1e4) return (n / 1e4).toFixed(1) + "\u4E07";
  return String(n);
}
function formatDuration(ms) {
  const s = Math.max(0, Math.round(ms / 1e3));
  if (s < 60) return s + "s";
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m + "m" + r + "s";
}
function edgeColorFor(rgb, alpha) {
  return premulRgba(rgb, EDGE_ALPHA * alpha);
}
function hexToRgba(hex, alpha, premul) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const rr = premul ? Math.round(r * alpha) : r;
  const gg = premul ? Math.round(g * alpha) : g;
  const bb = premul ? Math.round(b * alpha) : b;
  return "rgba(" + rr + "," + gg + "," + bb + "," + alpha.toFixed(4) + ")";
}
async function loadGraph() {
  const res = await fetch(GRAPH_URL);
  if (!res.ok) throw new Error("\u52A0\u8F7D graph.json \u5931\u8D25: " + res.status);
  return res.json();
}
async function loadCoverManifest() {
  try {
    const res = await fetch(COVER_MANIFEST_URL);
    if (!res.ok) return /* @__PURE__ */ new Set();
    const data = await res.json();
    const keys = Array.isArray(data) ? data : data.keys;
    return new Set(Array.isArray(keys) ? keys.map(String) : []);
  } catch (e) {
    console.warn("[\u8B66\u544A] \u672A\u627E\u5230\u9759\u6001\u5C01\u9762\u6E05\u5355\uFF0C\u4F7F\u7528\u7EAF\u8272\u8282\u70B9", e);
    return /* @__PURE__ */ new Set();
  }
}
function staticCoverPath(node, coverKeys) {
  if (!coverKeys.has(String(node.key))) return null;
  const path = node.cover || "covers/" + node.key + ".jpg";
  return String(path).replace(/^\/+/, "");
}
function buildGraph(data, coverKeys) {
  const graph = new import_graphology.default({ multi: true });
  const labelIndex = /* @__PURE__ */ new Map();
  const degMap = /* @__PURE__ */ new Map();
  for (const n of data.nodes) {
    degMap.set(n.key, n.in_degree);
    const isCore = n.type === "core";
    const coverUrl = isCore ? staticCoverPath(n, coverKeys) : null;
    graph.addNode(n.key, {
      x: typeof n.x === "number" ? n.x : Math.random() * 100,
      y: typeof n.y === "number" ? n.y : Math.random() * 100,
      size: nodeSize(n.in_degree, n.type),
      color: communityColor(n.community, n.type),
      label: n.label + "\nclass " + n.key,
      name: n.label,
      name_en: n.name_en,
      description: n.description,
      kind: n.type,
      type: coverUrl ? "image" : "circle",
      image: coverUrl,
      views: n.views,
      favorites: n.favorites,
      category: n.category,
      status: n.status,
      in_degree: n.in_degree,
      out_degree: n.out_degree,
      pagerank: n.pagerank,
      community: n.community,
      rank: n.rank,
      density: n.density
    });
    if (n.label) {
      const k = n.label.toLowerCase();
      if (!labelIndex.has(k)) labelIndex.set(k, []);
      labelIndex.get(k).push(n.key);
    }
  }
  for (const e of data.edges) {
    const importance = Math.min(degMap.get(e.source) || 0, degMap.get(e.target) || 0);
    const kind = e.type === "interaction" ? "interaction" : "dependency";
    const rgb = kind === "interaction" ? INTERACTION_EDGE_RGB : DEPENDENCY_EDGE_RGB;
    graph.addEdge(e.source, e.target, {
      size: 0.5,
      color: kind === "interaction" ? INTERACTION_EDGE_COLOR : DEPENDENCY_EDGE_COLOR,
      type: "line",
      kind,
      rgb,
      importance,
      group_name: e.group_name || ""
    });
  }
  return { graph, data, labelIndex };
}
function buildSearch(data) {
  const index = /* @__PURE__ */ new Map();
  const add = (term, n) => {
    if (!term) return;
    const k = term.toLowerCase();
    if (!index.has(k)) index.set(k, /* @__PURE__ */ new Set());
    index.get(k).add(n);
  };
  for (const n of data.nodes) {
    add(n.label, n);
    add(n.name_en, n);
    add(n.key, n);
  }
  return index;
}
function buildPagination(pageCount, current, onPage) {
  const wrap = document.createElement("div");
  wrap.className = "pagination";
  const prev = document.createElement("button");
  prev.textContent = "\u4E0A\u4E00\u9875";
  prev.disabled = current <= 0;
  prev.addEventListener("click", (e) => {
    e.stopPropagation();
    if (current > 0) onPage(current - 1);
  });
  const info = document.createElement("span");
  info.textContent = current + 1 + " / " + pageCount;
  const next = document.createElement("button");
  next.textContent = "\u4E0B\u4E00\u9875";
  next.disabled = current >= pageCount - 1;
  next.addEventListener("click", (e) => {
    e.stopPropagation();
    if (current < pageCount - 1) onPage(current + 1);
  });
  wrap.appendChild(prev);
  wrap.appendChild(info);
  wrap.appendChild(next);
  return wrap;
}
var CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(bytes, start, end) {
  let c = 4294967295;
  for (let i = start; i < end; i++) c = CRC_TABLE[(c ^ bytes[i]) & 255] ^ c >>> 8;
  return (c ^ 4294967295) >>> 0;
}
function pngChunk(type, data) {
  const len = data.length;
  const out = new Uint8Array(len + 12);
  const view = new DataView(out.buffer);
  view.setUint32(0, len);
  out[4] = type.charCodeAt(0);
  out[5] = type.charCodeAt(1);
  out[6] = type.charCodeAt(2);
  out[7] = type.charCodeAt(3);
  out.set(data, 8);
  view.setUint32(8 + len, crc32(out, 4, 8 + len));
  return out;
}
async function encodePNG(width, height, getScanlines) {
  const parts = [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])];
  const ihdr = new Uint8Array(13);
  const dv = new DataView(ihdr.buffer);
  dv.setUint32(0, width);
  dv.setUint32(4, height);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  parts.push(pngChunk("IHDR", ihdr));
  const cs = new CompressionStream("deflate");
  const writer = cs.writable.getWriter();
  const reader = cs.readable.getReader();
  const producer = (async () => {
    for await (const row of getScanlines()) {
      await writer.write(row);
    }
    await writer.close();
  })();
  const consumer = (async () => {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value && value.length) parts.push(pngChunk("IDAT", value));
    }
  })();
  await Promise.all([producer, consumer]);
  parts.push(pngChunk("IEND", new Uint8Array(0)));
  return new Blob(parts, { type: "image/png" });
}
function main() {
  const container = document.getElementById("container");
  const statusEl = document.getElementById("status");
  const tooltipEl = document.getElementById("tooltip");
  const contextMenu = document.getElementById("context-menu");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const searchList = document.getElementById("search-list");
  const searchPagination = document.getElementById("search-pagination");
  const statusText = document.getElementById("status-text");
  const progressFill = document.getElementById("progress-fill");
  const progressLabel = document.getElementById("progress-label");
  const lodSlider = document.getElementById("lod-slider");
  const lodValue = document.getElementById("lod-value");
  const edgeLodSlider = document.getElementById("edge-lod-slider");
  const edgeLodValue = document.getElementById("edge-lod-value");
  const panel = document.getElementById("panel");
  const panelToggle = document.getElementById("panel-toggle");
  const edgeDependency = document.getElementById("edge-dependency");
  const edgeInteraction = document.getElementById("edge-interaction");
  const showLabels = document.getElementById("show-labels");
  const exportWidth = document.getElementById("export-width");
  const exportHeight = document.getElementById("export-height");
  const exportButton = document.getElementById("export-button");
  const exportWarning = document.getElementById("export-warning");
  let renderer = null;
  let graph = null;
  let searchIndex = null;
  let lodThresholdValue = 0;
  let lodTimer = null;
  let culledEdges = /* @__PURE__ */ new Set();
  let nodeVisibleCount = 0;
  let edgeAlpha = /* @__PURE__ */ new Map();
  let nodeAlpha = /* @__PURE__ */ new Map();
  let fadeTimer = null;
  let searchMatches = [];
  let searchPage = 0;
  let allNodes = [];
  let nodeLodStrength = 1;
  let edgeLodStrength = 1;
  let showDependency = true;
  let showInteraction = true;
  let highlightNodes = /* @__PURE__ */ new Set();
  let highlightEdges = /* @__PURE__ */ new Set();
  function setProgress(pct, text, label) {
    statusText.textContent = text;
    progressFill.style.width = Math.max(0, Math.min(100, pct)) + "%";
    progressLabel.textContent = label || "";
  }
  function finishLoading() {
    statusEl.classList.add("fade-out");
    const onEnd = () => {
      statusEl.style.display = "none";
      statusEl.removeEventListener("transitionend", onEnd);
    };
    statusEl.addEventListener("transitionend", onEnd);
    setTimeout(() => {
      if (statusEl.style.display !== "none") statusEl.style.display = "none";
    }, 700);
  }
  async function boot() {
    setProgress(0, "\u52A0\u8F7D\u6570\u636E\u4E2D\u2026\u2026", "graph.json");
    const data = await loadGraph();
    setProgress(10, "\u52A0\u8F7D\u9759\u6001\u5C01\u9762\u6E05\u5355\u2026\u2026", "covers/manifest.json");
    await new Promise((r) => setTimeout(r, 30));
    const coverKeys = await loadCoverManifest();
    setProgress(20, coverKeys.size ? "\u6784\u5EFA\u56FE\u7ED3\u6784\u2026\u2026" : "\u672A\u627E\u5230\u5C01\u9762\uFF0C\u4F7F\u7528\u7EAF\u8272\u8282\u70B9\u2026\u2026", coverKeys.size + " \u5F20\u5C01\u9762\u5DF2\u5C31\u7EEA");
    await new Promise((r) => setTimeout(r, 30));
    const built = buildGraph(data, coverKeys);
    graph = built.graph;
    searchIndex = buildSearch(data);
    allNodes = [...data.nodes].sort((a, b) => (b.views || 0) - (a.views || 0));
    searchMatches = [...allNodes];
    searchPage = 0;
    renderSearchResults();
    setProgress(100, "\u6E32\u67D3\u4E2D\u2026\u2026", "");
    await new Promise((r) => setTimeout(r, 30));
    renderer = new Sigma(graph, container, {
      renderLabels: true,
      renderEdgeLabels: false,
      hideEdgesOnMove: false,
      enableEdgeEvents: true,
      // 节点尺寸与坐标同单位（世界单位），去重叠才能与渲染一致
      itemSizesReference: "positions",
      zoomToSizeRatioFunction: (ratio) => ratio,
      defaultNodeType: "circle",
      defaultEdgeType: "line",
      // 标签：屏幕固定像素 + 网格防重叠 + 缩放门槛
      labelSize: 14,
      labelFont: '"Microsoft YaHei", "PingFang SC", sans-serif',
      labelColor: { color: "#d0d7de" },
      labelRenderedSizeThreshold: 14,
      labelGridCellSize: 180,
      labelDensity: 0.4,
      defaultDrawNodeLabel: drawNodeLabel,
      nodeProgramClasses: {
        image: FadingNodeImageProgram
      }
    });
    bindEvents();
    container.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const bbox = container.getBoundingClientRect();
      const x = e.clientX - bbox.left;
      const y = e.clientY - bbox.top;
      const node = renderer.getNodeAtPosition({ x, y });
      if (node) {
        showNodeMenu(node, e.clientX, e.clientY);
        return;
      }
      const edge = renderer.getEdgeAtPoint(x, y);
      if (edge) {
        showEdgeMenu(edge, e.clientX, e.clientY);
        return;
      }
      hideContextMenu();
    });
    renderer.setSetting("edgeReducer", (edge, attrs) => {
      if (highlightEdges.has(edge)) {
        return { ...attrs, hidden: false, color: HIGHLIGHT_EDGE_COLOR, size: Math.max(attrs.size || 0.5, 1.6) };
      }
      const alpha = edgeAlpha.get(edge);
      if (alpha === 0) return { ...attrs, hidden: true };
      if (alpha !== void 0 && alpha < 1) {
        return { ...attrs, color: edgeColorFor(attrs.rgb || DEPENDENCY_EDGE_RGB, alpha) };
      }
      return attrs;
    });
    renderer.setSetting("nodeReducer", (node, attr) => {
      if (highlightNodes.has(node)) {
        return { ...attr, hidden: false, color: HIGHLIGHT_NODE_COLOR };
      }
      const alpha = nodeAlpha.get(node);
      if (alpha === 0) return { ...attr, hidden: true };
      if (alpha !== void 0 && alpha < 1) {
        const premul = attr.type !== "image";
        return { ...attr, color: hexToRgba(attr.color, alpha, premul) };
      }
      return attr;
    });
    const cam = renderer.getCamera();
    let lodLastRun = 0;
    cam.on("updated", () => {
      const now = performance.now();
      const applyLod = () => {
        lodLastRun = performance.now();
        const state = cam.getState();
        lodThresholdValue = computeLodThreshold(state.ratio, LOD_MAX_THRESHOLD * edgeLodStrength);
        nodeVisibleCount = computeVisibleNodeCount(state.ratio, nodeLodStrength);
        updateCulling(state);
        startFade();
      };
      if (lodTimer) clearTimeout(lodTimer);
      const elapsed = now - lodLastRun;
      if (elapsed >= LOD_THROTTLE_MS) {
        applyLod();
      } else {
        lodTimer = setTimeout(applyLod, LOD_THROTTLE_MS - elapsed);
      }
    });
    lodThresholdValue = computeLodThreshold(cam.getState().ratio, LOD_MAX_THRESHOLD * edgeLodStrength);
    nodeVisibleCount = computeVisibleNodeCount(cam.getState().ratio, nodeLodStrength);
    updateCulling(cam.getState());
    renderer.refresh();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await new Promise((r) => setTimeout(r, 700));
    startFade();
    finishLoading();
  }
  function bindEvents() {
    renderer.on("enterNode", ({ node }) => {
      const attrs = graph.getNodeAttributes(node);
      showTooltip(node, attrs);
    });
    renderer.on("leaveNode", () => {
      hideTooltip();
    });
    renderer.on("clickNode", ({ node }) => {
      window.open("https://www.mcmod.cn/class/" + node + ".html", "_blank");
    });
    renderer.on("clickEdge", ({ edge }) => {
      const source = graph.source(edge);
      const target = graph.target(edge);
      const cam = renderer.getCamera().getState();
      const sd = renderer.getNodeDisplayData(source);
      const td = renderer.getNodeDisplayData(target);
      if (!sd || !td) return;
      const ds = (sd.x - cam.x) * (sd.x - cam.x) + (sd.y - cam.y) * (sd.y - cam.y);
      const dt = (td.x - cam.x) * (td.x - cam.x) + (td.y - cam.y) * (td.y - cam.y);
      focusNode(ds >= dt ? source : target);
    });
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) {
        searchMatches = [...allNodes];
        searchPage = 0;
        renderSearchResults();
        return;
      }
      const matched = /* @__PURE__ */ new Set();
      for (const [k, nodes] of searchIndex) {
        if (k.includes(q)) {
          for (const n of nodes) matched.add(n);
        }
      }
      searchMatches = [...matched].sort((a, b) => (b.views || 0) - (a.views || 0));
      searchPage = 0;
      renderSearchResults();
    });
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const first = searchList.querySelector("li");
        if (first) first.click();
      }
    });
    lodSlider.addEventListener("input", () => {
      nodeLodStrength = Number(lodSlider.value) / 100;
      lodValue.textContent = Math.round(nodeLodStrength * 100) + "%";
      nodeVisibleCount = computeVisibleNodeCount(renderer.getCamera().getState().ratio, nodeLodStrength);
      startFade();
    });
    edgeLodSlider.addEventListener("input", () => {
      edgeLodStrength = Number(edgeLodSlider.value) / 100;
      edgeLodValue.textContent = Math.round(edgeLodStrength * 100) + "%";
      lodThresholdValue = computeLodThreshold(renderer.getCamera().getState().ratio, LOD_MAX_THRESHOLD * edgeLodStrength);
      startFade();
    });
    panelToggle.addEventListener("click", () => {
      const collapsed = panel.classList.toggle("collapsed");
      panelToggle.textContent = collapsed ? "\xBB" : "\xAB";
      panelToggle.title = collapsed ? "\u5C55\u5F00\u4FA7\u8FB9\u680F" : "\u6536\u8D77\u4FA7\u8FB9\u680F";
    });
    edgeDependency.addEventListener("change", () => {
      showDependency = edgeDependency.checked;
      startFade();
    });
    edgeInteraction.addEventListener("change", () => {
      showInteraction = edgeInteraction.checked;
      startFade();
    });
    showLabels.addEventListener("change", () => {
      renderer.setSetting("renderLabels", showLabels.checked);
    });
    exportButton.addEventListener("click", exportPNG);
    function updateExportWarning() {
      const w = parseInt(exportWidth.value, 10) || 0;
      const h = parseInt(exportHeight.value, 10) || 0;
      exportWarning.classList.toggle("hidden", w < 16384 && h < 16384);
    }
    exportWidth.addEventListener("input", updateExportWarning);
    exportHeight.addEventListener("input", updateExportWarning);
    updateExportWarning();
  }
  function renderSearchResults() {
    searchList.innerHTML = "";
    searchPagination.innerHTML = "";
    const pageSize = 20;
    const total = searchMatches.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    if (searchPage >= pages) searchPage = pages - 1;
    const start = searchPage * pageSize;
    const page = searchMatches.slice(start, start + pageSize);
    for (const n of page) {
      const li = document.createElement("li");
      li.textContent = n.label + (n.name_en ? " (" + n.name_en + ")" : "");
      li.title = "class " + n.key;
      li.addEventListener("click", () => {
        focusNode(n.key);
      });
      searchList.appendChild(li);
    }
    if (pages > 1) {
      searchPagination.appendChild(buildPagination(pages, searchPage, (p) => {
        searchPage = p;
        renderSearchResults();
      }));
    }
    searchResults.classList.toggle("open", total > 0);
  }
  function getViewRect(cameraState) {
    const cam = cameraState || renderer.getCamera().getState();
    const dims = renderer.getDimensions();
    const override = { cameraState: cam, viewportDimensions: dims };
    const tl = renderer.viewportToGraph({ x: 0, y: 0 }, override);
    const br = renderer.viewportToGraph({ x: dims.width, y: dims.height }, override);
    return {
      minX: Math.min(tl.x, br.x),
      maxX: Math.max(tl.x, br.x),
      minY: Math.min(tl.y, br.y),
      maxY: Math.max(tl.y, br.y)
    };
  }
  function updateCulling(cameraState) {
    const rect = getViewRect(cameraState);
    const next = /* @__PURE__ */ new Set();
    graph.forEachEdge((edge, attrs, source, target, sa, ta) => {
      const sOut = sa.x < rect.minX || sa.x > rect.maxX || sa.y < rect.minY || sa.y > rect.maxY;
      const tOut = ta.x < rect.minX || ta.x > rect.maxX || ta.y < rect.minY || ta.y > rect.maxY;
      if (sOut && tOut) next.add(edge);
    });
    culledEdges = next;
  }
  function focusNode(key) {
    if (!renderer || !graph) return;
    const nd = renderer.getNodeDisplayData(key);
    if (!nd) return;
    const cam = renderer.getCamera();
    const size = graph.getNodeAttribute(key, "size") || 2;
    const width = renderer.getDimensions().width;
    const C = renderer.getGraphToViewportRatio() * cam.getState().ratio;
    const targetRatio = 2 * size * C / (NODE_DIAMETER_SCREEN_RATIO * width);
    cam.animate({ x: nd.x, y: nd.y, ratio: targetRatio }, { duration: 600 });
  }
  function computeLodThreshold(ratio, maxThreshold) {
    if (ratio <= LOD_FULL_ZOOM_RATIO) return 0;
    const maxR = 1;
    const r = Math.min(ratio, maxR);
    const t = (Math.log(r) - Math.log(LOD_FULL_ZOOM_RATIO)) / (Math.log(maxR) - Math.log(LOD_FULL_ZOOM_RATIO));
    return Math.round(maxThreshold * t);
  }
  function computeVisibleNodeCount(ratio, strength) {
    const total = graph.order;
    if (strength <= 0) return total;
    if (ratio <= LOD_FULL_ZOOM_RATIO) return total;
    const maxR = 1;
    const r = Math.min(ratio, maxR);
    const t = (Math.log(r) - Math.log(LOD_FULL_ZOOM_RATIO)) / (Math.log(maxR) - Math.log(LOD_FULL_ZOOM_RATIO));
    return Math.round(total * Math.pow(NODE_LOD_MIN_VISIBLE / total, t * strength));
  }
  function edgeTarget(edge, attrs) {
    if (attrs.kind === "dependency" && !showDependency) return 0;
    if (attrs.kind === "interaction" && !showInteraction) return 0;
    if ((attrs.importance || 0) < lodThresholdValue) return 0;
    if (culledEdges.has(edge)) return 0;
    return 1;
  }
  function nodeTarget(node, attrs) {
    if (!NODE_LOD_ENABLED) return 1;
    return (attrs.rank ?? Infinity) < nodeVisibleCount ? 1 : 0;
  }
  function fadeStep() {
    const step = 0.36;
    const changedNodes = [];
    const changedEdges = [];
    graph.forEachEdge((edge, attrs) => {
      const target = edgeTarget(edge, attrs);
      const cur = edgeAlpha.has(edge) ? edgeAlpha.get(edge) : 1;
      if (cur === target) return;
      let next = cur + (target - cur) * step;
      if (Math.abs(next - target) < 0.02) next = target;
      if (next === 1) edgeAlpha.delete(edge);
      else edgeAlpha.set(edge, next);
      changedEdges.push(edge);
    });
    graph.forEachNode((node, attrs) => {
      const target = nodeTarget(node, attrs);
      const cur = nodeAlpha.has(node) ? nodeAlpha.get(node) : 1;
      if (cur === target) return;
      let next = cur + (target - cur) * step;
      if (Math.abs(next - target) < 0.02) next = target;
      if (next === 1) nodeAlpha.delete(node);
      else nodeAlpha.set(node, next);
      changedNodes.push(node);
    });
    if (changedNodes.length || changedEdges.length) {
      renderer.refresh();
      fadeTimer = setTimeout(fadeStep, 33);
    } else {
      fadeTimer = null;
    }
  }
  function startFade() {
    if (fadeTimer) return;
    fadeStep();
  }
  function showTooltip(node, attrs) {
    const lines = [];
    lines.push("<div class='tt-title'>" + escapeHtml(attrs.name) + "</div>");
    if (attrs.name_en) lines.push("<div class='tt-sub'>" + escapeHtml(attrs.name_en) + "</div>");
    if (attrs.description) lines.push("<div class='tt-desc'>" + escapeHtml(attrs.description) + "</div>");
    lines.push("<div class='tt-meta'>" + (attrs.kind === "core" ? "\u6838\u5FC3\u6A21\u7EC4" : "\u5916\u90E8\u5F15\u7528") + " \xB7 " + escapeHtml(attrs.category || "\u65E0\u5206\u7C7B") + "</div>");
    if (attrs.status) lines.push("<div class='tt-meta'>\u72B6\u6001\uFF1A" + escapeHtml(attrs.status) + "</div>");
    lines.push("<div class='tt-stats'>\u6D4F\u89C8\u91CF " + formatNum(attrs.views) + " \xB7 \u6536\u85CF " + formatNum(attrs.favorites) + "</div>");
    lines.push("<div class='tt-stats'>\u88AB\u4F9D\u8D56 " + attrs.in_degree + " \xB7 \u4F9D\u8D56 " + attrs.out_degree + " \xB7 PageRank " + attrs.pagerank.toFixed(5) + "</div>");
    lines.push("<div class='tt-hint'>\u70B9\u51FB\u8DF3\u8F6C mcmod \u9875\u9762</div>");
    tooltipEl.innerHTML = lines.join("");
    tooltipEl.classList.remove("hidden");
    positionTooltip();
  }
  function hideTooltip() {
    tooltipEl.classList.add("hidden");
  }
  function positionTooltip() {
    const pad = 12;
    const w = tooltipEl.offsetWidth;
    const h = tooltipEl.offsetHeight;
    let x = lastMouse.x + pad;
    let y = lastMouse.y + pad;
    if (x + w > window.innerWidth) x = lastMouse.x - w - pad;
    if (y + h > window.innerHeight) y = lastMouse.y - h - pad;
    tooltipEl.style.left = x + "px";
    tooltipEl.style.top = y + "px";
  }
  let lastMouse = { x: 0, y: 0 };
  window.addEventListener("mousemove", (e) => {
    lastMouse = { x: e.clientX, y: e.clientY };
    if (!tooltipEl.classList.contains("hidden")) positionTooltip();
  });
  document.addEventListener("click", (e) => {
    if (!contextMenu.contains(e.target)) hideContextMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideContextMenu();
  });
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[c]);
  }
  function hideContextMenu() {
    contextMenu.classList.add("hidden");
  }
  function collectRelations(key) {
    const dependsOn = /* @__PURE__ */ new Set();
    const dependedBy = /* @__PURE__ */ new Set();
    const interacts = /* @__PURE__ */ new Set();
    graph.outEdges(key).forEach((e) => {
      const kind = graph.getEdgeAttribute(e, "kind");
      const t = graph.target(e);
      if (kind === "interaction") interacts.add(t);
      else dependsOn.add(t);
    });
    graph.inEdges(key).forEach((e) => {
      const kind = graph.getEdgeAttribute(e, "kind");
      const s = graph.source(e);
      if (kind === "interaction") interacts.add(s);
      else dependedBy.add(s);
    });
    const byInDegree = (a, b) => (graph.getNodeAttribute(b, "in_degree") || 0) - (graph.getNodeAttribute(a, "in_degree") || 0);
    return {
      dependsOn: [...dependsOn].sort(byInDegree),
      dependedBy: [...dependedBy].sort(byInDegree),
      interacts: [...interacts].sort(byInDegree)
    };
  }
  function filterRelations(keys, query) {
    const q = query.trim().toLowerCase();
    if (!q) return keys;
    return keys.filter((key) => {
      const attrs = graph.getNodeAttributes(key);
      const name = (attrs.name || "").toLowerCase();
      const en = (attrs.name_en || "").toLowerCase();
      return name.includes(q) || en.includes(q) || key.includes(q);
    });
  }
  function positionMenu(x, y) {
    const w = contextMenu.offsetWidth;
    const h = contextMenu.offsetHeight;
    contextMenu.style.left = Math.max(4, Math.min(x, window.innerWidth - w - 8)) + "px";
    contextMenu.style.top = Math.max(4, Math.min(y, window.innerHeight - h - 8)) + "px";
  }
  function nodeDetailText(key) {
    const attrs = graph.getNodeAttributes(key);
    const lines = [];
    lines.push(attrs.name || key);
    if (attrs.name_en) lines.push(attrs.name_en);
    lines.push("class " + key);
    lines.push("\u88AB\u4F9D\u8D56 " + attrs.in_degree + " \xB7 \u4F9D\u8D56 " + attrs.out_degree);
    lines.push("\u6D4F\u89C8\u91CF " + formatNum(attrs.views));
    lines.push("\u6536\u85CF " + formatNum(attrs.favorites));
    if (attrs.category) lines.push("\u5206\u7C7B " + attrs.category);
    if (attrs.status) lines.push("\u72B6\u6001 " + attrs.status);
    return lines.join("\n");
  }
  const REL_LABELS = { dependsOn: "\u4F9D\u8D56", dependedBy: "\u88AB\u4F9D\u8D56", interacts: "\u8054\u52A8" };
  function contextItem(key, badgeType) {
    const attrs = graph.getNodeAttributes(key);
    const div = document.createElement("div");
    div.className = "ctx-item";
    if (badgeType) {
      const badge = document.createElement("span");
      badge.className = "ctx-badge " + badgeType;
      badge.textContent = REL_LABELS[badgeType] || badgeType;
      div.appendChild(badge);
    }
    const span = document.createElement("span");
    span.textContent = (attrs.name || key) + (attrs.name_en ? " (" + attrs.name_en + ")" : "");
    div.appendChild(span);
    div.title = nodeDetailText(key);
    div.addEventListener("click", () => {
      hideContextMenu();
      focusNode(key);
    });
    return div;
  }
  function findShortestPath(source, target) {
    if (source === target) return { path: [source], hops: [] };
    const prevNode = /* @__PURE__ */ new Map();
    const prevEdge = /* @__PURE__ */ new Map();
    const queue = [source];
    let head = 0;
    prevNode.set(source, null);
    while (head < queue.length) {
      const cur = queue[head++];
      for (const nb of graph.neighbors(cur)) {
        if (!prevNode.has(nb)) {
          prevNode.set(nb, cur);
          prevEdge.set(nb, graph.edges(cur, nb)[0]);
          if (nb === target) {
            const path = [];
            const hops = [];
            let p = target;
            while (prevNode.get(p) !== null) {
              path.push(p);
              hops.push(prevEdge.get(p));
              p = prevNode.get(p);
            }
            path.push(source);
            path.reverse();
            hops.reverse();
            return { path, hops };
          }
          queue.push(nb);
        }
      }
    }
    return { error: "\u4E0D\u5B58\u5728\u8DEF\u5F84" };
  }
  function applyHighlight(path, hops) {
    highlightNodes.clear();
    highlightEdges.clear();
    if (path && path.length) {
      for (const k of path) highlightNodes.add(k);
    }
    if (hops && hops.length) {
      for (const e of hops) if (e != null) highlightEdges.add(e);
    }
    if (renderer) renderer.refresh();
  }
  function showSixDegreesMenu(source, x, y) {
    const state = { query: "", page: 0, target: null, result: null };
    contextMenu.innerHTML = "";
    const titleEl = document.createElement("div");
    titleEl.className = "ctx-title ctx-title-row";
    const backBtn = document.createElement("button");
    backBtn.className = "ctx-six";
    backBtn.textContent = "\u2190 \u8FD4\u56DE";
    backBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showNodeMenu(source, x, y);
    });
    titleEl.appendChild(backBtn);
    const titleText = document.createElement("span");
    titleText.className = "ctx-title-text";
    titleText.textContent = "\u516D\u5EA6\u5206\u9694";
    titleEl.appendChild(titleText);
    contextMenu.appendChild(titleEl);
    const searchWrap = document.createElement("div");
    searchWrap.className = "ctx-search";
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "\u641C\u7D22\u76EE\u6807\u6A21\u7EC4\u2026";
    searchWrap.appendChild(input);
    contextMenu.appendChild(searchWrap);
    const listEl = document.createElement("div");
    contextMenu.appendChild(listEl);
    const detectBtn = document.createElement("button");
    detectBtn.className = "ctx-detect";
    detectBtn.textContent = "\u68C0\u6D4B";
    detectBtn.disabled = true;
    contextMenu.appendChild(detectBtn);
    const resultEl = document.createElement("div");
    resultEl.className = "ctx-six-result";
    contextMenu.appendChild(resultEl);
    function renderList() {
      listEl.innerHTML = "";
      const q = state.query.trim().toLowerCase();
      let matches = [];
      if (q) {
        const seen = /* @__PURE__ */ new Set();
        for (const [term, nodes] of searchIndex) {
          if (term.includes(q)) {
            for (const n of nodes) {
              if (!seen.has(n.key)) {
                seen.add(n.key);
                matches.push(n);
              }
            }
          }
        }
      } else {
        matches = [...allNodes];
      }
      matches.sort((a, b) => (b.views || 0) - (a.views || 0));
      const pageSize = 20;
      const pages = Math.max(1, Math.ceil(matches.length / pageSize));
      if (state.page >= pages) state.page = pages - 1;
      const start = state.page * pageSize;
      const page = matches.slice(start, start + pageSize);
      for (const n of page) {
        const li = document.createElement("div");
        li.className = "ctx-item" + (state.target === n.key ? " selected" : "");
        li.textContent = n.label + (n.name_en ? " (" + n.name_en + ")" : "");
        li.title = "class " + n.key;
        li.addEventListener("click", (e) => {
          e.stopPropagation();
          state.target = n.key;
          detectBtn.disabled = false;
          renderList();
          positionMenu(x, y);
        });
        listEl.appendChild(li);
      }
      if (pages > 1) {
        listEl.appendChild(buildPagination(pages, state.page, (p) => {
          state.page = p;
          renderList();
          positionMenu(x, y);
        }));
      }
    }
    function renderResult() {
      resultEl.innerHTML = "";
      if (!state.result) return;
      if (state.result.error) {
        const empty = document.createElement("div");
        empty.className = "ctx-empty";
        empty.textContent = state.result.error;
        resultEl.appendChild(empty);
        return;
      }
      const path = state.result.path;
      for (let i = 0; i < path.length; i++) {
        const nodeEl = document.createElement("div");
        nodeEl.className = "ctx-six-path";
        const attrs = graph.getNodeAttributes(path[i]);
        nodeEl.textContent = i + 1 + ". " + (attrs.name || path[i]);
        nodeEl.title = nodeDetailText(path[i]);
        nodeEl.addEventListener("click", () => {
          hideContextMenu();
          focusNode(path[i]);
        });
        resultEl.appendChild(nodeEl);
        if (i < path.length - 1) {
          const arrow = document.createElement("div");
          arrow.className = "ctx-six-arrow";
          arrow.appendChild(document.createTextNode("\u2193 "));
          const hop = state.result.hops[i];
          const kind = graph.getEdgeAttribute(hop, "kind");
          const groupName = graph.getEdgeAttribute(hop, "group_name") || "";
          let label;
          let cls;
          if (kind === "interaction") {
            label = "\u8054\u52A8";
            cls = "interaction";
          } else {
            const s = graph.source(hop);
            label = s === path[i] ? "\u4F9D\u8D56" : "\u88AB\u4F9D\u8D56";
            cls = "dependency";
          }
          const span = document.createElement("span");
          span.className = "ctx-six-rel " + cls;
          span.textContent = label + (groupName ? " \xB7 " + groupName : "");
          arrow.appendChild(span);
          resultEl.appendChild(arrow);
        }
      }
      const info = document.createElement("div");
      info.className = "ctx-six-info";
      info.textContent = "\u5171 " + (path.length - 1) + " \u8DF3 \xB7 " + path.length + " \u4E2A\u8282\u70B9";
      resultEl.appendChild(info);
    }
    function detect() {
      const result = findShortestPath(source, state.target);
      state.result = result;
      applyHighlight(result.path || null, result.hops || null);
      renderResult();
      positionMenu(x, y);
    }
    detectBtn.addEventListener("click", detect);
    input.addEventListener("input", () => {
      state.query = input.value;
      state.page = 0;
      state.target = null;
      detectBtn.disabled = true;
      renderList();
      positionMenu(x, y);
    });
    renderList();
    contextMenu.classList.remove("hidden");
    positionMenu(x, y);
    input.focus();
  }
  function showNodeMenu(node, x, y) {
    const attrs = graph.getNodeAttributes(node);
    const rel = collectRelations(node);
    const state = { title: attrs.name || node, rel, tab: "all", page: 0, query: "" };
    contextMenu.innerHTML = "";
    const titleEl = document.createElement("div");
    titleEl.className = "ctx-title ctx-title-row";
    const titleText = document.createElement("span");
    titleText.className = "ctx-title-text";
    titleText.textContent = state.title;
    titleEl.appendChild(titleText);
    const sixBtn = document.createElement("button");
    sixBtn.className = "ctx-six";
    sixBtn.textContent = "\u516D\u5EA6\u5206\u9694";
    sixBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showSixDegreesMenu(node, x, y);
    });
    titleEl.appendChild(sixBtn);
    contextMenu.appendChild(titleEl);
    const searchWrap = document.createElement("div");
    searchWrap.className = "ctx-search";
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "\u641C\u7D22\u5173\u8054\u6A21\u7EC4\u2026";
    searchWrap.appendChild(input);
    contextMenu.appendChild(searchWrap);
    const tabs = document.createElement("div");
    tabs.className = "ctx-tabs";
    contextMenu.appendChild(tabs);
    const body = document.createElement("div");
    contextMenu.appendChild(body);
    const TAB_DEFS = [
      { key: "all", label: "\u5168\u90E8" },
      { key: "dependsOn", label: "\u4F9D\u8D56" },
      { key: "dependedBy", label: "\u88AB\u4F9D\u8D56" },
      { key: "interacts", label: "\u8054\u52A8" }
    ];
    function tabCount(key) {
      if (key === "all") {
        return state.rel.dependsOn.length + state.rel.dependedBy.length + state.rel.interacts.length;
      }
      return state.rel[key].length;
    }
    function activeList() {
      const items = [];
      if (state.tab === "all") {
        for (const key of state.rel.dependsOn) items.push({ key, type: "dependsOn" });
        for (const key of state.rel.dependedBy) items.push({ key, type: "dependedBy" });
        for (const key of state.rel.interacts) items.push({ key, type: "interacts" });
        items.sort(
          (a, b) => (graph.getNodeAttribute(b.key, "in_degree") || 0) - (graph.getNodeAttribute(a.key, "in_degree") || 0)
        );
      } else {
        for (const key of state.rel[state.tab]) items.push({ key, type: null });
      }
      return items;
    }
    function renderTabs() {
      tabs.innerHTML = "";
      for (const def of TAB_DEFS) {
        const t = document.createElement("button");
        t.className = "ctx-tab" + (state.tab === def.key ? " active" : "");
        t.textContent = def.label + " " + tabCount(def.key);
        t.addEventListener("click", (e) => {
          e.stopPropagation();
          state.tab = def.key;
          state.page = 0;
          renderTabs();
          renderBody();
          positionMenu(x, y);
        });
        tabs.appendChild(t);
      }
    }
    function renderBody() {
      body.innerHTML = "";
      const q = state.query.trim().toLowerCase();
      let list = activeList();
      if (q) {
        list = list.filter((item) => {
          const a = graph.getNodeAttributes(item.key);
          const name = (a.name || "").toLowerCase();
          const en = (a.name_en || "").toLowerCase();
          return name.includes(q) || en.includes(q) || item.key.includes(q);
        });
      }
      const pageSize = 20;
      const pages = Math.max(1, Math.ceil(list.length / pageSize));
      if (state.page >= pages) state.page = pages - 1;
      const start = state.page * pageSize;
      const page = list.slice(start, start + pageSize);
      if (!list.length) {
        const empty = document.createElement("div");
        empty.className = "ctx-empty";
        empty.textContent = "\u65E0\u5339\u914D";
        body.appendChild(empty);
      } else {
        for (const item of page) body.appendChild(contextItem(item.key, item.type));
        if (pages > 1) {
          body.appendChild(buildPagination(pages, state.page, (p) => {
            state.page = p;
            renderBody();
            positionMenu(x, y);
          }));
        }
      }
    }
    renderTabs();
    renderBody();
    contextMenu.classList.remove("hidden");
    positionMenu(x, y);
    input.addEventListener("input", () => {
      state.query = input.value;
      state.page = 0;
      renderBody();
      positionMenu(x, y);
    });
    input.focus();
  }
  function showEdgeMenu(edge, x, y) {
    const source = graph.source(edge);
    const target = graph.target(edge);
    contextMenu.innerHTML = "";
    const titleEl = document.createElement("div");
    titleEl.className = "ctx-title";
    titleEl.textContent = "\u5173\u7CFB";
    contextMenu.appendChild(titleEl);
    const st = document.createElement("div");
    st.className = "ctx-section-title";
    st.textContent = "\u4E24\u7AEF (2)";
    contextMenu.appendChild(st);
    contextMenu.appendChild(contextItem(source));
    contextMenu.appendChild(contextItem(target));
    contextMenu.classList.remove("hidden");
    positionMenu(x, y);
  }
  function drawEdges(ctx, tx, ty, scale2) {
    graph.forEachEdge((edge, attrs, source, target, sa, ta) => {
      const rgb = attrs.rgb || DEPENDENCY_EDGE_RGB;
      ctx.strokeStyle = rgbaString(rgb, EDGE_ALPHA);
      ctx.lineWidth = Math.max(1, (attrs.size || 0.5) * scale2);
      ctx.beginPath();
      ctx.moveTo(tx(sa.x), ty(sa.y));
      ctx.lineTo(tx(ta.x), ty(ta.y));
      ctx.stroke();
    });
  }
  function drawLabel(ctx, cx, cy, r, attrs) {
    const name = attrs.name || attrs.key;
    const idText = "class " + attrs.key;
    const fontSize = LABEL_FONT_SIZE;
    const lineHeight = fontSize * 1.25;
    ctx.font = fontSize + 'px "Microsoft YaHei", "PingFang SC", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const nameW = ctx.measureText(name).width;
    const idW = ctx.measureText(idText).width;
    const maxW = Math.max(nameW, idW);
    const padX = fontSize * 0.35;
    const padY = fontSize * 0.2;
    const bx = cx - maxW / 2 - padX;
    const by = cy + r + fontSize * 0.35;
    const bw = maxW + padX * 2;
    const bh = lineHeight * 2 + padY * 2;
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = "#e6e6e6";
    ctx.fillText(name, cx, by + padY);
    ctx.fillStyle = "#9fb0c3";
    ctx.fillText(idText, cx, by + padY + lineHeight);
  }
  async function drawNodesAt(ctx, items, onProgress) {
    const total = items.length;
    let idx = 0;
    let done = 0;
    const CONCURRENCY = 64;
    async function worker() {
      while (idx < total) {
        const i = idx++;
        const item = items[i];
        const attrs = item.attrs;
        const cx = item.cx, cy = item.cy, r = item.r;
        let img = null;
        if (attrs.image) {
          img = new Image();
          img.src = attrs.image;
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        if (img && img.naturalWidth > 0) {
          const iw = img.naturalWidth;
          const ih = img.naturalHeight;
          const s = Math.max(r * 2 / iw, r * 2 / ih);
          const dw = iw * s;
          const dh = ih * s;
          ctx.save();
          ctx.clip();
          ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
          ctx.restore();
        } else {
          ctx.fillStyle = attrs.color || "#888888";
          ctx.fill();
        }
        drawLabel(ctx, cx, cy, r, attrs);
        done++;
        if (onProgress) onProgress(done, total);
      }
    }
    const workers = [];
    for (let w = 0; w < CONCURRENCY; w++) workers.push(worker());
    await Promise.all(workers);
  }
  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("\u5BFC\u51FA PNG \u5931\u8D25"));
      }, "image/png");
    });
  }
  async function renderSingle(W, H, scale2, nodePixels, toX, toY) {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);
    drawEdges(ctx, toX, toY, scale2);
    const items = nodePixels.map((n) => ({ attrs: n.attrs, cx: n.px, cy: n.py, r: n.pr }));
    const startTime = Date.now();
    await drawNodesAt(ctx, items, (done, total) => {
      const now = Date.now();
      const pct = Math.round(done / total * 100);
      const elapsed = now - startTime;
      const speed = done / Math.max(1, elapsed);
      const remaining = speed > 0 ? (total - done) / speed : 0;
      exportButton.textContent = "\u5BFC\u51FA\u4E2D " + pct + "% \xB7 \u5269\u4F59 " + formatDuration(remaining);
    });
    return canvasToBlob(canvas);
  }
  async function renderTiled(W, H, scale2, nodePixels, toX, toY) {
    const TILE_W = 8192;
    const TILE_H = 1024;
    const cols = Math.ceil(W / TILE_W);
    const rows = Math.ceil(H / TILE_H);
    const totalTiles = cols * rows;
    let renderedTiles = 0;
    const startTime = Date.now();
    async function* getScanlines() {
      for (let r = 0; r < rows; r++) {
        const tileY0 = r * TILE_H;
        const tileH = Math.min(TILE_H, H - tileY0);
        const colData = [];
        for (let c = 0; c < cols; c++) {
          const tileX0 = c * TILE_W;
          const tileW = Math.min(TILE_W, W - tileX0);
          const canvas = document.createElement("canvas");
          canvas.width = tileW;
          canvas.height = tileH;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, tileW, tileH);
          const tx = (x) => toX(x) - tileX0;
          const ty = (y) => toY(y) - tileY0;
          drawEdges(ctx, tx, ty, scale2);
          const items = [];
          for (const n of nodePixels) {
            const labelBottom = LABEL_FONT_SIZE * 3.25;
            const labelHalf = Math.max(n.pr, LABEL_FONT_SIZE * 16);
            if (n.px + labelHalf >= tileX0 && n.px - labelHalf <= tileX0 + tileW && n.py + n.pr + labelBottom >= tileY0 && n.py - n.pr <= tileY0 + tileH) {
              items.push({ attrs: n.attrs, cx: n.px - tileX0, cy: n.py - tileY0, r: n.pr });
            }
          }
          await drawNodesAt(ctx, items, null);
          const imgData = ctx.getImageData(0, 0, tileW, tileH);
          colData.push({ tileW, data: imgData.data });
          renderedTiles++;
          const now = Date.now();
          const pct = Math.round(renderedTiles / totalTiles * 100);
          const elapsed = now - startTime;
          const speed = renderedTiles / Math.max(1, elapsed);
          const remaining = speed > 0 ? (totalTiles - renderedTiles) / speed : 0;
          exportButton.textContent = "\u5BFC\u51FA\u4E2D " + pct + "% \xB7 \u5269\u4F59 " + formatDuration(remaining);
        }
        const fullRowBytes = W * 4;
        for (let y = 0; y < tileH; y++) {
          const row = new Uint8Array(fullRowBytes + 1);
          row[0] = 0;
          let offset = 1;
          for (const cd of colData) {
            const start = y * cd.tileW * 4;
            row.set(cd.data.subarray(start, start + cd.tileW * 4), offset);
            offset += cd.tileW * 4;
          }
          yield row;
        }
      }
    }
    return encodePNG(W, H, getScanlines);
  }
  async function exportPNG() {
    if (!graph) return;
    const W = parseInt(exportWidth.value, 10) || 65536;
    const H = parseInt(exportHeight.value, 10) || 65536;
    exportButton.disabled = true;
    exportButton.textContent = "\u5BFC\u51FA\u4E2D\u2026";
    try {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      const nodes = [];
      graph.forEachNode((node, attrs) => {
        nodes.push({ ...attrs, key: node });
        const r = attrs.size || 0;
        if (attrs.x - r < minX) minX = attrs.x - r;
        if (attrs.x + r > maxX) maxX = attrs.x + r;
        if (attrs.y - r < minY) minY = attrs.y - r;
        if (attrs.y + r > maxY) maxY = attrs.y + r;
      });
      const pad = Math.max(maxX - minX, maxY - minY) * 0.02;
      minX -= pad;
      maxX += pad;
      minY -= pad;
      maxY += pad;
      const bw = maxX - minX, bh = maxY - minY;
      const scale2 = Math.min(W / bw, H / bh);
      const ox = (W - bw * scale2) / 2;
      const oy = (H - bh * scale2) / 2;
      const toX = (x) => (x - minX) * scale2 + ox;
      const toY = (y) => (y - minY) * scale2 + oy;
      const nodePixels = nodes.map((attrs) => ({
        attrs,
        px: toX(attrs.x),
        py: toY(attrs.y),
        pr: attrs.size * scale2
      }));
      const SINGLE_MAX = 16384;
      const blob = W < SINGLE_MAX && H < SINGLE_MAX ? await renderSingle(W, H, scale2, nodePixels, toX, toY) : await renderTiled(W, H, scale2, nodePixels, toX, toY);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mcmod-graph-" + W + "x" + H + ".png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[\u9519\u8BEF] \u5BFC\u51FA PNG \u5931\u8D25", err);
      exportButton.textContent = "\u5BFC\u51FA\u5931\u8D25";
      setTimeout(() => {
        exportButton.textContent = "\u4E0B\u8F7D\u6E32\u67D3\u56FE";
      }, 2e3);
    } finally {
      exportButton.disabled = false;
      if (exportButton.textContent.startsWith("\u5BFC\u51FA\u4E2D")) {
        exportButton.textContent = "\u4E0B\u8F7D\u6E32\u67D3\u56FE";
      }
    }
  }
  boot().catch((err) => {
    statusText.textContent = "\u51FA\u9519\u4E86\uFF1A" + err.message;
    progressLabel.textContent = "";
    console.error("[\u9519\u8BEF]", err);
  });
}
main();
//# sourceMappingURL=main.bundle.js.map
