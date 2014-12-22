# 一个前端学习使用 PhoneGap 的过程

花了两天时间研究了一下 [PhoneGap](http://phonegap.com/)，将过程记录下来，方便下次在别的电脑上搭建开发环境。

**注**：这里以 Android 为目标，其它平台暂不涉及。

## CLI 工具

首先要[安装 Cordova](http://docs.phonegap.com/edge/4.0.0/guide_cli_index.md.html#The%20Command-Line%20Interface_installing_the_cordova_cli)（看了文档才知道，首页的 `Install PhoneGap` 按钮就是一个骗纸，根本就不需要安装）。熟悉 Nodejs 的人很容易就能安装成功了。

## Android SDK

在创建一个 Hello World 之前，电脑上还需要安装对应平台的 SDK 。例如，若需要生成 Android 应用，就需要安装 [Android SDK](http://developer.android.com/sdk/index.html#Other)。
这个链接指向一个 SDK 管理工具。对于 Windows 用户，安装完成后需要在环境变量 `PATH` 里追加 `;D:\AndroidSDK\tools` （这里的地址指向你安装的 SDK 下的 tools 目录）。

在命令行输入 `android` 打开 SDK 管理工具，工具里会列出所有的相关安装包————这些安装包都需要在线安装。但是由于众所周知的原因，在线下载非常非常慢，所以我在网上找到一个[镜像地址](http://mirrors.neusoft.edu.cn/configurations.we#android)，按照上面的配置就可以正常下载了，虽然有点慢。
你也可以参考网上的其它方式（例如离线安装）。

为了能通过 PhoneGap 构建出 Android 应用，需要下载 Android SDK 中的 `Tools/Android SDK Platform-tools` 、 `Tools/Android SDK Build-tools`；

为了能生成指定的 Android 版本，还需要下载你需要的安卓版本中的 `SDK Platform`（例如 `Android 5.0.1 (API 21)/SDK Platform`）；

为了方便开发，还需要下载对应安卓版本的镜像，供安卓模拟器使用。这一块我正在研究中，目前我都是将构建好的 apk 文件直接发到手机上安装调试的。
不过按照文档上来看，我需要安装对应版本下的 `System Image` ，例如 `Android 5.0.1 (API 21)/ARM EABI v7a System Image` 等。

完成上面这些步骤后，就可以开始 Hello World 了。以下流程都来自 [PhoneGap 文档](http://docs.phonegap.com/en/edge/guide_cli_index.md.html#The%20Command-Line%20Interface_create_the_app)。

1. 使用 `cordova create my_first_phonegap_app io.github.lmk123 ThisIsAppTitle` 在当前目录下创建一个项目
2. 上一步创建的 `my_first_phonegap_app` 文件夹下有一个 `www` 文件夹，编辑里面的 `index.html` 文件。按照国际惯例，我写了一串 `hello milk`
3. 在 `my_first_phonegap_app` 文件夹下运行命令 `cordova platform add android`；这样才能在下一步中生成 apk 文件
4. 再运行 `cordova build`，等命令行闹腾完了之后，上面会显示 `BUILD SUCCESS`，后面会跟上一个指向生成的 apk 的路径
5. 接下来就可以发送到自己的安卓手机上安装了

## 使用插件

熟悉这一块之后，我越发觉得开发 PhoneGap 就跟 Chrome 扩展一样了。

例如我要做一个拍照之后将照片显示在页面上的功能，这个功能需要用到照相机，所以我在文档里找到了 [Camera 插件](http://docs.phonegap.com/en/edge/cordova_plugins_pluginapis.md.html#Plugin%20APIs)。
插件的安装方式与 `npm` 类似，也是要在项目目录下运行一个命令：
```
cordova plugin add org.apache.cordova.camera
```
**这里有一个大坑**：PhoneGap 插件的在线安装地址也被墙了，所以安装时需要找一个 vpn。

接下来就可以开始使用插件了。下面的所有代码都运行在 [deviceready 事件](http://docs.phonegap.com/en/edge/cordova_events_events.md.html#deviceready)之后。

回到我们上面提到的 `index.html` 里面，在上面放置一个 `id="camera"` 的按钮，根据插件的文档，我写下了下面的代码：
```js
document.getElementById( 'camera' ).addEventListener( 'click' , function () {
  navigator.camera.getPicture( function cameraSuccess( uri ) {
    var img = new Image();
    img.src = uri;
    document.body.appendChild( img );
  } , function ( msg ) {
    alert( '拍照失败：' + msg );
  } , { destinationType : Camera.DestinationType.FILE_URI } );
} );
```
更进一步的，我们可以在 [PhoneGap 插件库](http://plugins.cordova.io/) 里面搜索自己想要的插件。
现在，我还想使用照相机扫描条码，于是我在插件库里搜索 `barcode`，找到了下载量最多的 [com.phonegap.plugins.barcodescanner](http://plugins.cordova.io/#/package/com.phonegap.plugins.barcodescanner)。它的安装方式与上面的一样。

根据这个插件的文档，我又写了一段代码：
```js
document.getElementById( 'scan' ).addEventListener( 'click' , function () {
  cordova.plugins.barcodeScanner.scan( function ( result ) {
    alert( '条码内容：' + result.text + '\n条码格式：' + result.format);
  } ,
  function ( errMsg ) {
    alert( '扫描失败：' + errMsg );
  } );
} );
```
build 完成之后在安卓手机上安装，上面的代码成功运行~

完毕。
