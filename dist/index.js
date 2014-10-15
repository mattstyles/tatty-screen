"format register";

System.register("utils", ["EventEmitter"], function($__export) {
  "use strict";
  var __moduleName = "utils";
  var EventEmitter,
      position,
      Point;
  return {
    setters: [function(m) {
      EventEmitter = m.default;
    }],
    execute: function() {
      position = {
        x: 0,
        y: 0
      };
      Point = $__export("Point", (function($__super) {
        var Point = function Point(x, y) {
          if (typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
            return;
          }
          this.x = x || 0;
          this.y = y || 0;
        };
        return ($traceurRuntime.createClass)(Point, {
          set x(j) {
            position.x = j;
            this.emit('changeX', position.x);
          },
          set y(k) {
            position.y = k;
            this.emit('changeY', position.y);
          },
          get x() {
            return position.x;
          },
          get y() {
            return position.y;
          },
          debug: function() {
            var id = arguments[0] !== (void 0) ? arguments[0] : 'Point';
            console.log(id, position.x, position.y);
          }
        }, {}, $__super);
      }(EventEmitter)));
    }
  };
});

System.register("index", ["utils", "EventEmitter"], function($__export) {
  "use strict";
  var __moduleName = "index";
  var Point,
      EventEmitter;
  return {
    setters: [function(m) {
      Point = m.Point;
    }, function(m) {
      EventEmitter = m.default;
    }],
    execute: function() {
      $__export('default', (function($__super) {
        var Screen = function Screen(el, opts, modules) {
          this.opts = Object.assign({
            cols: 80,
            rows: 24,
            scan: true,
            scanOffset: 3
          }, opts || {});
          if (Array.isArray(modules)) {
            this.registerModules(modules);
          }
          this.parent = el;
          this.overlay = null;
          this.el = this.createElement();
          this.insertStyle();
          this.parent.classList.add('tatty');
          var style = window.getComputedStyle(this.parent);
          this.charWidth = this.getCharWidth();
          this.lineHeight = style.lineHeight.replace(/px/, '') | 0;
          this.height = 'default';
          this.width = 'default';
          this.cursorElement = this.createCursor();
          this.lines = [];
          this.cursor = new Point({
            x: -1,
            y: -1
          });
          this.flashCursor();
          if (this.opts.scan) {
            this.overlay = this.createScan();
          }
          this.cursor.on('changeX', function() {
            this.cursorElement.style.left = this.cursor.x * this.charWidth + 'px';
          }, this);
          this.cursor.on('changeY', function() {
            this.cursorElement.style.top = this.cursor.y * this.lineHeight + 'px';
          }, this);
          this.on('prompt', function(flag) {
            this.emit('showCursor', flag);
          }, this);
          this.on('showCursor', function(flag) {
            if (!flag && this.cursorTimer) {
              clearTimeout(this.cursorTimer);
              this.cursorElement.classList.add('hidden');
              this.cursorTimer = null;
              return;
            }
            if (!flag) {
              return;
            }
            this.flashCursor();
          }, this);
          this.emit('ready');
        };
        return ($traceurRuntime.createClass)(Screen, {
          write: function(chars) {
            var offset$__1;
            var offset$__2;
            if (!chars) {
              return;
            }
            if (this.cursor.x < 0) {
              this.createLine();
              this.cursor.x = 0;
              this.cursor.y = 0;
            }
            if (this.cursor.y > this.lines.length) {
              offset$__1 = (this.cursor.y - this.lines.length) + 1;
              while (offset$__1) {
                this.createLine();
                offset$__1--;
              }
            }
            var line = this.lines[this.cursor.y];
            var contents = line.innerHTML;
            if (this.cursor.x > contents.length) {
              offset$__2 = this.cursor.x - contents.length;
              while (offset$__2) {
                contents = contents.concat(' ');
                offset$__2--;
              }
            }
            var newline = contents.slice(0, this.cursor.x) + chars + contents.slice(this.cursor.x, contents.length);
            var offset = contents.length - this.cursor.x;
            this.cursor.x += chars.length;
            if (newline.length <= this.opts.cols) {
              line.innerHTML = newline;
              this.emit('prompt', false);
              return;
            }
            var newlines = this.splitLine(newline);
            this.lines.splice(this.cursor.y, 1);
            for (var i = 0; i < newlines.length; i++) {
              var l = this.createLine({append: false});
              l.innerHTML = newlines[i];
              this.appendLine(l, this.cursor.y);
              this.cursor.y++;
              this.cursor.x = l.innerHTML.length - offset;
            }
            this.cursor.y--;
            this.emit('prompt', false);
          },
          writechar: function(chars) {
            if (!chars) {
              return;
            }
            if (this.cursor.x < 0) {
              this.createLine();
              this.cursor.x = 0;
              this.cursor.y = 0;
            }
            if (this.cursor.x >= this.opts.cols) {
              this.createLine();
              this.cursor.x = 0;
              this.cursor.y++;
            }
            this.write(chars[0]);
            this.emit('prompt', false);
          },
          writeln: function(chars) {
            if (!chars) {
              this.createLine();
              this.cursor.x = 0;
              this.cursor.y = this.lines.length - 1;
              this.emit('prompt', false);
              return;
            }
            var lines = this.splitLine(chars);
            for (var i = 0; i < lines.length; i++) {
              var line = this.createLine();
              line.innerHTML = lines[i];
              this.cursor.x = lines[i].length;
            }
            this.cursor.y = this.lines.length - 1;
            this.emit('prompt', false);
          },
          prompt: function() {
            var cmd = this.createLine();
            cmd.innerHTML = '   ';
            cmd.classList.add('prompt');
            this.cursor.y = this.lines.length - 1;
            this.cursor.x = 3;
            var promptElement = this.createPrompt();
            promptElement.style.top = this.cursor.y * this.lineHeight + 'px';
            this.emit('prompt', true);
          },
          setCursor: function() {
            var x = arguments[0] !== (void 0) ? arguments[0] : 0;
            var y = arguments[1] !== (void 0) ? arguments[1] : 0;
            if (typeof x === 'object' || typeof x === 'Point') {
              this.cursor.x = x.x;
              this.cursor.y = x.y;
              return;
            }
            this.cursor.x = x;
            this.cursor.y = y;
          },
          del: function() {
            if (this.lines[this.cursor.y].className.match(/prompt/) && this.cursor.x === 3) {
              return;
            }
            if (this.cursor.x === 0) {
              if (this.cursor.y === 0)
                return;
              this.cursor.y--;
              this.cursor.x = this.lines[this.cursor.y].innerHTML.length;
            }
            var line = this.lines[this.cursor.y];
            var newline = line.innerHTML.slice(0, line.innerHTML.length - 1);
            line.innerHTML = newline;
            this.cursor.x--;
          },
          puts: function() {
            this.writeln.apply(this, arguments);
          },
          putc: function() {
            this.writechar.apply(this, arguments);
          },
          ins: function() {
            this.write.apply(this, arguments);
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
            this.setSize();
            this.showLastLine();
          },
          setSize: function() {
            this.el.style.width = this.width + 'px';
            this.el.style.height = this.lines.length * this.lineHeight + 'px';
            this.overlay.style.width = this.width + 'px';
            this.overlay.style.height = this.lines.length * this.lineHeight + 'px';
          },
          showLastLine: function() {
            this.el.style.transform = 'translatey(-' + ((this.lines.length * this.lineHeight) - (this.lineHeight * this.opts.rows)) + 'px )';
            this.overlay.style.transform = 'translatey(-' + ((this.lines.length * this.lineHeight) - (this.lineHeight * this.opts.rows)) + 'px )';
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
            style.innerHTML = "\n            .tatty {\n                position: relative;\n                background:white;\n                color: #333a3c;\n                font-family: 'Source Code Pro', monospace;\n                font-size: 15px;\n                line-height: 19px;\n                -webkit-font-smoothing: antialiased;\n                -moz-osx-font-smoothing: grayscale;\n                overflow: hidden;\n            }\n            .tatty .inner {\n                position: absolute;\n            }\n            .tatty .overlay {\n                positoin: absolute;\n            }\n            .tatty .line {\n                position: absolute;\n                white-space: pre;\n            }\n            .tatty .cursor {\n                position: absolute;\n                top: 0;\n                left: 0;\n                border-left: 1px solid #888;\n            }\n            .tatty .cursor.hidden {\n                display: none;\n            }\n            .tatty .prompt {\n                position: absolute;\n                top: 0;\n                left: 0;\n                white-space: pre;\n            }\n            .tatty .scan {\n                position: absolute;\n                left: 0;\n                top: 0;\n                right: 0;\n                bottom: 0;\n                pointer-events: none;\n                background-repeat: repeat;\n                opacity: .3;\n            }\n        ";
            var head = document.querySelector('head');
            head.appendChild(style);
          },
          createElement: function() {
            var el = document.createElement('div');
            el.classList.add('inner');
            this.parent.appendChild(el);
            this.overlay = document.createElement('div');
            this.overlay.classList.add('overlay');
            this.parent.appendChild(this.overlay);
            return el;
          },
          createCursor: function() {
            var cursor = document.createElement('div');
            cursor.classList.add('cursor');
            cursor.style.height = this.lineHeight + 'px';
            this.overlay.appendChild(cursor);
            return cursor;
          },
          createPrompt: function() {
            var prompt = document.createElement('div');
            prompt.classList.add('prompt');
            prompt.innerHTML = ' > ';
            this.overlay.appendChild(prompt);
            return prompt;
          },
          splitLine: function(chars) {
            if (chars.length <= this.opts.cols) {
              return [chars];
            }
            var self = this;
            function findLastSpacePosition(start) {
              var i = start;
              while (chars[i] !== ' ') {
                i--;
                if (i < 0)
                  break;
              }
              return i < 0 ? self.opts.cols : i;
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
          },
          flashCursor: function() {
            if (this.cursorTimer)
              return;
            var toggle = function() {
              return setTimeout(function() {
                this.cursorElement.classList.toggle('hidden');
                this.cursorTimer = toggle();
              }.bind(this), 350);
            }.bind(this);
            this.cursorTimer = toggle();
          },
          getCharWidth: function() {
            var el = document.createElement('span');
            el.style.opacity = 0;
            el.innerHTML = 'm';
            this.parent.appendChild(el);
            var fontWidth = el.offsetWidth;
            this.parent.removeChild(el);
            return fontWidth;
          },
          createScan: function() {
            var canvas = document.createElement('canvas');
            var scan = document.createElement('div');
            scan.classList.add('scan');
            this.parent.appendChild(scan);
            var style = window.getComputedStyle(scan, null);
            canvas.width = 1;
            canvas.height = this.opts.scanOffset;
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = style.color || '#fff';
            ctx.fillRect(0, this.opts.scanOffset - 1, 1, 1);
            scan.style.backgroundImage = 'url( ' + canvas.toDataURL() + ' )';
            return scan;
          },
          registerModules: function(modules) {
            modules.forEach(function(module) {
              if (typeof module !== 'tattyScreenModule') {
                console.log('Error trying to attach module to tatty-screen');
              }
              if (module.init) {
                module.init.call(this);
              }
              var expose = module.expose();
              for (var key in expose) {
                if (!this[key] && expose.hasOwnProperty(key)) {
                  this[key] = expose[key];
                }
              }
            }, this);
          }
        }, {}, $__super);
      }(EventEmitter)));
    }
  };
});

System.register("EventEmitter", [], true, function(require, exports, module) {
  var global = System.global;
  var __define = global.define;
  global.define = undefined;
  var __filename = "vendor/EventEmitter/index.js";
  var __dirname = "vendor/EventEmitter";
  'use strict';
  
  /**
   * Representation of a single EventEmitter function.
   *
   * @param {Function} fn Event handler to be called.
   * @param {Mixed} context Context for function execution.
   * @param {Boolean} once Only emit once
   * @api private
   */
  function EE(fn, context, once) {
    this.fn = fn;
    this.context = context;
    this.once = once || false;
  }
  
  /**
   * Minimal EventEmitter interface that is molded against the Node.js
   * EventEmitter interface.
   *
   * @constructor
   * @api public
   */
  function EventEmitter() { /* Nothing to set */ }
  
  /**
   * Holds the assigned EventEmitters by name.
   *
   * @type {Object}
   * @private
   */
  EventEmitter.prototype._events = undefined;
  
  /**
   * Return a list of assigned event listeners.
   *
   * @param {String} event The events that should be listed.
   * @returns {Array}
   * @api public
   */
  EventEmitter.prototype.listeners = function listeners(event) {
    if (!this._events || !this._events[event]) return [];
    if (this._events[event].fn) return [this._events[event].fn];
  
    for (var i = 0, l = this._events[event].length, ee = new Array(l); i < l; i++) {
      ee[i] = this._events[event][i].fn;
    }
  
    return ee;
  };
  
  /**
   * Emit an event to all registered event listeners.
   *
   * @param {String} event The name of the event.
   * @returns {Boolean} Indication if we've emitted an event.
   * @api public
   */
  EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    if (!this._events || !this._events[event]) return false;
  
    var listeners = this._events[event]
      , len = arguments.length
      , args
      , i;
  
    if ('function' === typeof listeners.fn) {
      if (listeners.once) this.removeListener(event, listeners.fn, true);
  
      switch (len) {
        case 1: return listeners.fn.call(listeners.context), true;
        case 2: return listeners.fn.call(listeners.context, a1), true;
        case 3: return listeners.fn.call(listeners.context, a1, a2), true;
        case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
        case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
        case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
      }
  
      for (i = 1, args = new Array(len -1); i < len; i++) {
        args[i - 1] = arguments[i];
      }
  
      listeners.fn.apply(listeners.context, args);
    } else {
      var length = listeners.length
        , j;
  
      for (i = 0; i < length; i++) {
        if (listeners[i].once) this.removeListener(event, listeners[i].fn, true);
  
        switch (len) {
          case 1: listeners[i].fn.call(listeners[i].context); break;
          case 2: listeners[i].fn.call(listeners[i].context, a1); break;
          case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
          default:
            if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
              args[j - 1] = arguments[j];
            }
  
            listeners[i].fn.apply(listeners[i].context, args);
        }
      }
    }
  
    return true;
  };
  
  /**
   * Register a new EventListener for the given event.
   *
   * @param {String} event Name of the event.
   * @param {Functon} fn Callback function.
   * @param {Mixed} context The context of the function.
   * @api public
   */
  EventEmitter.prototype.on = function on(event, fn, context) {
    var listener = new EE(fn, context || this);
  
    if (!this._events) this._events = {};
    if (!this._events[event]) this._events[event] = listener;
    else {
      if (!this._events[event].fn) this._events[event].push(listener);
      else this._events[event] = [
        this._events[event], listener
      ];
    }
  
    return this;
  };
  
  /**
   * Add an EventListener that's only called once.
   *
   * @param {String} event Name of the event.
   * @param {Function} fn Callback function.
   * @param {Mixed} context The context of the function.
   * @api public
   */
  EventEmitter.prototype.once = function once(event, fn, context) {
    var listener = new EE(fn, context || this, true);
  
    if (!this._events) this._events = {};
    if (!this._events[event]) this._events[event] = listener;
    else {
      if (!this._events[event].fn) this._events[event].push(listener);
      else this._events[event] = [
        this._events[event], listener
      ];
    }
  
    return this;
  };
  
  /**
   * Remove event listeners.
   *
   * @param {String} event The event we want to remove.
   * @param {Function} fn The listener that we need to find.
   * @param {Boolean} once Only remove once listeners.
   * @api public
   */
  EventEmitter.prototype.removeListener = function removeListener(event, fn, once) {
    if (!this._events || !this._events[event]) return this;
  
    var listeners = this._events[event]
      , events = [];
  
    if (fn) {
      if (listeners.fn && (listeners.fn !== fn || (once && !listeners.once))) {
        events.push(listeners);
      }
      if (!listeners.fn) for (var i = 0, length = listeners.length; i < length; i++) {
        if (listeners[i].fn !== fn || (once && !listeners[i].once)) {
          events.push(listeners[i]);
        }
      }
    }
  
    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) {
      this._events[event] = events.length === 1 ? events[0] : events;
    } else {
      delete this._events[event];
    }
  
    return this;
  };
  
  /**
   * Remove all listeners or only the listeners for the specified event.
   *
   * @param {String} event The event want to remove all listeners for.
   * @api public
   */
  EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
    if (!this._events) return this;
  
    if (event) delete this._events[event];
    else this._events = {};
  
    return this;
  };
  
  //
  // Alias methods names because people roll like that.
  //
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
  EventEmitter.prototype.addListener = EventEmitter.prototype.on;
  
  //
  // This function doesn't apply anymore.
  //
  EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
    return this;
  };
  
  //
  // Expose the module.
  //
  EventEmitter.EventEmitter = EventEmitter;
  EventEmitter.EventEmitter2 = EventEmitter;
  EventEmitter.EventEmitter3 = EventEmitter;
  
  //
  // Expose the module.
  //
  module.exports = EventEmitter;
  
  global.define = __define;
  return module.exports;
});
