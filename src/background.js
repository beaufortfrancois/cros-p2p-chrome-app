chrome.app.runtime.onLaunched.addListener(function() {
  var windowOptions = {
    id: 'window',
    frame: { color: '#0097A7' },
    innerBounds: { minWidth: 682, minHeight: 512 }
  };
  chrome.app.window.create('index.html', windowOptions, discoverServices);
});

var serviceFilter = {
  serviceType: '_cros_p2p._tcp.local'
};

function discoverServices(createdWindow) {
  createdWindow.contentWindow.addEventListener('load', function() {

    var onServicesDiscovered = createdWindow.contentWindow.onServicesDiscovered;
    chrome.mdns.onServiceList.addListener(onServicesDiscovered, serviceFilter);

    createdWindow.onClosed.addListener(function() {
      chrome.mdns.onServiceList.removeListener(onServicesDiscovered, serviceFilter);
    });
  });
}
