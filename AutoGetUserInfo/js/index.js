// 每10分钟触发一次
const interval = 5 * 1000;  // 10分钟，单位为毫秒
const hosts = new Set()
const fullPaths = new Set()
const api = {
    '101.133.143.249': ['/api/getUserInfo'],
    'skycity.top': ['/api/getUserInfo']
}
const FetchApi = (domain) => {
    // 请求 API
    fetch(`http://${domain}/api/getUserInfo`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => response.json()).then(data => {
        console.log("User Info:", data);
    }).catch(error => {
        console.log(`domain=${domain}`, error);
    });
}


// 监听浏览器标签页的更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const domain = new URL(tab.url).hostname;
    if (changeInfo.status === 'complete' && !hosts.has(domain)) {
        // 获取当前页面的域名
        hosts.add(domain)
        // 每10分钟请求一次接口
        setInterval(() => {
            const apis = api[domain]
            if (Array.isArray(apis) && apis.length) {
                apis.forEach(api => {
                    const path = `http://${domain}${api}`
                    fullPaths.add(path)
                    FetchApi(path)
                })
            } else {
                const path = `http://${domain}/api/getUserInfo`
                fullPaths.add(path)
                FetchApi(path)
            }

        }, interval);
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.name !== 'AutoGetUserInfo') {
        return false
    }

    if (message.action === 'GetHosts') {
        const response = {
            fullPaths: Array.from(fullPaths),
        };
        sendResponse(response); // 异步响应，必须在event listener内调用
        return true; // 表示你将会异步发送响应
    }

    // 如果不需要异步响应，可以直接返回false或不做处理
    return false;
});

