(function (window) {
  // 匹配<a></a>
  var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;

  var jQuery = function (selector, context) {
    return new jQuery.prototype.init(selector, context)
  }
  jQuery.fn = jQuery.prototype = {
    init: function (selector, context) {
      // 保证兼容不传context的情况
      context = context || document

      var macth, index = 0, elem
      //$()  $(undefined)  $(null) $(false)  
      if (!selector) {
        return this
      }
      if (typeof selector === 'string') {

        // 判断是否为 dom 节点
        if (selector.charAt(0) === '<' && selector.charAt(selector.length - 1) && selector.length >= 3) {
          macth = [selector] // ['<a>']

        }
        if (macth) {
          jQuery.merge(this, jQuery.parseHTML(macth, context, rejectExp))

        } else {
          elem = document.querySelectorAll(selector);
          var elems = Array.prototype.slice.call(elem);
          this.length = elems.length;
          for (; index < elems.length; index++) {
            this[index] = elems[index];
          }
          this.context = context;
          this.selector = selector;
        }
      } else if (selector.nodeType) {
        this.context = this[0] = selector;
        this.length = 1;
        return this;
      } else if (jQuery.isFunction(selector)) {
        // Execute immediately if ready is not present
        selector(jQuery);
      }
      return jQuery.markArray(selector, this);
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
    //类数组转化成正真的数组  
    markArray: function (arr, results) {
      var ret = results || [];
      if (arr != null) {
        jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
      }
      return ret;
    },
    isFunction: function (obj) {
      return toString.call(obj) === '[object Function]'
    },
    isObject: function (obj) {
      return toString.call(obj) === '[object Object]'
    },
    isArray: function (obj) {
      return toString.call(obj) === '[object Array]'
    },
    //合并数组
    merge: function (first, second) {
      var l = second.length,
        i = first.length,
        j = 0;

      if (typeof l === "number") {
        for (; j < l; j++) {
          // 往first数组里追加
          first[i++] = second[j];
        }
      } else {
        //  防止为字符串的情况
        while (second[j] !== undefined) {
          first[i++] = second[j++];
        }
      }

      first.length = i;
      return first;
    },
    //  去掉< 和 >  并创建一个此节点的数组[a]
    parseHTML: function (data, context, rexp) {
      if (!data || typeof data !== "string") {
        return null;
      }
      //过滤掉<a>   <a>   => a 
      rexp = rexp || new RegExp()
      var parse = rexp.exec(data);
      console.log(parse)
      return [context.createElement(parse[1])];
    },
  })





  /**
   * 这样做，是为了实现原型共享， 简单的说调用init方法实例化对象后， 实例化对象可以调用css（）
   */
  jQuery.fn.init.prototype = jQuery.fn
  // jQuery.prototype.init.prototype = jQuery.prototype



  window.$ = window.jQuery = jQuery

})(window)