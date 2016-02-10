## Design

* Clean and elegant interface
* Fast page load
* Modern browsers (IE10+)
* Dynamic and static file formats
* ECMAScript 5 - no transpiling
* Valid HTML5/CSS3
* Dynamic sitemap
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
* [nginx][] for static file serving

## Services

Decoupled microservices architecture:

* api.* - JSON REST API with [swagger][] v2.0 support
* www.* - Web server
* files.* - Static file service
