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

eval("/*!\n * InstaWindowTool\n * https://insta-window-tool.web.app/\n *\n * Copyright Akinov and other contributors\n * Released under the MIT license\n *\n */\n// Polyfill Object.assign\nif (typeof Object.assign != 'function') {\n  // Must be writable: true, enumerable: false, configurable: true\n  Object.defineProperty(Object, 'assign', {\n    value: function assign(target, varArgs) {\n      // .length of function is 2\n      'use strict';\n\n      if (target == null) {\n        // TypeError if undefined or null\n        throw new TypeError('Cannot convert undefined or null to object');\n      }\n\n      var to = Object(target);\n\n      for (var index = 1; index < arguments.length; index++) {\n        var nextSource = arguments[index];\n\n        if (nextSource != null) {\n          // Skip over if undefined or null\n          for (var nextKey in nextSource) {\n            // Avoid bugs when hasOwnProperty is shadowed\n            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {\n              to[nextKey] = nextSource[nextKey];\n            }\n          }\n        }\n      }\n\n      return to;\n    },\n    writable: true,\n    configurable: true\n  });\n}\n\nwindow.instaWindow = function () {\n  var instagramURL = 'https://www.instagram.com/';\n  var req = new XMLHttpRequest();\n  var baseDom = document.getElementById('insta-widget');\n  var images = [];\n  var user;\n  var options = Object.assign({\n    // default options\n    username: 'akb48',\n    // 取得対象のユーザー名\n    displayImageCount: 9,\n    // 表示する画像数\n    wrapperWidth: 300,\n    showIcon: true,\n    showBiography: true,\n    showFollowBtn: true,\n    showUsername: true\n  }, baseDom.dataset);\n\n  if (typeof options.displayImageCount == 'string') {\n    options.displayImageCount = Number(options.displayImageCount);\n  }\n\n  req.onreadystatechange = function () {\n    if (req.readyState == 4) {\n      // 通信の完了時\n      if (req.status == 200) {\n        // 通信の成功時\n        var json_string = req.response.split('window._sharedData = ')[1];\n        json_string = json_string.split('};</script>')[0] + '}';\n        user = JSON.parse(json_string).entry_data.ProfilePage[0].graphql.user;\n        var datas = user.edge_owner_to_timeline_media.edges;\n\n        for (var i in datas) {\n          images.push({\n            shortcode: datas[i].node.shortcode,\n            url: datas[i].node.thumbnail_src\n          });\n        }\n\n        if (storageAvailable('sessionStorage')) {\n          sessionStorage.setItem('iswd_username', options.username);\n          sessionStorage.setItem('iswd_images', JSON.stringify(images));\n          sessionStorage.setItem('iswd_user', JSON.stringify(user));\n        }\n\n        clearDom();\n        renderDom();\n        renderStyle();\n      }\n    }\n  };\n\n  function getHttpRequest() {\n    req.open('GET', instagramURL + options.username, true);\n    req.send(null);\n  }\n\n  if (storageAvailable('sessionStorage')) {\n    var settionUsername = sessionStorage.getItem('iswd_username');\n    var settionImages = JSON.parse(sessionStorage.getItem('iswd_images'));\n    var settionUser = JSON.parse(sessionStorage.getItem('iswd_user'));\n\n    if (settionUsername != options.username || settionImages == null || settionUser == null) {\n      getHttpRequest();\n    } else {\n      user = settionUser;\n      images = settionImages;\n      clearDom();\n      renderDom();\n      renderStyle();\n    }\n  } else {\n    getHttpRequest();\n  }\n\n  function clearDom() {\n    baseDom.innerHTML = '';\n  }\n\n  function renderDom() {\n    // プロフィール追加\n    var profileDom = document.createElement('div');\n    profileDom.className = 'iswg-profile';\n    baseDom.appendChild(profileDom);\n\n    if (toBoolean(options.showFollowBtn)) {\n      profileDom.insertAdjacentHTML('afterbegin', '<a class=\"iswg-follow-btn\" href=\"' + instagramURL + options.username + '\" target=\"_blank\" rel=\"noopener\"><span class=\"iswg-follow-btn-before\"></span>フォロー</a>');\n    }\n\n    if (toBoolean(options.showBiography)) {\n      profileDom.insertAdjacentHTML('afterbegin', '<div class=\"iswg-biography\">' + user.biography + '</div>');\n    }\n\n    if (toBoolean(options.showUsername)) {\n      profileDom.insertAdjacentHTML('afterbegin', '<div class=\"iswg-name\">' + user.full_name + '</div>');\n    }\n\n    if (toBoolean(options.showIcon)) {\n      profileDom.insertAdjacentHTML('afterbegin', '<a href=\"' + instagramURL + options.username + '\" target=\"_blank\" rel=\"noopener\"><img class=\"iswg-icon\" src=\"' + user.profile_pic_url + '\"></a>');\n    } // 写真追加\n\n\n    var imagesDom = document.createElement('div');\n    imagesDom.className = 'iswg-images';\n    baseDom.appendChild(imagesDom);\n\n    for (var i in images) {\n      if (i >= options.displayImageCount) break;\n      var itemDom = document.createElement('div');\n      itemDom.className = 'iswg-images-item';\n      var linkDom = document.createElement('a');\n      linkDom.className = 'iswg-image-link';\n      linkDom.href = instagramURL + 'p/' + images[i].shortcode;\n      linkDom.target = '_blank';\n      linkDom.rel = 'noopener';\n      var img = document.createElement('img');\n      img.className = 'iswg-image';\n      img.src = images[i].url;\n      linkDom.appendChild(img);\n      itemDom.appendChild(linkDom);\n      imagesDom.appendChild(itemDom);\n    } // コピーライト追加\n\n\n    var copyrightWrapperDom = document.createElement('div');\n    copyrightWrapperDom.className = 'iswg-copyright-wrapper';\n    var copyrightDom = document.createElement('a');\n    copyrightDom.className = 'iswg-copy';\n    copyrightDom.textContent = 'created by InstaWindow';\n    copyrightDom.title = '無料インスタグラムブログパーツ InstaWindow';\n    copyrightDom.href = 'https://insta-window-tool.web.app/';\n    copyrightDom.target = '_blank';\n    copyrightWrapperDom.appendChild(copyrightDom); // トラッキング用img追加\n\n    var hostname = location.hostname;\n\n    if (hostname != 'localhost' && hostname != 'insta-window-tool.web.app') {\n      var gaImgDom = document.createElement('img');\n      gaImgDom.className = 'iswg-tracking-img';\n      var TID = 'UA-142501014-2';\n      var url = \"//www.google-analytics.com/collect?v=1&tid=\".concat(TID, \"&cid=1&t=event&ec=views&ea=\").concat(hostname, \"&el=\").concat(location.href);\n      gaImgDom.src = url;\n      copyrightWrapperDom.appendChild(gaImgDom);\n    }\n\n    baseDom.appendChild(copyrightWrapperDom);\n  }\n\n  function renderStyle() {\n    var style = {\n      base: {\n        background: '#fff',\n        border: '1px solid #ccc',\n        'border-radius': '5px',\n        'box-sizing': 'border-box',\n        padding: '10px',\n        width: Number(options.wrapperWidth) > 10 ? \"\".concat(options.wrapperWidth, \"px\") : '100%'\n      },\n      profile: {\n        'text-align': 'center'\n      },\n      name: {\n        'font-size': '20px',\n        'font-weight': 'bold',\n        margin: '20px 0 10px'\n      },\n      biography: {\n        'font-size': '12px',\n        margin: '0 0 10px'\n      },\n      'follow-btn': {\n        color: '#fff',\n        'background-color': '#3897f0',\n        'border-radius': '4px',\n        display: 'inline-block',\n        'font-size': '14px',\n        'line-height': '24px',\n        margin: '0 0 10px',\n        padding: '6px 12px',\n        'text-align': 'center',\n        'text-decoration': 'none',\n        'white-space': 'nowrap'\n      },\n      'follow-btn-before': {\n        background: 'url(https://cdn.jsdelivr.net/gh/akinov/insta_window@v1.0/dist/ig_icon.png) center no-repeat',\n        'background-size': 'contain',\n        content: '',\n        display: 'inline-block',\n        height: '20px',\n        margin: '-3px 5px 0 0',\n        width: '20px',\n        'vertical-align': 'middle'\n      },\n      images: {\n        display: 'flex',\n        'flex-wrap': 'wrap'\n      },\n      'images-item': {\n        'box-sizing': 'border-box',\n        padding: '3px',\n        width: '33.33%'\n      },\n      'image-link': {\n        margin: 0,\n        padding: 0,\n        'text-decoration': 'none'\n      },\n      image: {\n        width: '100%'\n      },\n      icon: {\n        border: '1px solid #dbdbdb',\n        'border-radius': '50%',\n        width: '33%'\n      },\n      'copyright-wrapper': {\n        'font-size': '8px',\n        'line-height': 1,\n        'text-align': 'right',\n        'padding-right': '5px'\n      },\n      copy: {\n        color: '#ccc',\n        display: 'inline',\n        'font-size': '8px',\n        margin: 0,\n        padding: 0,\n        'text-decoration': 'none'\n      },\n      'tracking-img': {\n        height: 0,\n        opacity: 0,\n        width: 0\n      }\n    };\n    Object.keys(style).forEach(function (key) {\n      var elements = document.querySelectorAll('.iswg-' + key);\n      var length = elements.length;\n      if (length === 0) return;\n\n      for (var i = 0; i < length; i++) {\n        elements[i].setAttribute('style', styleJsonToStyleString(style[key]));\n      }\n    });\n  } // style用jsonを文字列に変換\n\n\n  function styleJsonToStyleString(jsonString) {\n    return JSON.stringify(jsonString).slice(1, -1).replace(/,/g, ';').replace(/\"/g, '');\n  } // datasetからboolean取得すると文字列になるので変換\n\n\n  function toBoolean(booleanStr) {\n    // もともとbool値の場合はそのまま返す\n    if (typeof booleanStr === 'boolean') return booleanStr;\n    return booleanStr.toLowerCase() === 'true';\n  }\n\n  function storageAvailable(type) {\n    var storage;\n\n    try {\n      storage = window[type];\n      var x = '__storage_test__';\n      storage.setItem(x, x);\n      storage.removeItem(x);\n      return true;\n    } catch (e) {\n      return e instanceof DOMException && ( // everything except Firefox\n      e.code === 22 || // Firefox\n      e.code === 1014 || // test name field too, because code might not be present\n      // everything except Firefox\n      e.name === 'QuotaExceededError' || // Firefox\n      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && // acknowledge QuotaExceededError only if there's something already stored\n      storage && storage.length !== 0;\n    }\n  }\n};\n\ninstaWindow();\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });