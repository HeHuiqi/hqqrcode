

// 在 Manifest V3 中，您需要使用 chrome.action.onClicked 监听器来处理扩展图标的点击事件。
//  请注意，如果您定义了默认的弹出页面（default_popup），当用户点击扩展图标时，将会显示这个弹出页面，并且不会触发 chrome.action.onClicked 监听器。如果您想要编写自己的点击处理逻辑，请不要在 manifest.json 的 action 字段中设置 default_popup，或者将其设置为空字符串。
// https://blog.csdn.net/xutongbao/article/details/137021326

chrome.action.onClicked.addListener(function (tab) {
    //在新标签中打开页面
    chrome.tabs.create({ url: 'index.html' })
});