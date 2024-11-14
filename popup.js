document.addEventListener('DOMContentLoaded', () => {
    wCookieSource();
    // 获取指定cookie
    const get_all_cookies_element = document.querySelector(".get_all_cookies")
    if (get_all_cookies_element) {
        get_all_cookies_element.addEventListener("click", handleCookie)
    }
    // 设置指定 cookie
    const set_cookie_element = document.querySelector(".set_cookie")
    if (set_cookie_element) {
        set_cookie_element.addEventListener("click", function () {
          chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            let url = tabs[0].url;
            chrome.storage.local.get(['copyCookies'], function(data) {
              if(data.copyCookies) {
                const currentCookiesList = JSON.parse(data.copyCookies);
                currentCookiesList.map(item => {
                  chrome.cookies.set({
                    url,
                    name: item.name,
                    value: item.value,
                  })
                })
              }
            });
          });
            
        })
    }

    // 移除指定 cookie
    const remove_cookie_element = document.querySelector(".remove_cookie")
    if (remove_cookie_element) {
        remove_cookie_element.addEventListener("click", function () {
          chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            let url = tabs[0].url;
            chrome.cookies.getAll({ url }, function (cookies) {
              cookies.map(item => {
                chrome.cookies.remove({  url, name: item.name, })
              })
            });
          });
            
        })
    }

    // 获取网站的cookie，并打印出来
    function handleCookie() {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        let url = tabs[0].url;
        console.log('url--', url);
        chrome.cookies.getAll({ url }, function (cookies) {
          chrome.storage.local.set({
            'copyCookies': JSON.stringify(cookies.map(item => ({ name: item.name, value: item.value }))),
            'copyCookiesOrigin': url
          }, wCookieSource);
        });
      });
    }

    // 写入cookie来源
    function wCookieSource() {
      chrome.storage.local.get(['copyCookies', 'copyCookiesOrigin'], function(data) {
        if(data.copyCookiesOrigin) {
          document.getElementById('origin-damain-url').innerText = data.copyCookiesOrigin || '';
          const cookies = data.copyCookies === '[]' ? '' : data.copyCookies
          document.getElementById('origin-damain-cookie').innerText = cookies;
          document.getElementById('origin-damain-cookie').title = cookies;
        }
      });
    }
})
