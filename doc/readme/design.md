## Design

* Clean and elegant interface
* Modern browsers (IE10+)
* Dynamic and static file formats
* ECMAScript 5 - no transpiling
* Valid HTML5/CSS3
* No adverts
* No signup/login
* No cookies
* No third-party code (analytics etc)
* No assets from other domains (google fonts etc)

## Database

Right tool for the job:

* [couchdb][] for document storage
* [redis][] for fast in-memory access
* [postgres][] for indexing and search

## Services

Decoupled microservices architecture:

* api.* - JSON REST API
* www.* - Web server
* files.* - Static file service
