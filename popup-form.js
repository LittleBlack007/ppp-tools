// 获取单选框的值
export function getRadioValue() {
  const form = document.getElementById('form');
  const checkedItem = form.querySelector('input[name="cookieRadio"]:checked');
  if(checkedItem) {
    return {
      originUrl: checkedItem.value,
      cookieArr: JSON.parse(checkedItem.dataset.cookieStr ||'[]')
    }
  }
  return {};
}

// 增加可选单选框
export async function renderRadios() {
  const form = document.getElementById('form');
  while (form.hasChildNodes()) {
    form.removeChild(form.firstChild);
  }
  let { pppToolsCookieList } = await chrome.storage.local.get(['pppToolsCookieList']);
  const nodeList = (pppToolsCookieList||[]).map(item => {
    const radioContainer = document.createElement('div');
    radioContainer.setAttribute('class', 'radio-item text-ellipsis');
    const radioItem = document.createElement('INPUT');
    const attrs = {
      type: 'radio',
      name: 'cookieRadio',
      value: item.originUrl,
      'data-cookieStr': item.cookieStr,
      checked: !!item.checked,
      id: item.originUrl,
      title: item.cookieStr,
    };
    Object.keys(attrs).forEach(item => {
      radioItem.setAttribute(item, attrs[item]);
    })
    const spanNode = document.createElement('label');
    var textNode = document.createTextNode(item.originUrl);
    spanNode.setAttribute('for', item.originUrl);
    spanNode.setAttribute('title', item.originUrl);
    spanNode.appendChild(textNode);
    radioContainer.appendChild(radioItem);
    radioContainer.appendChild(spanNode);
    return radioContainer;
  })
  nodeList.forEach(item => {
    form.appendChild(item);
  });
}
