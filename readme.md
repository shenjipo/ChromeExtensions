## 源码

[chrome插件源码](https://github.com/shenjipo/ChromeExtensions)

## 目标

在平时使用部分系统时，会发现有些系统页面如果一直没有任何调用接口的操作，过一段时间就会需要重新登录，其原因在于这些系统设置了随时间会自动过期的cookie，但是当每次触发cookie校验时，会重置这个过期时间。

因此，可以利用这个机制，写一个`自动调用某个接口的chrome插件`，实现页面长期放置后，仍然保持登录态。

## chrome插件介绍

### 打包与安装方式

1. chrome浏览器提供了打包插件的能力，会将源码打包成为`.crx`压缩包，将这个压缩包上传到chrome插件市场，就可以一键安装了
2. 以开发者模式手动安装（如下图），这种方式主要用于公司内网，无法连接外网的情况

![image_e78b7d18154c8ac3c19afc796d02ecce.png](http://101.133.143.249/api/getImage/image_e78b7d18154c8ac3c19afc796d02ecce.png)

### 项目结构与manifest文件配置

#### 项目结构

所有的文件目录必然包含一个`manifest.json`文件，在这个文件中包含了插件的所有配置，如图

![image_64fcca903d90be86ecb8ca5de1b6a2ec.png](http://101.133.143.249/api/getImage/image_64fcca903d90be86ecb8ca5de1b6a2ec.png)

#### permissions配置

`permissions` 主要用于声明扩展所需的功能性权限（如访问API、tabs、storage等）。

**注意：**

在Manifest V3中，如果你需要向网站发出请求（如通过`fetch`或`XMLHttpRequest`），你需要在 `host_permissions` 中声明目标网站的权限。`permissions` 通常不再用于指定特定网站的访问权限。

```javascript
"permissions": [
    "background"
],
```

`background` 权限：

**作用**：允许扩展使用后台脚本来执行长期运行的任务，甚至在用户没有与扩展交互时也能运行。这个权限通常与 `background` 脚本配合使用

**用途**：在后台处理一些逻辑，例如监听浏览器事件、定期检查数据等，而不需要直接与用户交互。

此外，还有两个常用的配置介绍下

`activeTab` 权限：

**作用**：允许扩展访问当前用户正在浏览的活动标签页的内容（例如，修改页面内容或获取页面信息）。

**用途**：在用户点击扩展图标时，允许扩展执行脚本或获取当前标签页的 URL、DOM 等信息。这个权限通常与 `browserAction` 或 `pageAction` 配合使用。

`scripting` 权限：

**作用**：允许扩展在页面中注入 JavaScript 脚本。

**用途**：在 Manifest V3 中，`scripting` 权限取代了以前的 `tabs` 权限，允许你在页面中动态注入脚本。例如，使用 `chrome.scripting.executeScript` API 向当前页面注入 JavaScript 代码，或通过扩展代码操作页面的 DOM 元素。

#### background配置

background会指定一个js文件，chrome浏览器将在后台执行这个文件，并且常驻进程，直到浏览器关闭，它与任何一个tab页都是独立的上下文环境，可以理解为在后台执行的一个没有UI的js进程，此外在这个进程中访问浏览的资源，例如cookie或者loccalStorage是可以的，这个配置是上实现本文插件的核心配置

#### host_permissions 配置

`host_permissions` 用于声明扩展访问特定网页或资源的权限，通常用于网络请求或访问指定网址。

常用的配置项如下

* `"http://*/*"`: 允许访问所有以 `http://` 开头的网址。
* `"https://example.com/*"`: 允许访问 `example.com` 域名下的所有页面。
* `"*://*/*"`: 允许访问所有网站，无论是 `http` 还是 `https`。

#### action配置

在 Chrome 扩展的 `manifest.json` 文件中，`action` 是 Manifest V3 中用于配置扩展图标、工具栏按钮、弹出窗口等的关键字段。`action` 配置取代了 Manifest V2 中的 `browser_action` 和 `page_action`，使得扩展的按钮配置更加统一。

用于配置扩展的工具栏按钮（即浏览器扩展图标）。在 Manifest V3 中，`action`统一了`browser_action`和`page_action` 的功能。

常见的 `action` 配置项：

1. **`default_icon`**: 用于设置扩展图标的默认图标，可以设置不同尺寸的图标。
2. **`default_popup`**: 设置扩展图标被点击时弹出的 HTML 文件，可以用来创建一个简单的用户界面。
3. **`default_title`**: 设置鼠标悬停在扩展图标上时显示的提示文本。
