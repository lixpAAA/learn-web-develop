(function (root) {
  var optionCaches = {}
  var _ = {
    callbacks: function (options) {
      options = typeof options === 'string' ? (optionCaches[options] || createOptions(options)) : {};
      var list = []
      var index, length, testing, memery, start
      var fire = function (args) {
        index = start || 0
        start = 0  // 执行一次， 并将start重置
        memery = options.memery && args // 是否有memery参数
        testing = true // 判断是否执行了一次
        length = list.length
        for (; index < length; ++index) {
          if (list[index].apply(args[0], args[1]) === false && options.stopOnfalse) {
            break;
          }
        }
      }
      var self = {
        add: function () {
          var fns = Array.prototype.slice.call(arguments)
          start = memery && list.length // 记录上次添加函数的位置，以便下次从此处执行
          fns.forEach(fn => {
            if (toString.call(fn) === '[object Function]') {
              list.push(fn)
            }
          })
          memery && fire(memery)
        },
        fireWith: function (context, argument) {
          var args = [context, argument]
          if (!options.once || !testing) {
            fire(args)
          }

        },
        fire: function () {
          self.fireWith(this, arguments)
        }
      }
      return self
    }
  }
  function createOptions(options) {
    var obj = optionCaches[options] = {}
    options.split(/\s+/).forEach(item => {
      obj[item] = true
    })
    return obj
  }
  root._ = _;
})(this)