module.exports = {
  create: function () {
    var nextId = 1;
    var stack = [];
    var elements = {};
    var log = console.log;

    function byId(id) {
      return elements[id];
    }

    function isHook(el) {
      return el.type === 'hook';
    }

    function notHook(el) {
      return !isHook(el);
    }

    function Element(data) {
      this.id = data.id;
      this.parentId = data.parentId;
      this.type = data.type;
      this.title = data.title;
      this.pending = data.pending;
      this.childrenIds = [];
      this.logEntries = [];
    }

    Element.prototype.isRoot = function () {
      return !this.parentId;
    };

    Element.prototype.parent = function () {
      return elements[this.parentId];
    };

    Element.prototype.hooks = function () {
      var p = this.parent();
      return (p ? p.hooks() : []).concat(this.childrenIds.map(byId).filter(isHook));
    };

    Element.prototype.children = function () {
      return this.childrenIds.map(byId).filter(notHook);
    };

    function push(element) {
      var cur = peek();
      var el = new Element({
        id: 'element-' + nextId++,
        parentId: cur ? cur.id : null,
        type: element.type || 'suite',
        title: element.title,
        pending: element.pending
      });

      if (cur) {
        cur.childrenIds.push(el.id);
      }

      elements[el.id] = el;
      stack.push(el.id);
      return el;
    }

    function pop() {
      if (stack.length)
        return elements[stack.pop()];
    }

    function peek() {
      if (stack.length)
        return elements[stack[stack.length - 1]];
    }

    return {
      push: push,
      pop: pop,
      peek: peek,

      captureLog: function (suppressOutput) {
        console.log = function () {
          var args = Array.prototype.slice.call(arguments);
          var cur = peek();
          if (cur) {
            cur.logEntries.push(args);
          }
          if (!suppressOutput) {
            log.apply(console, args);
          }
        };
      },
      
      uncaptureLog: function () {
        console.log = log;
      },

      setCurrentFailed: function (err) {
        var cur = peek();
        if (cur) {
          cur.fail = true;
          cur.err = err;
        }
      },
      
      setCurrentPassed: function () {
        var cur = peek();
        if (cur) {
          cur.pass = true;
        }
      },
      
      root: function () {
        return byId(Object.keys(elements)[0]);
      }
    };
  }
};
