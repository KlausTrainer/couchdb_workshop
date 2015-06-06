'use strict';

const App = function(dbUrl) {
  this.dbUrl = dbUrl;
  this.recentArticlesUrl = dbUrl + '/_design/feeds/_view/recent_articles';
  this.startkey = '"3012-12-12T23%3A59%3A59.999Z"';

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
};

window.app = new App('http://localhost:5984/feeds');
