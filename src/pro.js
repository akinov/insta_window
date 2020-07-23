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

window.instaWindow = (baseDom) => {
  const instagramURL = 'https://www.instagram.com/';
  const req = new XMLHttpRequest();
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

  const clearDom = () => {
    baseDom.innerHTML = '';
  }

  const followDom = () => {
    return `<a class="iswd-follow-btn" href="${instagramURL}${options.username}" target="_blank" rel="noopener">
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
    return `<a href="${instagramURL}${options.username}" target="_blank" rel="noopener"><img class="iswd-icon" src="${user.profile_pic_url}"></a>`;
  }
  const imagesDom = () => {
    const wrapper = document.createElement('div');
    wrapper.className = 'iswd-images';
    for (const i in images) {
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

  const render = () => {
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

  // style用jsonを文字列に変換
  const styleJsonToStyleString = (jsonString) => {
    return JSON.stringify(jsonString)
      .slice(1, -1)
      .replace(/,/g, ';')
      .replace(/"/g, '');
  }

  // datasetからboolean取得すると文字列になるので変換
  const toBoolean = (booleanStr) => {
    // もともとbool値の場合はそのまま返す
    if (typeof booleanStr === 'boolean') return booleanStr;

    return booleanStr.toLowerCase() === 'true';
  }

  req.onreadystatechange = () => {
    if (req.readyState == 4) {
      // 通信の完了時
      if (req.status == 200) {
        // 通信の成功時
        let json_string = req.response.split('window._sharedData = ')[1];
        json_string = json_string.split('};</script>')[0] + '}';
        user = JSON.parse(json_string).entry_data.ProfilePage[0].graphql.user;
        const datas = user.edge_owner_to_timeline_media.edges;
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
};

Array.from(document.getElementsByClassName('iswd-base')).forEach((e) => {
  instaWindow(e);
});

