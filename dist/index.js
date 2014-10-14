"format register";

System.register("utils", [], function($__export) {
  "use strict";
  var __moduleName = "utils";
  var junkLines;
  function junk() {
    return junkLines[(Math.random() * junkLines.length - 1) | 0];
  }
  $__export("junk", junk);
  return {
    setters: [],
    execute: function() {
      junkLines = ['this is a junk line to test scrolling', 'some more junk', 'an apple a day', 'steaming', 'for the glory of old Russia', 'spongebob and squidwert', 'it is late', 'inside and outside', 'feed me more junk', 'isnt there a URL for this?', 'its all I have', 'this is risking a typo', 'this is a stupid way of doing this'];
    }
  };
});

(function() {
function define(){};  define.amd = {};
  (function() {
    'use strict';
    function EventEmitter() {}
    var proto = EventEmitter.prototype;
    var exports = this;
    var originalGlobalValue = exports.EventEmitter;
    function indexOfListener(listeners, listener) {
      var i = listeners.length;
      while (i--) {
        if (listeners[i].listener === listener) {
          return i;
        }
      }
      return -1;
    }
    function alias(name) {
      return function aliasClosure() {
        return this[name].apply(this, arguments);
      };
    }
    proto.getListeners = function getListeners(evt) {
      var events = this._getEvents();
      var response;
      var key;
      if (evt instanceof RegExp) {
        response = {};
        for (key in events) {
          if (events.hasOwnProperty(key) && evt.test(key)) {
            response[key] = events[key];
          }
        }
      } else {
        response = events[evt] || (events[evt] = []);
      }
      return response;
    };
    proto.flattenListeners = function flattenListeners(listeners) {
      var flatListeners = [];
      var i;
      for (i = 0; i < listeners.length; i += 1) {
        flatListeners.push(listeners[i].listener);
      }
      return flatListeners;
    };
    proto.getListenersAsObject = function getListenersAsObject(evt) {
      var listeners = this.getListeners(evt);
      var response;
      if (listeners instanceof Array) {
        response = {};
        response[evt] = listeners;
      }
      return response || listeners;
    };
    proto.addListener = function addListener(evt, listener) {
      var listeners = this.getListenersAsObject(evt);
      var listenerIsWrapped = typeof listener === 'object';
      var key;
      for (key in listeners) {
        if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
          listeners[key].push(listenerIsWrapped ? listener : {
            listener: listener,
            once: false
          });
        }
      }
      return this;
    };
    proto.on = alias('addListener');
    proto.addOnceListener = function addOnceListener(evt, listener) {
      return this.addListener(evt, {
        listener: listener,
        once: true
      });
    };
    proto.once = alias('addOnceListener');
    proto.defineEvent = function defineEvent(evt) {
      this.getListeners(evt);
      return this;
    };
    proto.defineEvents = function defineEvents(evts) {
      for (var i = 0; i < evts.length; i += 1) {
        this.defineEvent(evts[i]);
      }
      return this;
    };
    proto.removeListener = function removeListener(evt, listener) {
      var listeners = this.getListenersAsObject(evt);
      var index;
      var key;
      for (key in listeners) {
        if (listeners.hasOwnProperty(key)) {
          index = indexOfListener(listeners[key], listener);
          if (index !== -1) {
            listeners[key].splice(index, 1);
          }
        }
      }
      return this;
    };
    proto.off = alias('removeListener');
    proto.addListeners = function addListeners(evt, listeners) {
      return this.manipulateListeners(false, evt, listeners);
    };
    proto.removeListeners = function removeListeners(evt, listeners) {
      return this.manipulateListeners(true, evt, listeners);
    };
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
      var i;
      var value;
      var single = remove ? this.removeListener : this.addListener;
      var multiple = remove ? this.removeListeners : this.addListeners;
      if (typeof evt === 'object' && !(evt instanceof RegExp)) {
        for (i in evt) {
          if (evt.hasOwnProperty(i) && (value = evt[i])) {
            if (typeof value === 'function') {
              single.call(this, i, value);
            } else {
              multiple.call(this, i, value);
            }
          }
        }
      } else {
        i = listeners.length;
        while (i--) {
          single.call(this, evt, listeners[i]);
        }
      }
      return this;
    };
    proto.removeEvent = function removeEvent(evt) {
      var type = typeof evt;
      var events = this._getEvents();
      var key;
      if (type === 'string') {
        delete events[evt];
      } else if (evt instanceof RegExp) {
        for (key in events) {
          if (events.hasOwnProperty(key) && evt.test(key)) {
            delete events[key];
          }
        }
      } else {
        delete this._events;
      }
      return this;
    };
    proto.removeAllListeners = alias('removeEvent');
    proto.emitEvent = function emitEvent(evt, args) {
      var listeners = this.getListenersAsObject(evt);
      var listener;
      var i;
      var key;
      var response;
      for (key in listeners) {
        if (listeners.hasOwnProperty(key)) {
          i = listeners[key].length;
          while (i--) {
            listener = listeners[key][i];
            if (listener.once === true) {
              this.removeListener(evt, listener.listener);
            }
            response = listener.listener.apply(this, args || []);
            if (response === this._getOnceReturnValue()) {
              this.removeListener(evt, listener.listener);
            }
          }
        }
      }
      return this;
    };
    proto.trigger = alias('emitEvent');
    proto.emit = function emit(evt) {
      var args = Array.prototype.slice.call(arguments, 1);
      return this.emitEvent(evt, args);
    };
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
      this._onceReturnValue = value;
      return this;
    };
    proto._getOnceReturnValue = function _getOnceReturnValue() {
      if (this.hasOwnProperty('_onceReturnValue')) {
        return this._onceReturnValue;
      } else {
        return true;
      }
    };
    proto._getEvents = function _getEvents() {
      return this._events || (this._events = {});
    };
    EventEmitter.noConflict = function noConflict() {
      exports.EventEmitter = originalGlobalValue;
      return EventEmitter;
    };
    if (typeof define === 'function' && define.amd) {
      System.register("eventEmitter", [], false, function() {
        return EventEmitter;
      });
    } else if (typeof module === 'object' && module.exports) {
      module.exports = EventEmitter;
    } else {
      exports.EventEmitter = EventEmitter;
    }
  }.call(this));
  })();
System.register("index", ["utils", "eventEmitter"], function($__export) {
  "use strict";
  var __moduleName = "index";
  var junk,
      EventEmitter;
  return {
    setters: [function(m) {
      junk = m.junk;
    }, function(m) {
      EventEmitter = m.default;
    }],
    execute: function() {
      $__export('default', (function($__super) {
        var Screen = function Screen(el, opts) {
          this.parent = el;
          this.el = this.createElement();
          this.opts = Object.assign({
            cols: 80,
            rows: 24
          }, opts || {});
          this.insertStyle();
          this.parent.classList.add('tatty');
          this.lineHeight = 19;
          this.height = 'default';
          this.width = 'default';
          this.lines = [];
          this.cursor = {
            x: -1,
            y: -1
          };
        };
        return ($traceurRuntime.createClass)(Screen, {
          write: function(chars) {
            if (this.cursor.x < 0) {
              this.createLine();
              this.cursor.x = 0;
              this.cursor.y = 0;
            }
            var line = this.el.querySelectorAll('.line')[this.cursor.y];
            var contents = line.innerHTML;
            var newline = contents.slice(0, this.cursor.x) + chars + contents.slice(this.cursor.x, contents.length);
            this.cursor.x += chars.length + 1;
            if (newline.length <= this.opts.cols) {
              line.innerHTML = newline;
              return;
            }
            var newlines = this.splitLine(newline);
            this.lines.splice(this.cursor.y, 1);
            for (var i = 0; i < newlines.length; i++) {
              var l = this.createLine({append: false});
              l.innerHTML = newlines[i];
              this.appendLine(l, this.cursor.y);
              this.cursor.y++;
            }
          },
          writeln: function(chars) {
            var lines = this.splitLine(chars);
            for (var i = 0; i < lines.length; i++) {
              var line = this.createLine();
              line.innerHTML = lines[i];
              this.cursor.x = lines[i].length + 1;
            }
            this.cursor.y = this.lines.length - 1;
          },
          prompt: function() {
            var cmd = this.createLine();
            cmd.innerHTML = '&nbsp>&nbsp';
            this.cursor.y = this.lines.length - 1;
            this.cursor.x = cmd.innerHTML.length + 1;
            this.trigger('prompt', [true]);
          },
          set height(h) {
            if (!this.el)
              return;
            if (h === 'default') {
              this.parent.style.height = this.opts.rows * this.lineHeight + 'px';
              return;
            }
            this.parent.style.height = h + 'px';
          },
          get height() {
            if (!this.el)
              return;
            return ~~this.parent.style.height.replace('px', '');
          },
          set width(w) {
            if (!this.el)
              return;
            if (w === 'default') {
              this.parent.style.width = this.opts.cols * this.charWidth + 'px';
              return;
            }
            this.parent.style.width = w + 'px';
          },
          get width() {
            if (!this.el)
              return;
            return ~~this.parent.style.width.replace('px', '');
          },
          get charWidth() {
            var el = document.createElement('span');
            el.style.opacity = 0;
            el.innerHTML = 'm';
            this.parent.appendChild(el);
            var fontWidth = el.offsetWidth;
            this.parent.removeChild(el);
            return fontWidth;
          },
          get bufferSize() {
            return this.opts.cols * this.opts.rows;
          },
          createLine: function(options) {
            var opts = Object.assign({append: true}, options || {});
            var div = document.createElement('div');
            div.classList.add('line');
            div.style.top = this.lineHeight * this.lines.length + 'px';
            div.style.width = this.width + 'px';
            if (opts.append) {
              this.appendLine(div, this.lines.length);
            }
            return div;
          },
          appendLine: function(div) {
            var position = arguments[1] !== (void 0) ? arguments[1] : this.lines.length;
            this.el.appendChild(div);
            if (position > this.lines.length) {
              this.lines.push(div);
            } else {
              this.lines.splice(position, 0, div);
              this.resetLines();
            }
            this.el.style.width = this.width + 'px';
            this.el.style.height = this.lines.length * this.lineHeight + 'px';
            this.showLastLine();
          },
          showLastLine: function() {
            this.el.style.transform = 'translatey(-' + ((this.lines.length * this.lineHeight) - (this.lineHeight * this.opts.rows)) + 'px )';
          },
          resetLines: function() {
            this.el.innerHTML = '';
            for (var i = 0; i < this.lines.length; i++) {
              this.lines[i].style.width = this.width + 'px';
              this.lines[i].style.top = i * this.lineHeight + 'px';
              this.el.appendChild(this.lines[i]);
            }
          },
          insertStyle: function() {
            var style = document.createElement('style');
            style.id = 'tatty';
            style.innerHTML = "\n            .tatty {\n                position: relative;\n                background:white;\n                color: #333a3c;\n                font-family: 'Source Code Pro';\n                font-size: 15px;\n                -webkit-font-smoothing: antialiased;\n                -moz-osx-font-smoothing: grayscale;\n                overflow: hidden;\n            }\n            .tatty .inner {\n                position: absolute;\n            }\n            .tatty .line {\n                position: absolute;\n            }\n        ";
            var head = document.querySelector('head');
            head.appendChild(style);
          },
          createElement: function() {
            var el = document.createElement('div');
            el.classList.add('inner');
            this.parent.appendChild(el);
            return el;
          },
          splitLine: function(chars) {
            if (chars.length <= this.opts.cols) {
              return [chars];
            }
            function findLastSpacePosition(start) {
              var i = start;
              while (chars[i] !== ' ') {
                i--;
                if (i < 0)
                  break;
              }
              return i < 0 ? this.opts.cols : i;
            }
            function strip(start, end) {
              var tmp = chars.slice(start, end);
              chars = chars.slice(end + 1, chars.length);
              return tmp;
            }
            var output = [];
            while (chars.length > this.opts.cols) {
              output.push(strip(0, findLastSpacePosition(this.opts.cols)));
            }
            output.push(chars);
            return output;
          },
          clear: function() {
            this.lines = [];
            this.el.innerHTML = '';
            this.cursor.x = -1;
            this.cursor.y = -1;
          }
        }, {}, $__super);
      }(EventEmitter)));
    }
  };
});
