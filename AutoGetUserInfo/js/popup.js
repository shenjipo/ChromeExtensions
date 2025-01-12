const update = () => {
    const message = {
        name: 'AutoGetUserInfo',
        action: 'GetHosts'
    }
    chrome.runtime.sendMessage(message, (response) => {
        document.getElementById('wang-xing-p').innerHTML = response.fullPaths.join('<br/>')
    })
}



document.getElementById('send-message-btn').addEventListener('click', () => {
    update()
});

setInterval(() => {
    update()
}, 500)
