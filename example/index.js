
var Activity = require('github-user-activity');
var user = document.querySelector('#user');
var button = document.querySelector('button');

button.addEventListener('click', render);

user.addEventListener('keydown', function (e) {
  if (13 === e.which) {
    render();
  }
});

function render() {
  var username = user.value;
  var a = new Activity(username);
  a.render('.github-user-activity');
}
