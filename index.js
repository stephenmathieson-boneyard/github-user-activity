
var minstache = require('minstache');
var Emitter = require('emitter');
var jsonp = require('jsonp');

module.exports = UserActivity;

function UserActivity(user, opts) {
  if (!(this instanceof UserActivity)) return new UserActivity(opts);
  this.options = opts || {};
  this.data = null;
  this.url = 'https://api.github.com/users/' + user + '/events';
}

Emitter(UserActivity.prototype);

UserActivity.prototype.fetch = function () {
  var self = this;
  jsonp(this.url, this.opts, function (err, data) {
    if (err) return self.error(err);
    self.emit('data', data.data);
  });
  return this;
};

UserActivity.prototype.render = function (element) {
  if ('string' === typeof element) {
    element = document.querySelector(element);
  }

  var div = document.createElement('div');
  var ul = document.createElement('ul');
  div.appendChild(ul);

  this
  .fetch()
  .once('data', function (data) {
    for (var i = 0, l = data.length; i < l; i++) {
      var event = data[i];
      var li = document.createElement('li');
      li.innerHTML = this.templates[event.type]
        ? minstache(this.templates[event.type], event)
        : '<!--\n' + JSON.stringify(event, null, 2) + '\n-->';
      ul.appendChild(li);
    }
    element.innerHTML = div.innerHTML;
  });
};

UserActivity.prototype.error = function (err) {
  if (!this.hasListeners('error')) throw err;
  this.emit('error', err);
};

// TODO: CreateEvent, DeleteEvent, other missing events...
UserActivity.prototype.templates = {
    IssueCommentEvent:
        '<span class="comment">'
      + '  <a href="https://github.com/{{actor.login}}" class="user">{{actor.login}}</a>'
      + '  <a href="{{payload.comment.html_url}}" class="comment">commented</a>'
      + '  on'
      + '  <a href="https://github.com/{{repo.name}}" class="repo">{{repo.name}}</a>'
      + '</span>'
  , PushEvent:
        '<span class="push commit">'
      + '  <a href="https://github.com/{{actor.login}}" class="user">{{actor.login}}</a>'
      + '  pushed a'
      + '  <a href="https://github.com/{{repo.name}}/commit/{{payload.head}}" class="commit">commit</a>'
      + '  to'
      + '  <a href="https://github.com/{{repo.name}}">{{repo.name}}</a>'
      + '</span>'
  , PullRequestEvent:
        '<span class="pull-request {{payload.action}}">'
      + '  <a href="https://github.com/{{actor.login}}" class="user">{{actor.login}}</a>'
      + '  {{payload.action}}'
      + '  <a href="{{payload.pull_request.html_url}}">pull request #{{payload.number}}</a>'
      + '  in'
      + '  <a href="https://github.com/{{repo.name}}">{{repo.name}}</a>'
      + '</span>'
  , ForkEvent:
        '<span class="fork">'
      + '  <a href="https://github.com/{{actor.login}}" class="user">{{actor.login}}</a>'
      + '  forked'
      + '  <a href="https://github.com/{{repo.name}}" class="repo">{{repo.name}}</a>'
      + '  to'
      + '  <a href="https://github.com/{{payload.forkee.full_name}}" class="user">{{payload.forkee.full_name}}</a>'
      + '</span>'
  , IssuesEvent:
        '<span class="issue {{payload.action}}">'
      + '  <a href="https://github.com/{{actor.login}}" class="user">{{actor.login}}</a>'
      + '  {{payload.action}}'
      + '  <a href="{{payload.issue.html_url}}">issue#{{payload.issue.number}}</a>'
      + '  in'
      + '  <a href="https://github.com/{{repo.name}}" class="repo">{{repo.name}}</a>'
      + '</span>'
  , CommitCommentEvent:
        '<span class="comment commit">'
      + '  <a href="https://github.com/{{actor.login}}" class="user">{{actor.login}}</a>'
      + '  <a href="{{payload.comment.html_url}}">commented</a>'
      + '  on'
      + '  <a href="https://github.com/{{repo.name}}" class="repo">{{repo.name}}</a>'
      + '</span>'
  , WatchEvent:
        '<span class="watch {{payload.action}}">'
      + '  <a href="https://github.com/{{actor.login}}" class="user">{{actor.login}}</a>'
      + '  {{payload.action}}'
      + '  watching'
      + '  <a href="https://github.com/{{repo.name}}" class="repo">{{repo.name}}</a>'
      + '</span>'
  , MemberEvent:
        '<span class="member {{payload.action}}">'
      + '  <a href="https://github.com/{{actor.login}}" class="user">{{actor.login}}</a>'
      + '  {{payload.action}}'
      + '  <a href="https://github.com/{{payload.member.login}}" class="user member">{{payload.member.login}}</a>'
      + '  to'
      + '  <a href="https://github.com/{{repo.name}}" class="repo">{{repo.name}}</a>'
      + '</span>'
};
