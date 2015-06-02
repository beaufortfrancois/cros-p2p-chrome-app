function onServicesDiscovered(services) {
  if (services.length === 0)
    return;

  var downloadedUpdatesDiv = document.querySelector('#downloadedUpdates');
  var availableUpdatesDiv = document.querySelector('#availableUpdates');

  downloadedUpdatesDiv.textContent = '';
  availableUpdatesDiv.textContent = '';

  //DEBUG
  /*
  services.push({
    ipAddress: "192.168.144.216",
    serviceData: [
      "num_connections=0",
      "id_cros_update_size_18205492_hash_aS9KNVdMRDhmZk9sdXAwZytVZTNGY2RHVHVBVXZRaCtJc2g5dWxjQ1dBcz0=.cros_au=18205492"
    ]
  }, {
    ipAddress: "192.168.144.143",
    serviceData: [
      "num_connections=2",
      "id_cros_update_size_12205492_hash_aS9KNVdMRDhmZk9sdXAwZytVZTNGY2RHVHVBVXZRaCtJc2g5dWxjQ1dBcz0=.cros_au=23205492",
      "id_cros_update_size_12205492_hash_aS9KNVdMRDhmZk9sdXAwZytVZTNGY2RHVHVBVXZRaCtJc2g5dWxjQ1dBcz0=.cros_au=28205492"
    ]
  }, {
    ipAddress: "192.168.144.200",
    serviceData: [
      "num_connections=2",
      "id_cros_update_size_22205492_hash_aS9KNVdMRDhmZk9sdXAwZytVZTNGY2RHVHVBVXZRaCtJc2g5dWxjQ1dBcz0=.cros_au=12205492"
    ]
  });
  */

  var localAddresses = [];
  chrome.system.network.getNetworkInterfaces(function(networkInterfaces) {
    for (var i = 0; i < networkInterfaces.length; i++) {
      localAddresses.push(networkInterfaces[i].address);
    }

    for (var i = 0; i < services.length; i++) {
      var updatesParentDiv = downloadedUpdatesDiv;
      if (localAddresses.indexOf(services[i].ipAddress) == -1) {
        updatesParentDiv = availableUpdatesDiv;
      }
      var updatesDiv = document.createElement('div');
      updatesDiv.classList.add('update');

      var ipAddressDiv = document.createElement('div');
      ipAddressDiv.textContent = services[i].ipAddress;
      ipAddressDiv.classList.add('ipAddress');
      updatesDiv.appendChild(ipAddressDiv);

      for (var j = 0; j < services[i].serviceData.length; j++) {
        var serviceData = services[i].serviceData[j];
        if (serviceData.startsWith('id_cros_update_size_')) {
          var updateSize = parseInt(serviceData.split(/[=]+/).pop(), 10) / 1024 / 1024;
          var downloadDiv = document.createElement('div');
          downloadDiv.textContent = updateSize.toFixed(1);
          downloadDiv.classList.add('download');
          if (updatesParentDiv === availableUpdatesDiv) {
            downloadDiv.dataset.url = 'http://' + services[i].ipAddress + ':16725/' + serviceData;
          }
          updatesDiv.appendChild(downloadDiv);
        } else if (serviceData.startsWith('num_connections')) {
          var numConnections = parseInt(serviceData.split(/[=]+/).pop(), 10);
          var numConnectionsDiv = document.createElement('div');
          numConnectionsDiv.textContent = numConnections;
          numConnectionsDiv.classList.add('numConnections');
          updatesDiv.insertBefore(numConnectionsDiv, updatesDiv.firstChild);
        }
      }
      updatesParentDiv.appendChild(updatesDiv);
    }
  });
  console.log(services);
}

document.body.addEventListener('click', function(event) {
  if (!event.target.classList.contains('download') && 'url' in event.target.dataset) {
    return;
  }
  window.open(event.target.dataset.url);
});
