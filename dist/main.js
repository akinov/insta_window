/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _readOnlyError(name) { throw new Error(\"\\\"\" + name + \"\\\" is read-only\"); }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n/*!\n * InstaWindowTool\n * https://insta-window-tool.web.app/\n *\n * Copyright Akinov and other contributors\n * Released under the MIT license\n *\n */\n// Polyfill Object.assign\nif (typeof Object.assign != 'function') {\n  // Must be writable: true, enumerable: false, configurable: true\n  Object.defineProperty(Object, 'assign', {\n    value: function assign(target, varArgs) {\n      // .length of function is 2\n      'use strict';\n\n      if (target == null) {\n        // TypeError if undefined or null\n        throw new TypeError('Cannot convert undefined or null to object');\n      }\n\n      var to = Object(target);\n\n      for (var index = 1; index < arguments.length; index++) {\n        var nextSource = arguments[index];\n\n        if (nextSource != null) {\n          // Skip over if undefined or null\n          for (var nextKey in nextSource) {\n            // Avoid bugs when hasOwnProperty is shadowed\n            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {\n              to[nextKey] = nextSource[nextKey];\n            }\n          }\n        }\n      }\n\n      return to;\n    },\n    writable: true,\n    configurable: true\n  });\n}\n\nwindow.instaWindow = function () {\n  var _Object$assign;\n\n  var instagramURL = 'https://www.instagram.com/';\n  var req = new XMLHttpRequest();\n  var baseDom = document.getElementById('insta-window');\n  var images = [];\n  var user;\n  var options = Object.assign((_Object$assign = {\n    // default options\n    username: 'watanabenaomi703',\n    // 取得対象のユーザー名\n    total: 9,\n    // 表示する画像数\n    column: 3,\n    borderColor: '#ccc',\n    width: 300,\n    // プロフィール関係\n    usernameColor: '#666',\n    usernameSize: '20px',\n    bioAlign: 'center',\n    bioColor: '#666'\n  }, _defineProperty(_Object$assign, \"usernameSize\", '12px'), _defineProperty(_Object$assign, \"followColor\", '#fff'), _defineProperty(_Object$assign, \"followBgColor\", '#3897f0'), _defineProperty(_Object$assign, \"followIcon\", true), _defineProperty(_Object$assign, \"followText\", 'フォロー'), _defineProperty(_Object$assign, \"order\", 'icon,name,bio,btn'), _Object$assign), baseDom.dataset);\n\n  var clearDom = function clearDom() {\n    baseDom.innerHTML = '';\n  };\n\n  var followDom = function followDom() {\n    return \"<a class=\\\"iswd-follow-btn\\\" href=\\\"\".concat(instagramURL).concat(options.username, \"\\\" target=\\\"_blank\\\" rel=\\\"noopener\\\">\\n            \").concat(options.followIcon ? '<span class=\"iswd-follow-btn-before\"></span>' : '', \"\\n            \").concat(options.followText, \"\\n            </a>\");\n  };\n\n  var bioDom = function bioDom() {\n    return \"<div class=\\\"iswd-bio\\\">\".concat(user.biography, \"'</div>\");\n  };\n\n  var usernameDom = function usernameDom() {\n    return \"<div class=\\\"iswd-name\\\">\".concat(user.full_name, \"</div>\");\n  };\n\n  var iconDom = function iconDom() {\n    return \"<a href=\\\"\".concat(instagramURL).concat(options.username, \"\\\" target=\\\"_blank\\\" rel=\\\"noopener\\\"><img class=\\\"iswd-icon\\\" src=\\\"\").concat(user.profile_pic_url, \"\\\"></a>\");\n  };\n\n  var imagesDom = function imagesDom() {\n    var wrapper = document.createElement('div');\n    wrapper.className = 'iswd-images';\n\n    for (var i in images) {\n      var item = document.createElement('div');\n      item.className = 'iswd-images-item';\n      var link = document.createElement('a');\n      link.className = 'iswd-image-link';\n      link.href = instagramURL + 'p/' + images[i].shortcode;\n      link.target = '_blank';\n      link.rel = 'noopener';\n      var img = document.createElement('img');\n      img.className = 'iswd-image';\n      img.src = images[i].url;\n      link.appendChild(img);\n      item.appendChild(link);\n      wrapper.appendChild(item);\n    }\n\n    return wrapper;\n  };\n\n  var copyrightDom = function copyrightDom() {\n    var wrapper = document.createElement('div');\n    wrapper.className = 'iswd-copyright-wrapper';\n    var link = document.createElement('a');\n    link.className = 'iswd-copy';\n    link.textContent = 'created by InstaWindow';\n    link.title = '無料インスタグラムブログパーツ InstaWindow';\n    link.href = 'https://insta-window-tool.web.app/';\n    link.target = '_blank';\n    wrapper.appendChild(link); // トラッキング用img追加\n\n    var hostname = location.hostname;\n\n    if (hostname != 'localhost' && hostname != 'insta-window-tool.web.app') {\n      var gaImg = document.createElement('img');\n      gaImg.className = 'iswd-tracking-img';\n      var TID = 'UA-142501014-2';\n      var url = \"//www.google-analytics.com/collect?v=1&tid=\".concat(TID, \"&cid=1&t=event&ec=views&ea=\").concat(hostname, \"&el=\").concat(location.href);\n      gaImg.src = url;\n      wrapper.appendChild(gaImg);\n    }\n\n    return wrapper;\n  };\n\n  var render = function render() {\n    // プロフィール追加\n    var profileDom = document.createElement('div');\n    profileDom.className = 'iswd-profile';\n    baseDom.appendChild(profileDom);\n    var doms = {\n      icon: iconDom(),\n      name: usernameDom(),\n      bio: bioDom(),\n      btn: followDom()\n    };\n    var orders = options.order.split(',');\n    orders.forEach(function (domName) {\n      profileDom.appendChild(doms[domName]);\n    }); // 写真追加\n\n    baseDom.appendChild(imagesDom()); // コピーライト追加\n\n    baseDom.appendChild(copyrightDom());\n  };\n\n  var renderStyle = function renderStyle() {\n    var style = {\n      base: {\n        background: '#fff',\n        border: \"1px solid \".concat(options.borderColor),\n        'border-radius': '5px',\n        'box-sizing': 'border-box',\n        padding: '10px',\n        width: Number(options.width) > 10 ? \"\".concat(options.width, \"px\") : '100%'\n      },\n      profile: {\n        'text-align': 'center'\n      },\n      name: {\n        color: options.usernameColor,\n        'font-size': options.usernameSize,\n        'font-weight': 'bold',\n        margin: '20px 0 10px'\n      },\n      bio: {\n        color: options.bioColor,\n        'font-size': options.bioSize,\n        margin: '0 0 10px',\n        'text-align': options.bioAlign\n      },\n      'follow-btn': {\n        color: options.followColor,\n        'background-color': options.followBgColor,\n        'border-radius': '4px',\n        display: 'inline-block',\n        'font-size': '14px',\n        'line-height': '24px',\n        margin: '0 0 10px',\n        padding: '6px 12px',\n        'text-align': 'center',\n        'text-decoration': 'none',\n        'white-space': 'nowrap'\n      },\n      'follow-btn-before': {\n        background: 'url(https://cdn.jsdelivr.net/gh/akinov/insta_window@v1.0/dist/ig_icon.png) center no-repeat',\n        'background-size': 'contain',\n        content: '',\n        display: 'inline-block',\n        height: '20px',\n        margin: '-3px 5px 0 0',\n        width: '20px',\n        'vertical-align': 'middle'\n      },\n      images: {\n        display: 'flex',\n        'flex-wrap': 'wrap'\n      },\n      'images-item': {\n        'box-sizing': 'border-box',\n        padding: '3px',\n        width: \"\".concat(100 / column, \"%\")\n      },\n      'image-link': {\n        margin: 0,\n        padding: 0,\n        'text-decoration': 'none'\n      },\n      image: {\n        width: '100%'\n      },\n      icon: {\n        border: '1px solid #dbdbdb',\n        'border-radius': '50%',\n        width: '33%'\n      },\n      'copyright-wrapper': {\n        'font-size': '8px',\n        'line-height': 1,\n        'text-align': 'right',\n        'padding-right': '5px'\n      },\n      copy: {\n        color: '#ccc',\n        display: 'inline',\n        'font-size': '8px',\n        margin: 0,\n        padding: 0,\n        'text-decoration': 'none'\n      },\n      'tracking-img': {\n        height: 0,\n        opacity: 0,\n        width: 0\n      }\n    };\n    Object.keys(style).forEach(function (key) {\n      var elements = document.querySelectorAll('.iswd-' + key);\n      var length = elements.length;\n      if (length === 0) return;\n\n      for (var i = 0; i < length; _readOnlyError(\"i\"), i++) {\n        elements[i].setAttribute('style', styleJsonToStyleString(style[key]));\n      }\n    });\n  }; // style用jsonを文字列に変換\n\n\n  var styleJsonToStyleString = function styleJsonToStyleString(jsonString) {\n    return JSON.stringify(jsonString).slice(1, -1).replace(/,/g, ';').replace(/\"/g, '');\n  }; // datasetからboolean取得すると文字列になるので変換\n\n\n  var toBoolean = function toBoolean(booleanStr) {\n    // もともとbool値の場合はそのまま返す\n    if (typeof booleanStr === 'boolean') return booleanStr;\n    return booleanStr.toLowerCase() === 'true';\n  };\n\n  req.onreadystatechange = function () {\n    if (req.readyState == 4) {\n      // 通信の完了時\n      if (req.status == 200) {\n        // 通信の成功時\n        var json_string = req.response.split('window._sharedData = ')[1];\n        json_string = json_string.split('};</script>')[0] + '}';\n        user = JSON.parse(json_string).entry_data.ProfilePage[0].graphql.user;\n        var datas = user.edge_owner_to_timeline_media.edges; // TODO: totalがdatasの数を上回った場合の処理(最高9個しか動かない)\n\n        for (var i in datas) {\n          if (i >= options.total) break;\n          images.push({\n            shortcode: datas[i].node.shortcode,\n            url: datas[i].node.thumbnail_src\n          });\n        }\n\n        clearDom();\n        render();\n        renderStyle();\n      }\n    }\n  };\n\n  req.open('GET', instagramURL + options.username, true);\n  req.send(null);\n};\n\ninstaWindow();\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });