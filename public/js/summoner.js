function lastUpdated() {
  var span = document.getElementById('lastUpdated'),
      time = Date.now() - new Date(+span.textContent);

  span.textContent = `Updated ${Math.floor(time/1000/60)} minutes ago.`;
}

lastUpdated();
