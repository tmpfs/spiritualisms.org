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

* [couchdb][] for document storage
* [redis][] for fast in-memory access
* [elastic][] for indexing and search
* [nginx][] for static file serving

## Services

Decoupled micro-services architecture:

* [api.*](api.spiritualisms.org) - JSON REST API 
* [file.*](file.spiritualisms.org) - Dynamic file service
* [www.*](www.spiritualisms.org) - Web server

