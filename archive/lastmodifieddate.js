function getLastModified() {
  var text = new Date(document.lastModified);
  text = text.toISOString().split('T')[0];
  document.getElementById("lastModifiedDate").innerHTML = "Last update: " + text;
}