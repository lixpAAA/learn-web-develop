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
      } else if (jQuery.isFunction(selector)) { // 如果插入的参数是函数
        // Execute immediately if ready is not present
        // return document.ready !== undefined ?
        //   document.ready(selector) :

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
  // 缓存用户数据
  var data_user = new Data()
  // 内部私有缓存对象
  var data_private = new Data()

  function Data() { }

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
    // Deferred: function (func) {
    //   var tuples = [

    //     // action, add listener, callbacks,
    //     // ... .then handlers, argument index, [final state]
    //     ["notify", "progress", jQuery.Callbacks("memory"),
    //       jQuery.Callbacks("memory"), 2],
    //     ["resolve", "done", jQuery.Callbacks("once memory"),
    //       jQuery.Callbacks("once memory"), 0, "resolved"],
    //     ["reject", "fail", jQuery.Callbacks("once memory"),
    //       jQuery.Callbacks("once memory"), 1, "rejected"]
    //   ],
    //     // 
    //     // var deferred = {};

    //     state = "pending",
    //     promise = {
    //       state: function () {
    //         return state;
    //       },
    //       always: function () {
    //         deferred.done(arguments).fail(arguments);
    //         return this;
    //       },
    //       "catch": function (fn) {
    //         return promise.then(null, fn);
    //       },

    //       // Keep pipe for back-compat
    //       pipe: function ( /* fnDone, fnFail, fnProgress */) {
    //         var fns = arguments;

    //         return jQuery.Deferred(function (newDefer) {
    //           jQuery.each(tuples, function (i, tuple) {

    //             // Map tuples (progress, done, fail) to arguments (done, fail, progress)
    //             var fn = isFunction(fns[tuple[4]]) && fns[tuple[4]];

    //             // deferred.progress(function() { bind to newDefer or newDefer.notify })
    //             // deferred.done(function() { bind to newDefer or newDefer.resolve })
    //             // deferred.fail(function() { bind to newDefer or newDefer.reject })
    //             deferred[tuple[1]](function () {
    //               var returned = fn && fn.apply(this, arguments);
    //               if (returned && isFunction(returned.promise)) {
    //                 returned.promise()
    //                   .progress(newDefer.notify)
    //                   .done(newDefer.resolve)
    //                   .fail(newDefer.reject);
    //               } else {
    //                 newDefer[tuple[0] + "With"](
    //                   this,
    //                   fn ? [returned] : arguments
    //                 );
    //               }
    //             });
    //           });
    //           fns = null;
    //         }).promise();


    //       },
    //       then: function (onFulfilled, onRejected, onProgress) {
    //         var maxDepth = 0;
    //         function resolve(depth, deferred, handler, special) {
    //           return function () {
    //             var that = this,
    //               args = arguments,
    //               mightThrow = function () {
    //                 var returned, then;

    //                 // Support: Promises/A+ section 2.3.3.3.3
    //                 // https://promisesaplus.com/#point-59
    //                 // Ignore double-resolution attempts
    //                 if (depth < maxDepth) {
    //                   return;
    //                 }

    //                 returned = handler.apply(that, args);

    //                 // Support: Promises/A+ section 2.3.1
    //                 // https://promisesaplus.com/#point-48
    //                 if (returned === deferred.promise()) {
    //                   throw new TypeError("Thenable self-resolution");
    //                 }

    //                 // Support: Promises/A+ sections 2.3.3.1, 3.5
    //                 // https://promisesaplus.com/#point-54
    //                 // https://promisesaplus.com/#point-75
    //                 // Retrieve `then` only once
    //                 then = returned &&

    //                   // Support: Promises/A+ section 2.3.4
    //                   // https://promisesaplus.com/#point-64
    //                   // Only check objects and functions for thenability
    //                   (typeof returned === "object" ||
    //                     typeof returned === "function") &&
    //                   returned.then;

    //                 // Handle a returned thenable
    //                 if (isFunction(then)) {

    //                   // Special processors (notify) just wait for resolution
    //                   if (special) {
    //                     then.call(
    //                       returned,
    //                       resolve(maxDepth, deferred, Identity, special),
    //                       resolve(maxDepth, deferred, Thrower, special)
    //                     );

    //                     // Normal processors (resolve) also hook into progress
    //                   } else {

    //                     // ...and disregard older resolution values
    //                     maxDepth++;

    //                     then.call(
    //                       returned,
    //                       resolve(maxDepth, deferred, Identity, special),
    //                       resolve(maxDepth, deferred, Thrower, special),
    //                       resolve(maxDepth, deferred, Identity,
    //                         deferred.notifyWith)
    //                     );
    //                   }

    //                   // Handle all other returned values
    //                 } else {

    //                   // Only substitute handlers pass on context
    //                   // and multiple values (non-spec behavior)
    //                   if (handler !== Identity) {
    //                     that = undefined;
    //                     args = [returned];
    //                   }

    //                   // Process the value(s)
    //                   // Default process is resolve
    //                   (special || deferred.resolveWith)(that, args);
    //                 }
    //               },

    //               // Only normal processors (resolve) catch and reject exceptions
    //               process = special ?
    //                 mightThrow :
    //                 function () {
    //                   try {
    //                     mightThrow();
    //                   } catch (e) {

    //                     if (jQuery.Deferred.exceptionHook) {
    //                       jQuery.Deferred.exceptionHook(e,
    //                         process.stackTrace);
    //                     }

    //                     // Support: Promises/A+ section 2.3.3.3.4.1
    //                     // https://promisesaplus.com/#point-61
    //                     // Ignore post-resolution exceptions
    //                     if (depth + 1 >= maxDepth) {

    //                       // Only substitute handlers pass on context
    //                       // and multiple values (non-spec behavior)
    //                       if (handler !== Thrower) {
    //                         that = undefined;
    //                         args = [e];
    //                       }

    //                       deferred.rejectWith(that, args);
    //                     }
    //                   }
    //                 };

    //             // Support: Promises/A+ section 2.3.3.3.1
    //             // https://promisesaplus.com/#point-57
    //             // Re-resolve promises immediately to dodge false rejection from
    //             // subsequent errors
    //             if (depth) {
    //               process();
    //             } else {

    //               // Call an optional hook to record the stack, in case of exception
    //               // since it's otherwise lost when execution goes async
    //               if (jQuery.Deferred.getStackHook) {
    //                 process.stackTrace = jQuery.Deferred.getStackHook();
    //               }
    //               window.setTimeout(process);
    //             }
    //           };
    //         }

    //         return jQuery.Deferred(function (newDefer) {

    //           // progress_handlers.add( ... )
    //           tuples[0][3].add(
    //             resolve(
    //               0,
    //               newDefer,
    //               isFunction(onProgress) ?
    //                 onProgress :
    //                 Identity,
    //               newDefer.notifyWith
    //             )
    //           );

    //           // fulfilled_handlers.add( ... )
    //           tuples[1][3].add(
    //             resolve(
    //               0,
    //               newDefer,
    //               isFunction(onFulfilled) ?
    //                 onFulfilled :
    //                 Identity
    //             )
    //           );

    //           // rejected_handlers.add( ... )
    //           tuples[2][3].add(
    //             resolve(
    //               0,
    //               newDefer,
    //               isFunction(onRejected) ?
    //                 onRejected :
    //                 Thrower
    //             )
    //           );
    //         }).promise();
    //       },

    //       // Get a promise for this deferred
    //       // If obj is provided, the promise aspect is added to the object
    //       promise: function (obj) {
    //         return obj != null ? jQuery.extend(obj, promise) : promise;
    //       }
    //     },
    //     deferred = {};

    //   // Add list-specific methods
    //   jQuery.each(tuples, function (i, tuple) {
    //     var list = tuple[2],
    //       stateString = tuple[5];

    //     // promise.progress = list.add
    //     // promise.done = list.add
    //     // promise.fail = list.add
    //     promise[tuple[1]] = list.add;

    //     // Handle state
    //     if (stateString) {
    //       list.add(
    //         function () {

    //           // state = "resolved" (i.e., fulfilled)
    //           // state = "rejected"
    //           state = stateString;
    //         },

    //         // rejected_callbacks.disable
    //         // fulfilled_callbacks.disable
    //         tuples[3 - i][2].disable,

    //         // rejected_handlers.disable
    //         // fulfilled_handlers.disable
    //         tuples[3 - i][3].disable,

    //         // progress_callbacks.lock
    //         tuples[0][2].lock,

    //         // progress_handlers.lock
    //         tuples[0][3].lock
    //       );
    //     }

    //     // progress_handlers.fire
    //     // fulfilled_handlers.fire
    //     // rejected_handlers.fire
    //     list.add(tuple[3].fire);

    //     // deferred.notify = function() { deferred.notifyWith(...) }
    //     // deferred.resolve = function() { deferred.resolveWith(...) }
    //     // deferred.reject = function() { deferred.rejectWith(...) }
    //     deferred[tuple[0]] = function () {
    //       deferred[tuple[0] + "With"](this === deferred ? undefined : this, arguments);
    //       return this;
    //     };

    //     // deferred.notifyWith = list.fireWith
    //     // deferred.resolveWith = list.fireWith
    //     // deferred.rejectWith = list.fireWith
    //     deferred[tuple[0] + "With"] = list.fireWith;
    //   });

    //   // Make the deferred a promise
    //   promise.promise(deferred);

    //   // Call given func if any
    //   if (func) {
    //     func.call(deferred, deferred);
    //   }

    //   // All done!
    //   return deferred;
    // },



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
    access: function (elems, callback, key, value) {
      var testing = key === null // 属性为空，没有传入要修改的属性
      var cache  // 缓存函数
      var chain  // 是否开启链式调用
      var len = elems.length
      if (value !== undefined) {
        chain = true
        if (testing) {
          cache = callback
          callback = function () {
            cache.call(this, value)
          }
        }
        for (var i = 0; i < len; ++i) {
          callback.call(elems[i], key, value)
        }
      }
      return chain ? elems : callback.call(elems[0], key, value)
    },
    text: function (elem) {
      var nodeType = elem.nodeType;
      if (nodeType === 1 || nodeType === 9 || nodeType === 1) {
        return elem.textContent
      }
    },
    content: function (elem, value) {
      var nodeType = elem.nodeType;
      if (nodeType === 1 || nodeType === 9 || nodeType === 1) {
        elem.textContent = value
      }
    },
    style: function (elem, key, value) {
      var nodeType = elem.nodeType;
      if (nodeType || nodeType === 1 || nodeType === 9 || nodeType === 1) {
        elem.style[key] = value
      } else {
        return ''
      }
    },
    // 动画队列
    queue: function (elem, type, data) {
      var queu

    }
  })
  jQuery.fn.extend({
    // // {
    //   name: {
    //       test: //
    //       success: function(){},
    //       fail: function(){}
    //   }
    // }
    validate: function (options) {
      if (!options) return
      for (var type in options) {
        var inputA = document.querySelectorAll(`input[name=${type}]`)
        var inputs = inputA && Array.from(inputA)
        inputs.forEach((item, index) => {
          var value = item.value
          var flag = options[type].test.test(value)
          flag ? options[type].success(item, value) : options[type].fail(item, value)
        })
      }
    },

    // 在img父容器上挂载此方法
    loadImg: function () {
      // 获取父容器下的所有img
      var imgs = document.querySelectorAll('img[data-src]') || []
      var list = Array.from(imgs)
      // console.log(list.length)
      // 定义事件并判断img是否进入可视区域
      var onScroll = function () {
        var scrollY = window.scrollY
        var heght = window.innerHeight
        if (list.length > 0) {
          // 存放处理过的index
          var indexs = []
          var len = list.length
          for (var i = 0; i < len; ++i) {
            var img = list[i]
            // debugger
            if (img.offsetTop - scrollY < heght) {
              img.src = img.dataset['src']
              img.dataset['src'] = ''
              indexs.push(i)
            }
          }
          // 删除已处理的
          list.splice(0, indexs.length)
        }
      }
      // 添加滚动事件
      window.addEventListener('scroll', onScroll)
      onScroll()
    },
    text: function (value) {
      return jQuery.access(this, () => {
        return value === undefined ? jQuery.text(this[0]) : jQuery.content(this[0], value)
      }, null, value)
    },
    css: function (key, value) {
      return jQuery.access(this, () => {
        console.log('this:', key)
        let style = window.getComputedStyle(this[0])
        return value !== undefined ? jQuery.style(this, key, value) : style[key]
      }, null, value)
    },
    addClass: function (values) {
      var len = this.length
      var process = typeof values === 'string' && values
      var classList = (values || '').match(/\S+/g) || []
      if (process) {
        for (var i = 0; i < len; ++i) {
          var elem = this[i]
          for (var j = 0; j < classList.length; ++j) {
            var classListStr = toString.call(elem.classList)
            var classItem = classList[j]
            if (elem.classList && !classListStr.includes(classItem)) {
              elem.classList.add(classItem)
            }
          }
        }
      }
    }
  })




  /**
   * 这样做，是为了实现原型共享， 简单的说调用init方法实例化对象后，
   *  实例化对象可以调用css（）
   */
  jQuery.fn.init.prototype = jQuery.fn
  // jQuery.prototype.init.prototype = jQuery.prototype



  window.$ = window.jQuery = jQuery

})(this)