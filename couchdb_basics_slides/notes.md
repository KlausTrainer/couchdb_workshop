CouchDB and Kanso - notes
=========================

## CouchDB

### Agenda

>  What is CouchDB?
>  Installing CouchDB</li>
>  Querying CouchDB with http
>  Futon
>  Retrieving data with Map/Reduce
>  Presenting data with show and list functions
>  URL-rewriting and virtual hosts

### mongoDB

>  mongod run --config /usr/local/etc/mongod.conf
>  mongo
>  show dbs
>  use jug
>  db.jug.save({'date': '2012-05-10', 'attendees': 'awesome Java hackers'})
>  db.jug.find()
>  exit

### neo4j

>  neo4j start
>  in browser: http://localhost:7474/webadmin/
>  with curl: curl -v http://localhost:7474/db/data/
>  neo4j stop

### redis

>  redis-server /usr/local/etc/redis.conf
>  redis-cli
>  SET server:name "jug"
>  GET server:name
>  help 'tab'

-> http://try.redis-db.com/