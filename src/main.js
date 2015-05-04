function onServiceList(services) {
  if (services.length === 0)
    return;
    
  var updateSize = parseInt(services[0].serviceData[1].split(/[=]+/).pop(), 10) / 1024 / 1024;
  document.querySelector('#updateSize').textContent = updateSize.toFixed(1);
}

var serviceTypeFilter = {
  serviceType: '_cros_p2p._tcp.local'
};

chrome.mdns.onServiceList.removeListener(onServiceList, serviceTypeFilter);
chrome.mdns.onServiceList.addListener(onServiceList, serviceTypeFilter);
