'use strict';

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
    configurable: true
  });
}

window.instaWindow = function () {
  var instagramURL = 'https://www.instagram.com/';
  var req = new XMLHttpRequest();
  var baseDom = document.getElementById('insta-widget');
  var images = [];
  var user;

  var options = Object.assign({
    // default options
    username: 'akb48', // 取得対象のユーザー名
    displayImageCount: 9, // 表示する画像数
    wrapperWidth: 300,
    showIcon: true,
    showBiography: true,
    showFollowBtn: true,
    showUsername: true
  }, baseDom.dataset);

  req.onreadystatechange = function () {
    if (req.readyState == 4) {
      // 通信の完了時
      if (req.status == 200) {
        // 通信の成功時
        var json_string = req.response.split('window._sharedData = ')[1];
        json_string = json_string.split('};</script>')[0] + '}';
        user = JSON.parse(json_string).entry_data.ProfilePage[0].graphql.user;
        var datas = user.edge_owner_to_timeline_media.edges;
        for (var i in datas) {
          if (i >= options.displayImageCount) break;
          images.push({
            shortcode: datas[i].node.shortcode,
            url: datas[i].node.thumbnail_src
          });
        }
        clearDom();
        renderDom();
        renderStyle();
      }
    }
  };

  req.open('GET', instagramURL + options.username, true);
  req.send(null);

  function clearDom() {
    baseDom.innerHTML = '';
  }

  function renderDom() {
    // プロフィール追加
    var profileDom = document.createElement('div');
    profileDom.className = 'iswg-profile';
    baseDom.appendChild(profileDom);

    if (toBoolean(options.showFollowBtn)) {
      profileDom.insertAdjacentHTML('afterbegin', '<a class="iswg-follow-btn" href="' + instagramURL + options.username + '" target="_blank" rel="noopener"><span class="iswg-follow-btn-before"></span>フォロー</a>');
    }

    if (toBoolean(options.showBiography)) {
      profileDom.insertAdjacentHTML('afterbegin', '<div class="iswg-biography">' + user.biography + '</div>');
    }

    if (toBoolean(options.showUsername)) {
      profileDom.insertAdjacentHTML('afterbegin', '<div class="iswg-name">' + user.full_name + '</div>');
    }

    if (toBoolean(options.showIcon)) {
      profileDom.insertAdjacentHTML('afterbegin', '<a href="' + instagramURL + options.username + '" target="_blank" rel="noopener"><img class="iswg-icon" src="' + user.profile_pic_url + '"></a>');
    }

    // 写真追加
    var imagesDom = document.createElement('div');
    imagesDom.className = 'iswg-images';
    baseDom.appendChild(imagesDom);

    for (var i in images) {
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
    copyrightDom.className = 'iswg-copyright';
    copyrightDom.textContent = '©';
    copyrightDom.title = '無料インスタグラムブログパーツ InstaWindow';
    copyrightDom.href = 'https://insta-window-tool.web.app/';
    copyrightDom.target = '_blank';
    copyrightWrapperDom.appendChild(copyrightDom);
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
        width: Number(options.wrapperWidth) > 10 ? options.wrapperWidth + 'px' : '100%'
      },
      profile: {
        'text-align': 'center'
      },
      name: {
        'font-size': '20px',
        'font-weight': 'bold',
        margin: '20px 0 10px'
      },
      biography: {
        'font-size': '12px',
        margin: '0 0 10px'
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
        'white-space': 'nowrap'
      },
      'follow-btn-before': {
        background: 'url(https://insta-window-tool.web.app/ig_icon.png) center no-repeat',
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
        width: '33.33%'
      },
      'image-link': {
        'text-decoration': 'none'
      },
      image: {
        width: '100%'
      },
      icon: {
        border: '1px solid #dbdbdb',
        'border-radius': '50%',
        width: '33%'
      },
      'copyright-wrapper': {
        'font-size': '8px',
        'line-height': 1,
        'text-align': 'right',
        'padding-right': '5px'
      },
      copyright: {
        color: '#ccc',
        'font-size': '8px',
        'text-decoration': 'none'
      }
    };

    Object.keys(style).forEach(function (key) {
      var elements = document.querySelectorAll('.iswg-' + key);

      if (elements.length === 0) return;

      elements.forEach(function (element, index) {
        element.setAttribute('style', styleJsonToStyleString(style[key]));
      });
    });
  }

  // style用jsonを文字列に変換
  function styleJsonToStyleString(jsonString) {
    return JSON.stringify(jsonString).slice(1, -1).replace(/,/g, ';').replace(/"/g, '');
  }

  // datasetからboolean取得すると文字列になるので変換
  function toBoolean(booleanStr) {
    // もともとbool値の場合はそのまま返す
    if (typeof booleanStr === 'boolean') return booleanStr;

    return booleanStr.toLowerCase() === 'true';
  }
};

instaWindow();