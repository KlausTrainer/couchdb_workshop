'use strict';

const App = function(dbUrl) {
  this.dbUrl = dbUrl;
  this.recentArticlesUrl = dbUrl + '/_design/feeds/_view/recent_articles';
  this.startkey = '"3012-12-12T23%3A59%3A59.999Z"';
  this.docs = {};

  this.articleList = document.querySelector('.articles');
  this.articleTemplate = Handlebars.compile(
    document.getElementById('article-template').innerHTML);

  this.fetchRecentArticles()
    .then(this.processArticles.bind(this));
};

App.prototype.fetchRecentArticles = function(options) {
  if (typeof options !== 'object') {
    options = {};
  }

  if (typeof options.startkey !== 'string') {
    options.startkey = this.startkey;
  }

  if (typeof options.limit !== 'number') {
    options.limit = 8;
  }

  const url = this.recentArticlesUrl + '?descending=true&include_docs=true'
                + '&startkey=' + options.startkey
                + '&limit=' + options.limit;

  return new Promise(function(resolve, reject) {
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(result) {
      if (result.rows && result.rows.length > 0) {
        resolve(result.rows);
      } else {
        console.log('could not fetch articles:', result);
        resolve([]);
      }
    }).catch(function(err) {
      console.log(err);
    });
  });
};

App.prototype.processArticles = function(articles) {
  articles.forEach(function(article) {
    this.docs[article.id] = article.doc;
  }, this);

  this.renderArticles(articles);
};

App.prototype.renderArticles = function(articles) {
  articles.forEach(function(article) {
    const articleElement = document.createElement('article'),
          doc = article.doc;

    doc.object.favorite = doc.object.favorite === '★' ? '★' : '☆';
    articleElement.innerHTML = this.articleTemplate(doc);
    this.articleList.appendChild(articleElement);
  }, this);

  this.initFavorites();
};

App.prototype.initFavorites = function() {
  const favs = document.querySelectorAll('.favorite');

  for (var i = 0; i < favs.length; i++) {
    favs[i].addEventListener('click', this.toggleFavorite.bind(this));
  }
};

App.prototype.toggleFavorite = function(clickEvent) {
  const target = clickEvent.target,
        docId = target.getAttribute('data-doc-id'),
        doc = this.docs[docId];

  doc.object.favorite = doc.object.favorite === '★' ? '☆' : '★';
  target.innerHTML = doc.object.favorite;

  fetch(this.dbUrl + '/' + encodeURIComponent(doc._id), {
    method: 'PUT',
    body: JSON.stringify(doc),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function(response) {
    return response.json();
  }).then(function(response) {
    if (response.ok) {
      doc._rev = response.rev;
    }
  });
};

window.app = new App('http://localhost:5984/feeds');
