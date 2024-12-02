import { renderRadios, getRadioValue } from './popup-form.js';

document.addEventListener('DOMContentLoaded', () => {
    renderRadios();
    // 获取指定cookie
    const get_all_cookies_element = document.querySelector(".get_all_cookies")
    if (get_all_cookies_element) {
      get_all_cookies_element.addEventListener("click", addCookie)
    }
    // 设置指定 cookie
    const set_cookie_element = document.querySelector(".set_cookie")
    if (set_cookie_element) {
        set_cookie_element.addEventListener("click", async function () {
          const checkedItem = getRadioValue();
          const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
          let url = tabs[0].url;
          const currentCookiesList = checkedItem.cookieArr;
          currentCookiesList.map(item => {
            chrome.cookies.set({
              url,
              name: item.name,
              value: item.value,
            })
          })
        })
    }

    // 移除当前页面指定 cookie
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

    // 删除勾选cookie
    const remove_cur_cookie_element = document.querySelector(".remove_cur_cookie")
    if (remove_cur_cookie_element) {
      remove_cur_cookie_element.addEventListener("click", async function () {
        const checkedItem = getRadioValue();
        let { pppToolsCookieList } =  await chrome.storage.local.get(['pppToolsCookieList']) || [];
        pppToolsCookieList = pppToolsCookieList.filter(item => item.originUrl !== checkedItem.originUrl);
        chrome.storage.local.set({ pppToolsCookieList });
        renderRadios();
      })
    }
    
    // 获取网站的cookie
    async function addCookie() {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      let url = tabs[0].url;
      const cookies = await chrome.cookies.getAll({ url });
      let { pppToolsCookieList } =  await chrome.storage.local.get(['pppToolsCookieList']) || [];
      pppToolsCookieList = pppToolsCookieList.filter(item => item.originUrl !== url)
      pppToolsCookieList.push({
        'cookieStr': JSON.stringify(cookies.map(item => ({ name: item.name, value: item.value }))),
        'originUrl': url
      })
      await chrome.storage.local.set({ pppToolsCookieList });
      renderRadios();
    }

})
