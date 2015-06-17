'use strict';

const App = function(dbUrl) {
  this.dbUrl = dbUrl;
  this.recentArticlesUrl = dbUrl + '/_design/feeds/_view/recent_articles';
  this.favoritesUrl = dbUrl + '/_design/feeds/_view/favorites';
  this.startkey = '"3012-12-12T23%3A59%3A59.999Z"';
  this.docs = {};

  this.articleList = document.querySelector('.articles');
  this.articleTemplate = Handlebars.compile(
    document.getElementById('article-template').innerHTML);

   this.fetchRecentArticles()
    .then(this.processArticles.bind(this))
    .then(function(articles) {
      const articleCount = articles.length;

      if (articleCount < 1) {
        return;
      }

      this.startkey = '"' + articles[0].key + '"';
      this.endkey = '"' + articles[articleCount - 1].key + '"';

      this.fetchFavorites(this.startkey, this.endkey)
        .then(this.processFavorites.bind(this));
    }.bind(this));
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

  return Promise.resolve(articles);
};

App.prototype.renderArticles = function(articles) {
  articles.forEach(function(article) {
    const articleElement = document.createElement('article'),
          doc = article.doc;

    articleElement.innerHTML = this.articleTemplate(doc);
    this.articleList.appendChild(articleElement);
  }, this);
};

App.prototype.fetchFavorites = function(startkey, endkey) {
  const url = this.favoritesUrl + '?descending=true&include_docs=true'
                + '&startkey=' + startkey
                + '&endkey=' + endkey;

  return new Promise(function(resolve, reject) {
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(result) {
      if (result.rows) {
        resolve(result.rows);
      } else {
        reject(result);
      }
    }).catch(function(err) {
      console.log(err);
    });
  });
};

App.prototype.processFavorites = function(favorites) {
  favorites.forEach(function(favorite) {
    this.docs[favorite.doc.articleId].favorite = favorite.doc;
  }, this);

  this.renderFavorites(favorites);

  return Promise.resolve(favorites);
};

App.prototype.renderFavorites = function(favorites) {
  favorites.forEach(function(favorite) {
    const favoriteElement = document
            .getElementById('favorite-' + favorite.doc.articleId);

    favoriteElement.innerHTML = '★';
  }, this);

  document.querySelector('.articles')
    .addEventListener('click', function(event) {
      if ((event.target.className) === 'favorite') {
        this.toggleFavorite(event.target);
      }
    }.bind(this));
};

App.prototype.toggleFavorite = function(favoriteElement) {
  const docId = favoriteElement.getAttribute('data-doc-id'),
        doc = this.docs[docId];

  if (doc.favorite) {
    favoriteElement.innerHTML = '☆';
    this.deleteFavorite(doc);
  } else {
    favoriteElement.innerHTML = '★';
    this.createFavorite(doc);
  }
};

App.prototype.createFavorite = function(doc) {
  const favorite = {
    articleDate: doc.postedTime,
    articleId: doc._id,
    type: 'favorite'
  };

  fetch(this.dbUrl, {
    method: 'POST',
    body: JSON.stringify(favorite),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function(response) {
    return response.json();
  }).then(function(response) {
    favorite._id = response.id
    favorite._rev = response.rev
    doc.favorite = favorite
  });
};

App.prototype.deleteFavorite = function(doc) {
  const favorite = doc.favorite;

  fetch(this.dbUrl + '/' + favorite._id + '?rev=' + favorite._rev, {
    method: 'DELETE'
  }).then(function(response) {
    return response.json();
  }).then(function(response) {
    delete doc.favorite
  });
};

window.app = new App('http://localhost:5984/feeds');
