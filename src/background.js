chrome.app.runtime.onLaunched.addListener(function(launchData) {
  var windowOptions = {
    id: 'window2',
    resizable: false,
    frame: {
      color: '#0097A7',
    },
    innerBounds: {
      width: 256,
      height: 256,
    },
  };
  chrome.app.window.create('index.html', windowOptions);
});