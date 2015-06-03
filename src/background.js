const serviceFilter = { serviceType: '_cros_p2p._tcp.local' };

function discoverServices(createdWindow) {
  createdWindow.contentWindow.addEventListener('load', function() {

    var onServicesDiscovered = createdWindow.contentWindow.onServicesDiscovered;
    chrome.mdns.onServiceList.addListener(onServicesDiscovered, serviceFilter);

    createdWindow.onClosed.addListener(function() {
      chrome.mdns.onServiceList.removeListener(onServicesDiscovered, serviceFilter);
    });
  });
}

function showWindow() {
  var options = {
    id: 'window',
    frame: { color: '#37474F' },
    innerBounds: { width: 682, minWidth: 682, height: 512, minHeight: 512 }
  };
  chrome.app.window.create('index.html', options, discoverServices);
}

chrome.app.runtime.onLaunched.addListener(showWindow);
