import axios from 'axios'
import getInstagramData from './getInstagramData'

// Polyfill Object.assign
if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, 'assign', {
    value: function assign(target, varArgs) {
      // .length of function is 2
      'use strict';
      if (target == null) {
        // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) {
          // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

// Production steps of ECMA-262, Edition 6, 22.1.2.1
if (!Array.from) {
  Array.from = (function () {
      var symbolIterator;
      try {
          symbolIterator = Symbol.iterator
              ? Symbol.iterator
              : 'Symbol(Symbol.iterator)';
      } catch (e) {
          symbolIterator = 'Symbol(Symbol.iterator)';
      }

      var toStr = Object.prototype.toString;
      var isCallable = function (fn) {
          return (
              typeof fn === 'function' ||
              toStr.call(fn) === '[object Function]'
          );
      };
      var toInteger = function (value) {
          var number = Number(value);
          if (isNaN(number)) return 0;
          if (number === 0 || !isFinite(number)) return number;
          return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };
      var maxSafeInteger = Math.pow(2, 53) - 1;
      var toLength = function (value) {
          var len = toInteger(value);
          return Math.min(Math.max(len, 0), maxSafeInteger);
      };

      var setGetItemHandler = function setGetItemHandler(isIterator, items) {
          var iterator = isIterator && items[symbolIterator]();
          return function getItem(k) {
              return isIterator ? iterator.next() : items[k];
          };
      };

      var getArray = function getArray(
          T,
          A,
          len,
          getItem,
          isIterator,
          mapFn
      ) {
          // 16. Let k be 0.
          var k = 0;

          // 17. Repeat, while k < len… or while iterator is done (also steps a - h)
          while (k < len || isIterator) {
              var item = getItem(k);
              var kValue = isIterator ? item.value : item;

              if (isIterator && item.done) {
                  return A;
              } else {
                  if (mapFn) {
                      A[k] =
                          typeof T === 'undefined'
                              ? mapFn(kValue, k)
                              : mapFn.call(T, kValue, k);
                  } else {
                      A[k] = kValue;
                  }
              }
              k += 1;
          }

          if (isIterator) {
              throw new TypeError(
                  'Array.from: provided arrayLike or iterator has length more then 2 ** 52 - 1'
              );
          } else {
              A.length = len;
          }

          return A;
      };

      // The length property of the from method is 1.
      return function from(arrayLikeOrIterator /*, mapFn, thisArg */) {
          // 1. Let C be the this value.
          var C = this;

          // 2. Let items be ToObject(arrayLikeOrIterator).
          var items = Object(arrayLikeOrIterator);
          var isIterator = isCallable(items[symbolIterator]);

          // 3. ReturnIfAbrupt(items).
          if (arrayLikeOrIterator == null && !isIterator) {
              throw new TypeError(
                  'Array.from requires an array-like object or iterator - not null or undefined'
              );
          }

          // 4. If mapfn is undefined, then let mapping be false.
          var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
          var T;
          if (typeof mapFn !== 'undefined') {
              // 5. else
              // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
              if (!isCallable(mapFn)) {
                  throw new TypeError(
                      'Array.from: when provided, the second argument must be a function'
                  );
              }

              // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
              if (arguments.length > 2) {
                  T = arguments[2];
              }
          }

          // 10. Let lenValue be Get(items, "length").
          // 11. Let len be ToLength(lenValue).
          var len = toLength(items.length);

          // 13. If IsConstructor(C) is true, then
          // 13. a. Let A be the result of calling the [[Construct]] internal method
          // of C with an argument list containing the single item len.
          // 14. a. Else, Let A be ArrayCreate(len).
          var A = isCallable(C) ? Object(new C(len)) : new Array(len);

          return getArray(
              T,
              A,
              len,
              setGetItemHandler(isIterator, items),
              isIterator,
              mapFn
          );
      };
  })();
}

window.instaWindow = async (baseDom) => {
  let images = [];
  let user;

  const options = Object.assign(
    {
      // default options
      username: 'watanabenaomi703', // 取得対象のユーザー名
      total: 9, // 表示する画像数
      column: 3, 
      borderColor: '#ccc',
      width: 300,
      // プロフィール関係
      usernameColor: '#666',
      usernameSize: '20px',
      bioAlign: 'center',
      bioColor: '#666',
      bioSize: '12px',
      // フォローボタン関係
      followColor: '#fff',
      followBgColor: '#3897f0',
      followIcon: true,
      followText: 'フォロー',
      // 表示順番
      orders: [
        'icon', 'name', 'bio', 'btn'
      ],
    },
    JSON.parse(baseDom.dataset.iswd)
  );
  const { username, apiKey } = options;
  const localStorageKey = `iswd_${username}`;
  const today = new Date();
  const todayString = `${today.getFullYear()}/${today.getMonth()}/${today.getDate()}`;

  const render = () => {
    const instagramURL = 'https://www.instagram.com/';
    const followDom = () => {
      return `<a class="iswd-follow-btn" href="${instagramURL}${username}" target="_blank" rel="noopener">
              ${options.followIcon ? '<span class="iswd-follow-btn-before"></span>' : ''}
              ${options.followText}
              </a>`;
    }
    const bioDom = () => {
      return `<div class="iswd-bio">${user.biography}</div>`;
    }
    const usernameDom = () => {
      return `<div class="iswd-name">${user.full_name}</div>`;
    }
    const iconDom = () => {
      return `<a href="${instagramURL}${username}" target="_blank" rel="noopener"><img class="iswd-icon" src="${user.profile_pic_url}"></a>`;
    }
    const imagesDom = () => {
      const wrapper = document.createElement('div');
      wrapper.className = 'iswd-images';
      for (const i in images) {
        if (i >= options.total) break;
        
        const item = document.createElement('div');
        item.className = 'iswd-images-item';
  
        const link = document.createElement('a');
        link.className = 'iswd-image-link';
        link.href = instagramURL + 'p/' + images[i].shortcode;
        link.target = '_blank';
        link.rel = 'noopener';
  
        const img = document.createElement('img');
        img.className = 'iswd-image';
        img.src = images[i].url;
  
        link.appendChild(img);
        item.appendChild(link);
        wrapper.appendChild(item);
      }
      return wrapper;
    }
    const copyrightDom = () => {
      const wrapper = document.createElement('div');
      wrapper.className = 'iswd-tracking-wrapper';
      // トラッキング用img追加
      const hostname = location.hostname;
      if (hostname != 'localhost' && hostname != 'insta-window-tool.web.app') {
        let gaImg = document.createElement('img');
        gaImg.className = 'iswd-tracking-img';
        const TID = 'UA-142501014-2';
        const url = `//www.google-analytics.com/collect?v=1&tid=${TID}&cid=1&t=event&ec=views&ea=${hostname}&el=${location.href}`;
        gaImg.src = url;
        wrapper.appendChild(gaImg);
      }
      return wrapper;
    }
    const renderStyle = () => {
      const style = {
        base: {
          background: '#fff',
          border: `1px solid ${options.borderColor}`,
          'border-radius': '5px',
          'box-sizing': 'border-box',
          padding: '10px',
          width:
            options.width > 10
              ? `${options.width}px`
              : '100%'
        },
        profile: {
          'text-align': 'center'
        },
        name: {
          color: usernameColor,
          'font-size': usernameSize,
          'font-weight': 'bold',
          margin: '20px 0 10px'
        },
        bio: {
          color: options.bioColor,
          'font-size': options.bioSize,
          margin: '0 0 10px',
          'text-align': options.bioAlign
        },
        'follow-btn': {
          color: options.followColor,
          'background-color': options.followBgColor,
          'border-radius': '4px',
          display: 'inline-block',
          'font-size': '14px',
          'line-height': '24px',
          margin: '0 0 10px',
          padding: '6px 12px',
          'text-align': 'center',
          'text-decoration': 'none',
          'white-space': 'nowrap'
        },
        'follow-btn-before': {
          background:
            'url(https://cdn.jsdelivr.net/gh/akinov/insta_window@v1.0/dist/ig_icon.png) center no-repeat',
          'background-size': 'contain',
          content: '',
          display: 'inline-block',
          height: '20px',
          margin: '-3px 5px 0 0',
          width: '20px',
          'vertical-align': 'middle'
        },
        images: {
          display: 'flex',
          'flex-wrap': 'wrap'
        },
        'images-item': {
          'box-sizing': 'border-box',
          padding: '3px',
          width: `${100 / options.column}%`
        },
        'image-link': {
          margin: 0,
          padding: 0,
          'text-decoration': 'none'
        },
        image: {
          width: '100%',
          'vertical-align': 'middle',
        },
        icon: {
          border: '1px solid #dbdbdb',
          'border-radius': '50%',
          width: '33%'
        },
        'tracking-wrapper': {
          height: 0
        },
        'tracking-img': {
          height: 0,
          opacity: 0,
          width: 0
        }
      };
      // style用jsonを文字列に変換
      const styleJsonToStyleString = (jsonString) => {
        return JSON.stringify(jsonString)
          .slice(1, -1)
          .replace(/,/g, ';')
          .replace(/"/g, '');
      }
  
      baseDom.setAttribute('style', styleJsonToStyleString(style.base));
      Object.keys(style).forEach((key) => {
        const elements = baseDom.getElementsByClassName('iswd-' + key);
        const length = elements.length;
  
        if (length === 0) return;
  
        for (let i = 0; i < length; i++) {
          elements[i].setAttribute('style', styleJsonToStyleString(style[key]));
        }
      });
    }

    // clear DOM
    baseDom.innerHTML = '';
    // プロフィール追加
    if (options.orders.length > 0) {
      const profileDom = document.createElement('div');
      profileDom.className = 'iswd-profile';
      baseDom.appendChild(profileDom);

      const doms = {
        icon: iconDom(),
        name: usernameDom(),
        bio: bioDom(),
        btn: followDom()
      }
      options.orders.forEach((domName) => { 
        if (doms[domName]) {
          profileDom.insertAdjacentHTML('beforeend', doms[domName]);
        }
      })
    }

    // 写真追加
    baseDom.appendChild(imagesDom());
    // コピーライト追加
    baseDom.appendChild(copyrightDom());
    renderStyle();
  };

  const storageAvailable = (type) => {
    var storage;
    try {
      storage = window[type];
      var x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  };

  const getStorage = () => {
    return JSON.parse(localStorage.getItem(localStorageKey))
  };

  // 新しくデータを取得するか
  const useNewData = () => {
    if (!storageAvailable('localStorage')) return true;

    const cache = getStorage()
    
    if (!cache) return true;
    if (!cache.images) return true;
    if (!cache.user) return true;
    if (todayString != cache.storedOn) return true;

    return false;
  };

  const requestSource = async () => {
    return await axios.get('https://google.com')
  };

  if (useNewData()) {
    try {
      const result = getInstagramData({ username });
      images = result.images;
      user = result.user;
    } catch {
      console.error('Faild getInstagramData');
    }
  } else {
    const cache = getStorage()
    user = cache.user;
    images = cache.images;
  }
  
  if (storageAvailable('localStorage')) {
    const cache = { user, images, storedOn: todayString }
    localStorage.setItem(localStorageKey, JSON.stringify(cache));
  }

  const r = await requestSource();
  if (!!r) {
    user = r.user;
    images = r.images;
    render();
  }
};

Array.from(document.getElementsByClassName('iswd-base')).forEach((e) => {
  instaWindow(e);
});

