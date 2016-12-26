Spritualisms web application.

> Spiritualisms provides a list of curated quotes for daily inspiration; illumination for your path.

---

- [Design](#design)
- [Tools](#tools)
- [Services](#services)
- [Software](#software)
- [Developer](#developer)
  - [Sync](#sync)
  - [Server](#server)
  - [API Server](#api-server)
  - [File Server](#file-server)
  - [Teardown](#teardown)
  - [Bootstrap](#bootstrap)
  - [CSS](#css)
  - [Standalone CSS](#standalone-css)
  - [Compile](#compile)
  - [Minify](#minify)
  - [Test](#test)
  - [Cover](#cover)
  - [Lint](#lint)
  - [Clean](#clean)
  - [Readme](#readme)
- [License](#license)

---

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
* [postgres][] for indexing and search
* [nginx][] for static file serving

## Services

Decoupled micro-services architecture:

* api.* - JSON REST API with [swagger][] v2.0 support
* www.* - Web server
* files.* - Lazy static file service

## Software

Want to play along? You're going to need a POSIX system and this stuff:

* [docker][]
* [node][]
* [nginx][]
* [redis][]
* [postgres][]
* [couchdb][]
* [wkhtmltopdf][]
* [java][]
* [validator][]
* [mkdoc][]
* [rlx][]
* [linkdown][]
* [jshint][]
* [jscs][]

## Developer

Before running the application you should install [docker][] and [docker-compose][] and build the images with:

```
docker-compose build
docker-compose create
```

And add the [host](https://github.com/tmpfs/spiritualisms/blob/master/conf/hosts) to `/etc/hosts` so that the domain are mapped locally.

To get started clone the repository and install dependencies, start [couchdb][], [redis][] and a browser sync session:

```
npm i
docker-compose up redis couchdb nginx
npm run sync
```

### Sync

To start the services and sync with the browser:

```
npm run sync
```

### Server

To start the web server:

```
npm run www
```

### API Server

To start the api server:

```
npm run api
```

### File Server

To start the file server:

```
npm run file
```

### Teardown

Remove the database:

```
npm run teardown
```

### Bootstrap

Create the database and bootstrap the application:

```
npm run teardown; npm run bootstrap
```

### CSS

To compile the CSS files run:

```
npm run css
```

### Standalone CSS

To compile the standalone CSS file run:

```
npm run standalone
```

This is the CSS injected into standalone downloads of quotes when appending a `.html` file extension.

### Compile

To compile the client-side javascript run:

```
npm run compile
```

### Minify

To compile and minify the client-side javascript run:

```
npm run minify
```

### Test

Beforehand ensure the database is created (see [bootstrap](#bootstrap)). Both [couchdb][] and [redis][] must be running. Then run the test specifications:

```
npm test
```

### Cover

To generate code coverage run:

```
npm run cover
```

### Lint

Run the source tree through [jshint][] and [jscs][]:

```
npm run lint
```

### Clean

Remove generated files:

```
npm run clean
```

### Readme

To build the readme file from the partial definitions (requires [mkdoc][]):

```
npm run readme
```

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on December 26, 2016

[node]: https://nodejs.org
[docker]: http://www.docker.com
[nginx]: http://nginx.org
[postgres]: http://www.postgresql.org
[couchdb]: http://couchdb.apache.org
[redis]: http://redis.io
[wkhtmltopdf]: http://wkhtmltopdf.org/
[java]: https://www.java.com/
[validator]: https://github.com/validator/validator
[jshint]: http://jshint.com
[jscs]: http://jscs.info
[docker-compose]: https://docs.docker.com/compose/
[mkdoc]: https://github.com/mkdoc/mkdoc
[rlx]: https://github.com/tmpfs/rlx
[linkdown]: https://github.com/tmpfs/linkdown

