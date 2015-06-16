# CouchDB Workshop

## Prerequisites

* Apache CouchDB 1.6.1
* A current version of NodeJS or io.js

## Installation Instructions

* Create an admin user (see http://docs.couchdb.org/en/1.6.1/intro/security.html#authentication).
* Enable CORS (see http://docs.couchdb.org/en/1.6.1/config/http.html#config-cors).
* Create a local database named `feeds`, and replicate the remote database `http://couchplanet.org:5984/feeds` to it.
* `cd feeds_app`
* `npm install`
* `npm install -g couch-push` (see https://www.npmjs.com/package/couch-push)
* `couch-push http://admin:secret@localhost:5984/feeds ./couch` (make sure to replace `admin` and `secret` with your admin user's name and password here)
* `npm run server`

## Exercises

The following exercises are supposed to be performed on the feeds app, which is located in the `feeds_app` directory. See the installation instructions above.

### Document Update Validation

Write a document *validate document update function* that prevents non-admins from deleting documents. Store the function in `couch/validate_doc_update.js`, and push it to your `feeds` database by using [`couch-push`](https://www.npmjs.com/package/couch-push) the same way you did when installing the app (see above).

See http://docs.couchdb.org/en/1.6.1/couchapp/ddocs.html#vdufun.

### Load More Articles

On the lower left corner of the page, there is a "Load more articles"-button, which has no functionality attached to it yet, however. When the button is clicked, load the next eight articles, sorted in descending by their `postedTime` timestamp key order, by using the `recent_articles` view that is already included.

See http://docs.couchdb.org/en/1.6.1/api/ddoc/views.html, and http://docs.couchdb.org/en/1.6.1/couchapp/views/pagination.html.

### Favorites

On the lower right corner of each article, there is a white star, which is supposed to be used as "Favorite"- or "Unfavorite"-button, respectively. It has no functionality attached to it yet, however. When an article has been marked as favorite, a black star should be displayed instead of a white one. It should be possible to revert a favorite, i.e., unmark a favorite article.

See http://docs.couchdb.org/en/1.6.1/api/document/common.html.
