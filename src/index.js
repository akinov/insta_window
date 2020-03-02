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

window.instaWindow = function() {
  var instagramURL = 'https://www.instagram.com/';
  var req = new XMLHttpRequest();
  var baseDom = document.getElementById('insta-window');
  var images = [];
  var user;

  var options = Object.assign(
    {
      // default options
      username: 'watanabenaomi703', // 取得対象のユーザー名
      total: 9, // 表示する画像数
      column: 3, 
      borderColor: '#ccc',
      width: 300,
      // プロフィール関係
      showUsername: true,
      usernameColor: '#666',
      usernameSize: '20px',
      icon: true,
      bio: true,
      bioAlign: 'center',
      bioColor: '#666',
      usernameSize: '12px',
      // フォローボタン関係
      follow: true,
      followColor: '#fff',
      followBgColor: '#3897f0',
      followIcon: true,
      followText: 'フォロー'
    },
    baseDom.dataset
  );

  req.onreadystatechange = function() {
    if (req.readyState == 4) {
      // 通信の完了時
      if (req.status == 200) {
        // 通信の成功時
        var json_string = req.response.split('window._sharedData = ')[1];
        json_string = json_string.split('};</script>')[0] + '}';
        user = JSON.parse(json_string).entry_data.ProfilePage[0].graphql.user;
        var datas = user.edge_owner_to_timeline_media.edges;
        // TODO: totalがdatasの数を上回った場合の処理(最高9個しか動かない)
        for (const i in datas) {
          if (i >= options.total) break;
          images.push({
            shortcode: datas[i].node.shortcode,
            url: datas[i].node.thumbnail_src
          });
        }
        clearDom();
        render();
        renderStyle();
      }
    }
  };

  req.open('GET', instagramURL + options.username, true);
  req.send(null);

  function clearDom() {
    baseDom.innerHTML = '';
  }

  function followDom() {
    if (toBoolean(options.follow)) {
      return `<a class="iswd-follow-btn" href="${instagramURL}${options.username}" target="_blank" rel="noopener">
              ${options.followIcon ? '<span class="iswd-follow-btn-before"></span>' : ''}
              ${options.followText}
              </a>`;
    } else {
      return '';
    }
  }
  function bioDom() {
    if (toBoolean(options.bio)) {
      return `<div class="iswd-bio">${user.biography}'</div>`;
    } else {
      return '';
    }
  }
  function usernameDom() {
    if (toBoolean(options.showUsername)) {
      return `<div class="iswd-name">${user.full_name}</div>`;
    } else {
      return '';
    }
  }
  function iconDom() {
    if (toBoolean(options.icon)) {
      return `<a href="${instagramURL}${options.username}" target="_blank" rel="noopener"><img class="iswd-icon" src="${user.profile_pic_url}"></a>`;
    } else {
      return '';
    }
  }
  function imagesDom() {
    var imagesDom = document.createElement('div');
    imagesDom.className = 'iswd-images';
    for (const i in images) {
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
    return imagesDom;
  }
  function copyrightDom() {
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
    return copyrightWrapperDom;
  }

  function render() {
    // プロフィール追加
    var profileDom = document.createElement('div');
    profileDom.className = 'iswd-profile';
    baseDom.appendChild(profileDom);

    var doms = [followDom(), bioDom(), usernameDom(), iconDom()]
    for (const i in doms) {
      profileDom.insertAdjacentHTML(
        'afterbegin',
        doms[i]
      );
    }
    // 写真追加
    baseDom.appendChild(imagesDom());
    // コピーライト追加
    baseDom.appendChild(copyrightDom());
  }

  function renderStyle() {
    var style = {
      base: {
        background: '#fff',
        border: `1px solid ${options.borderColor}`,
        'border-radius': '5px',
        'box-sizing': 'border-box',
        padding: '10px',
        width:
          Number(options.width) > 10
            ? `${options.width}px`
            : '100%'
      },
      profile: {
        'text-align': 'center'
      },
      name: {
        color: options.usernameColor,
        'font-size': options.usernameSize,
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
        width: `${100 / column}%`
      },
      'image-link': {
        margin: 0,
        padding: 0,
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
      copy: {
        color: '#ccc',
        display: 'inline',
        'font-size': '8px',
        margin: 0,
        padding: 0,
        'text-decoration': 'none'
      },
      'tracking-img': {
        height: 0,
        opacity: 0,
        width: 0
      }
    };

    Object.keys(style).forEach(function(key) {
      let elements = document.querySelectorAll('.iswd-' + key);
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
};

instaWindow();
