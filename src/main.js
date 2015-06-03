var timeoutId;

function onServicesDiscovered(services) {
  console.log('onServicesDiscovered', services);

  chrome.system.network.getNetworkInterfaces(function(networkInterfaces) {
    var localAddresses = [];
    for (var i = 0; i < networkInterfaces.length; i++) {
      localAddresses.push(networkInterfaces[i].address);
    }

    var downloadedUpdatesDiv = document.querySelector('#downloadedUpdates');
    var availableUpdatesDiv = document.querySelector('#availableUpdates');
    downloadedUpdatesDiv.textContent = '';
    availableUpdatesDiv.textContent = '';

    for (var service of services) {
      if (!service.ipAddress) {
        continue;
      }
      var updatesDiv = createDivElement('update');
      var ipAddressDiv = createDivElement('ipAddress', service.ipAddress);
      updatesDiv.appendChild(ipAddressDiv);

      for (var serviceData of service.serviceData) {
        if (serviceData.startsWith('id_cros_update_size_')) {
          var updateSize = parseInt(serviceData.split(/[=]+/).pop(), 10) / 1024 / 1024;
          var downloadDiv = createDivElement('download', updateSize.toFixed(1));
          downloadDiv.dataset.url = 'http://' + service.ipAddress + ':16725/' +
              serviceData.substr(0, serviceData.lastIndexOf('=')).slice('id_'.length);
          updatesDiv.appendChild(downloadDiv);
        } else if (serviceData.startsWith('num_connections')) {
          var numConnections = parseInt(serviceData.split(/[=]+/).pop(), 10) + '';
          var numConnectionsDiv = createDivElement('numConnections', numConnections);
          numConnectionsDiv.title = numConnections + ' HTTP Connections';
          updatesDiv.insertBefore(numConnectionsDiv, updatesDiv.firstChild);
        }
      }
      if (localAddresses.indexOf(service.ipAddress) == -1) {
        availableUpdatesDiv.appendChild(updatesDiv);
      } else {
        downloadedUpdatesDiv.appendChild(updatesDiv);
      }
    }
    if (!downloadedUpdatesDiv.childElementCount) {
      downloadedUpdatesDiv.appendChild(createDivElement('error', 'Waiting...'));
    }
    if (!availableUpdatesDiv.childElementCount) {
      availableUpdatesDiv.appendChild(createDivElement('error', 'Waiting...'));
    }
    document.body.style.opacity = 1;
  });
}

function createDivElement(className, textContent) {
  var element = document.createElement('div');
  element.textContent = textContent || '';
  element.className = className || '';
  return element;
}

document.querySelector('#availableUpdates').addEventListener('click', function(event) {
  if ('url' in event.target.dataset) {
    window.open(event.target.dataset.url);
  }
});
