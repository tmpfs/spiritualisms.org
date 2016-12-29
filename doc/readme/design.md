## Design

* Clean and elegant interface
* Fast page load
* Modern browsers (IE10+)
* Dynamic and static file formats
* ECMAScript 5 - no transpiling
* Valid HTML5/CSS3
* Dynamic sitemap
* Vector graphics all the way -- no bitmaps
* No adverts
* No signup/login
* No cookies
* No third-party code (analytics etc)
* No assets from other domains (google fonts etc)

## Tools

Right tool for the job:

* [couchdb][] for document storage.
* [elastic][] ELK stack for indexing and search.
* [redis][] for fast in-memory access.
* [nginx][] as a reverse proxy with SSL termination and static file serving.

## Services

Decoupled micro-services architecture:

* [api.*](http://api.spiritualisms.org) - JSON REST API 
* [file.*](http://file.spiritualisms.org) - Dynamic file service
* [www.*](http://www.spiritualisms.org) - Web server

