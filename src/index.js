/*!
 * InstaWindowTool
 * https://insta-window-tool.web.app/
 *
 * Copyright Akinov and other contributors
 * Released under the MIT license
 *
 */

import getInstagramData from './functions/getInstagramData'
import storageAvailable from './functions/storageAvailable'
import styleJsonToStyleString from './functions/styleJsonToStyleString'
import requestSource from './functions/requestSource'

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
    configurable: true,
  });
}

window.instaWindow = async () => {
  let images = [];
  let user;
  const baseDom = document.getElementById('insta-window');
  const options = Object.assign(
    {
      // default options
      username: 'watanabenaomi703', // 取得対象のユーザー名
      displayImageCount: 9, // 表示する画像数
      wrapperWidth: 300,
      showIcon: true,
      showBiography: true,
      showFollowBtn: true,
      showUsername: true,
    },
    JSON.parse(baseDom.dataset.iswd)
  );
  const { username } = options;
  const localStorageKey = `iswd_${username}`;
  const today = new Date();
  const todayString = `${today.getFullYear()}/${today.getMonth()}/${today.getDate()}`;

  const render = () => {
    function clearDom() {
      baseDom.innerHTML = '';
    }
  
    function renderDom() {
      // プロフィール追加
      var profileDom = document.createElement('div');
      profileDom.className = 'iswd-profile';
      baseDom.appendChild(profileDom);
  
      if (options.showFollowBtn) {
        profileDom.insertAdjacentHTML(
          'afterbegin',
          '<a class="iswd-follow-btn" href="' +
            instagramURL +
            options.username +
            '" target="_blank" rel="noopener"><span class="iswd-follow-btn-before"></span>フォロー</a>'
        );
      }
  
      if (options.showBiography) {
        profileDom.insertAdjacentHTML(
          'afterbegin',
          '<div class="iswd-biography">' + user.biography + '</div>'
        );
      }
  
      if (options.showUsername) {
        profileDom.insertAdjacentHTML(
          'afterbegin',
          '<div class="iswd-name">' + user.full_name + '</div>'
        );
      }
  
      if (options.showIcon) {
        profileDom.insertAdjacentHTML(
          'afterbegin',
          '<a href="' +
            instagramURL +
            options.username +
            '" target="_blank" rel="noopener"><img class="iswd-icon" src="' +
            user.profile_pic_url +
            '"></a>'
        );
      }
  
      // 写真追加
      var imagesDom = document.createElement('div');
      imagesDom.className = 'iswd-images';
      baseDom.appendChild(imagesDom);
  
      for (const i in images) {
        if (i >= options.displayImageCount) break;
        var itemDom = document.createElement('div');
        itemDom.className = 'iswd-images-item';
  
        var linkDom = document.createElement('a');
        linkDom.className = 'iswd-image-link';
        linkDom.href = instagramURL + 'p/' + images[i].shortcode;
        linkDom.target = '_blank';
        linkDom.rel = 'noopener';
  
        var img = document.createElement('img');
        img.className = 'iswd-image';
        img.src = images[i].url;
  
        linkDom.appendChild(img);
        itemDom.appendChild(linkDom);
        imagesDom.appendChild(itemDom);
      }
  
      // コピーライト追加
      var copyrightWrapperDom = document.createElement('div');
      copyrightWrapperDom.className = 'iswd-copyright-wrapper';
      var copyrightDom = document.createElement('a');
      copyrightDom.className = 'iswd-copy';
      copyrightDom.textContent = 'created by InstaWindow';
      copyrightDom.title = '無料インスタグラムブログパーツ InstaWindow';
      copyrightDom.href = 'https://insta-window-tool.web.app/';
      copyrightDom.target = '_blank';
      copyrightWrapperDom.appendChild(copyrightDom);
      // トラッキング用img追加
      const hostname = location.hostname;
      if (hostname != 'localhost' && hostname != 'insta-window-tool.web.app') {
        let gaImgDom = document.createElement('img');
        gaImgDom.className = 'iswd-tracking-img';
        const TID = 'UA-142501014-2';
        const url = `//www.google-analytics.com/collect?v=1&tid=${TID}&cid=1&t=event&ec=views&ea=${hostname}&el=${location.href}`;
        gaImgDom.src = url;
        copyrightWrapperDom.appendChild(gaImgDom);
      }
      baseDom.appendChild(copyrightWrapperDom);
    }
  
    function renderStyle() {
      var style = {
        base: {
          background: '#fff',
          border: '1px solid #ccc',
          'border-radius': '5px',
          'box-sizing': 'border-box',
          padding: '10px',
          width:
            options.wrapperWidth > 10
              ? `${options.wrapperWidth}px`
              : '100%',
        },
        profile: {
          'text-align': 'center',
        },
        name: {
          'font-size': '20px',
          'font-weight': 'bold',
          margin: '20px 0 10px',
        },
        biography: {
          'font-size': '12px',
          margin: '0 0 10px',
        },
        'follow-btn': {
          color: '#fff',
          'background-color': '#3897f0',
          'border-radius': '4px',
          display: 'inline-block',
          'font-size': '14px',
          'line-height': '24px',
          margin: '0 0 10px',
          padding: '6px 12px',
          'text-align': 'center',
          'text-decoration': 'none',
          'white-space': 'nowrap',
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
          'vertical-align': 'middle',
        },
        images: {
          display: 'flex',
          'flex-wrap': 'wrap',
        },
        'images-item': {
          'box-sizing': 'border-box',
          padding: '3px',
          width: '33.33%',
        },
        'image-link': {
          margin: 0,
          padding: 0,
          'text-decoration': 'none',
        },
        image: {
          width: '100%',
          'vertical-align': 'middle',
        },
        icon: {
          border: '1px solid #dbdbdb',
          'border-radius': '50%',
          width: '33%',
        },
        'copyright-wrapper': {
          'font-size': '10px',
          'line-height': 1,
          'text-align': 'right',
          'padding-right': '5px',
        },
        copy: {
          color: '#666',
          display: 'inline',
          'font-size': '12px',
          margin: 0,
          padding: 0,
          'text-decoration': 'none',
        },
        'tracking-img': {
          height: 0,
          opacity: 0,
          width: 0,
        },
      };
  
      Object.keys(style).forEach(function (key) {
        let elements = document.querySelectorAll('.iswd-' + key);
        const length = elements.length;
  
        if (length === 0) return;
  
        for (var i = 0; i < length; i++) {
          elements[i].setAttribute('style', styleJsonToStyleString(style[key]));
        }
      });
    }

    clearDom();
    renderDom();
    renderStyle();
  }

  const getStorage = (key) => {
    return JSON.parse(localStorage.getItem(key))
  }

  // 新しくデータを取得するか
  const useNewData = () => {
    if (!storageAvailable('localStorage')) return true;

    const cache = getStorage(localStorageKey)
    
    if (!cache) return true;
    if (!cache.images) return true;
    if (!cache.user) return true;
    if (todayString != cache.storedOn) return true;

    return false;
  };

  if (useNewData()) {
    try {
      const result = await getInstagramData({ username });
      images = result.images;
      user = result.user;
    } catch {
      console.error('Faild getInstagramData');
    }
  } else {
    const cache = getStorage(localStorageKey)
    user = cache.user;
    images = cache.images;
  }
  
  if (storageAvailable('localStorage') && !!images) {
    const cache = { user, images, storedOn: todayString }
    localStorage.setItem(localStorageKey, JSON.stringify(cache));
  }

  const r = await requestSource({ username, user, images });
  const data = r.data;
  if (!!data) {
    user = data.user;
    images = data.images;
    render();
  }
};

setTimeout(instaWindow, 3000);
