# OpenTechSchool Dortmund - CouchDB

This repository is the home for the material used for the OpenTechSchool Dortmund CouchDB workshop on June 13th 2015.

Have fun!

Klaus, Sebastian, Andy

## Prerequisites

* Apache CouchDB 1.6.1
* A current version of NodeJS or io.js

## Getting Started

* Create an admin user (see http://docs.couchdb.org/en/1.6.1/intro/security.html#authentication).
* Enable CORS (see http://docs.couchdb.org/en/1.6.1/config/http.html#config-cors).
* Create a local database named `feeds`, and replicate the remote database `http://couchplanet.org:5984/feeds` to it.
* `cd feeds_app`
* `npm install`
* `npm install -g couch-push`
* `couch-push http://admin:secret@localhost:5984/feeds ./couch` (make sure to replace `admin` and `secret` with your admin user's name and password here)
* `npm run server`
