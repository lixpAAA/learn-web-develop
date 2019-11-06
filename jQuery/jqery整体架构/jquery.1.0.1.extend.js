(function (window) {
  var jQuery = function () {
    return new jQuery.prototype.init()
  }
  jQuery.fn = jQuery.prototype = {
    init: function () {
      console.log('this.init')
    },
    css: function () {
      console.log('this.css')
    }
  }
  // jQuery.fn.extend 扩展对象方法
  jQuery.fn.extend = jQuery.extend = function () {
    var target = arguments[0] || {};
    var length = arguments.length;
    var index = 1;
    var deep = false; // 确定是否为深拷贝，默认为false，为浅拷贝
    var option, name, copy, src, isArrayFlag, clone;
    if (typeof target === 'boolean') {
      deep = target
      target = arguments[1]
      index = 2
    }

    if (typeof target !== 'object') { // 排除参数不是object的情况
      target = {}
    }
    if (length === 0) { // 参数为空时抛出一个错误
      throw new Error('this method must have one or more params')
    }
    else if (index === length) { // 当参数只有一个的时候说明是要给jquery或实例增加属性或方法
      target = this  // this 指向jquery或者jquery实例\
      --index
    }
    for (; index < length; ++index) {
      if ((option = arguments[index]) !== null && toString.call(option) === '[object Object]') {
        for (name in option) {
          copy = option[name]
          src = target[name]
          if (deep && (jQuery.isObject(copy) || (isArrayFlag = jQuery.isArray(copy)))) {
            if (isArrayFlag) {
              isArrayFlag = false
              // clone = src && jQuery.isArray(src) ? src : []
              target[name] = copy

            } else {
              clone = src && jQuery.isObject(src) ? src : {}
              target[name] = jQuery.extend(deep, clone, copy)
            }
          } else if (copy !== undefined) {
            target[name] = copy
          }

          // target[name] = option[name]
        }
      }
    }

    return target;
  }
  jQuery.extend({
    isObject: function (obj) {
      return toString.call(obj) === '[object Object]'
    },
    isArray: function (obj) {
      return toString.call(obj) === '[object Array]'
    }
  })



  /**
   * 这样做，是为了实现原型共享， 简单的说调用init方法实例化对象后， 实例化对象可以调用css（）
   */
  jQuery.fn.init.prototype = jQuery.fn
  // jQuery.prototype.init.prototype = jQuery.prototype



  window.$ = window.jQuery = jQuery

})(window)