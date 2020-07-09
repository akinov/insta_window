/*!
 * InstaWindowTool
 * https://insta-window-tool.web.app/
 *
 * Copyright Akinov and other contributors
 * Released under the MIT license
 *
 */

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

window.instaWindow = function () {
  var instagramURL = 'https://www.instagram.com/';
  var req = new XMLHttpRequest();
  var baseDom = document.getElementById('insta-widget');
  var images = [];
  var user;

  var options = Object.assign(
    {
      // default options
      username: 'akb48', // 取得対象のユーザー名
      displayImageCount: 9, // 表示する画像数
      wrapperWidth: 300,
      showIcon: true,
      showBiography: true,
      showFollowBtn: true,
      showUsername: true,
    },
    baseDom.dataset
  );

  if (typeof options.displayImageCount == 'string') {
    options.displayImageCount = Number(options.displayImageCount);
  }

  req.onreadystatechange = function () {
    if (req.readyState == 4) {
      // 通信の完了時
      if (req.status == 200) {
        // 通信の成功時
        var json_string = req.response.split('window._sharedData = ')[1];
        json_string = json_string.split('};</script>')[0] + '}';
        user = JSON.parse(json_string).entry_data.ProfilePage[0].graphql.user;
        var datas = user.edge_owner_to_timeline_media.edges;
        for (const i in datas) {
          images.push({
            shortcode: datas[i].node.shortcode,
            url: datas[i].node.thumbnail_src,
          });
        }
        if (storageAvailable('sessionStorage')) {
          sessionStorage.setItem('iswd_username', options.username);
          sessionStorage.setItem('iswd_images', JSON.stringify(images));
          sessionStorage.setItem('iswd_user', JSON.stringify(user));
        }
        clearDom();
        renderDom();
        renderStyle();
      }
    }
  };

  function getHttpRequest() {
    req.open('GET', instagramURL + options.username, true);
    req.send(null);
  }

  if (storageAvailable('sessionStorage')) {
    var settionUsername = sessionStorage.getItem('iswd_username');
    var settionImages = JSON.parse(sessionStorage.getItem('iswd_images'));
    var settionUser = JSON.parse(sessionStorage.getItem('iswd_user'));
    if (
      settionUsername != options.username ||
      settionImages == null ||
      settionUser == null
    ) {
      getHttpRequest();
    } else {
      user = settionUser;
      images = settionImages;
      clearDom();
      renderDom();
      renderStyle();
    }
  } else {
    getHttpRequest();
  }

  function clearDom() {
    baseDom.innerHTML = '';
  }

  function renderDom() {
    // プロフィール追加
    var profileDom = document.createElement('div');
    profileDom.className = 'iswg-profile';
    baseDom.appendChild(profileDom);

    if (toBoolean(options.showFollowBtn)) {
      profileDom.insertAdjacentHTML(
        'afterbegin',
        '<a class="iswg-follow-btn" href="' +
          instagramURL +
          options.username +
          '" target="_blank" rel="noopener"><span class="iswg-follow-btn-before"></span>フォロー</a>'
      );
    }

    if (toBoolean(options.showBiography)) {
      profileDom.insertAdjacentHTML(
        'afterbegin',
        '<div class="iswg-biography">' + user.biography + '</div>'
      );
    }

    if (toBoolean(options.showUsername)) {
      profileDom.insertAdjacentHTML(
        'afterbegin',
        '<div class="iswg-name">' + user.full_name + '</div>'
      );
    }

    if (toBoolean(options.showIcon)) {
      profileDom.insertAdjacentHTML(
        'afterbegin',
        '<a href="' +
          instagramURL +
          options.username +
          '" target="_blank" rel="noopener"><img class="iswg-icon" src="' +
          user.profile_pic_url +
          '"></a>'
      );
    }

    // 写真追加
    var imagesDom = document.createElement('div');
    imagesDom.className = 'iswg-images';
    baseDom.appendChild(imagesDom);

    for (const i in images) {
      if (i >= options.displayImageCount) break;
      var itemDom = document.createElement('div');
      itemDom.className = 'iswg-images-item';

      var linkDom = document.createElement('a');
      linkDom.className = 'iswg-image-link';
      linkDom.href = instagramURL + 'p/' + images[i].shortcode;
      linkDom.target = '_blank';
      linkDom.rel = 'noopener';

      var img = document.createElement('img');
      img.className = 'iswg-image';
      img.src = images[i].url;

      linkDom.appendChild(img);
      itemDom.appendChild(linkDom);
      imagesDom.appendChild(itemDom);
    }

    // コピーライト追加
    var copyrightWrapperDom = document.createElement('div');
    copyrightWrapperDom.className = 'iswg-copyright-wrapper';
    var copyrightDom = document.createElement('a');
    copyrightDom.className = 'iswg-copy';
    copyrightDom.textContent = 'created by InstaWindow';
    copyrightDom.title = '無料インスタグラムブログパーツ InstaWindow';
    copyrightDom.href = 'https://insta-window-tool.web.app/';
    copyrightDom.target = '_blank';
    copyrightWrapperDom.appendChild(copyrightDom);
    // トラッキング用img追加
    const hostname = location.hostname;
    if (hostname != 'localhost' && hostname != 'insta-window-tool.web.app') {
      let gaImgDom = document.createElement('img');
      gaImgDom.className = 'iswg-tracking-img';
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
          Number(options.wrapperWidth) > 10
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
      },
      icon: {
        border: '1px solid #dbdbdb',
        'border-radius': '50%',
        width: '33%',
      },
      'copyright-wrapper': {
        'font-size': '8px',
        'line-height': 1,
        'text-align': 'right',
        'padding-right': '5px',
      },
      copy: {
        color: '#666',
        display: 'inline',
        'font-size': '8px',
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
      let elements = document.querySelectorAll('.iswg-' + key);
      const length = elements.length;

      if (length === 0) return;

      for (var i = 0; i < length; i++) {
        elements[i].setAttribute('style', styleJsonToStyleString(style[key]));
      }
    });
  }

  // style用jsonを文字列に変換
  function styleJsonToStyleString(jsonString) {
    return JSON.stringify(jsonString)
      .slice(1, -1)
      .replace(/,/g, ';')
      .replace(/"/g, '');
  }

  // datasetからboolean取得すると文字列になるので変換
  function toBoolean(booleanStr) {
    // もともとbool値の場合はそのまま返す
    if (typeof booleanStr === 'boolean') return booleanStr;

    return booleanStr.toLowerCase() === 'true';
  }

  function storageAvailable(type) {
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
  }
};

instaWindow();
