var searchBox = document.getElementById('searchName');
searchBox.addEventListener('keypress', function(e) {
  if(13 === e.keyCode) {
    search();
  }
});

function search() {
  var name = searchBox.value;
  var region = document.getElementById('searchRegion').value;
  window.location.href = `/${region}/${name}`;
}

function refresh() {
  window.location.href = `${window.location.pathname}/refresh`;
}
