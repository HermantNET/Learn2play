var span = document.getElementById('lastUpdated');
var updated = new Date(+span.textContent);

function lastUpdated() {
  var time = Date.now() - updated;
  span.textContent = `Updated ${Math.floor(time/1000/60)} minutes ago.`;
}

lastUpdated();
setInterval(lastUpdated, 30000);
