Spritualisms web application.

> Spiritualisms provides a list of curated quotes for daily inspiration; illumination for your path.

---

- [Design](#design)
- [Tools](#tools)
- [Services](#services)
- [Software](#software)
- [Developer](#developer)
  - [Setup](#setup)
  - [Hosts](#hosts)
  - [Database Bootstrap](#database-bootstrap)
  - [Start](#start)
  - [Scripts](#scripts)
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
* [elastic][] for indexing and search
* [nginx][] for static file serving

## Services

Decoupled micro-services architecture:

* [api.*](api.spiritualisms.org) - JSON REST API
* [file.*](file.spiritualisms.org) - Dynamic file service
* [www.*](www.spiritualisms.org) - Web server

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

### Setup

To get setup you should have installed all the prerequisite software, particularly [docker][] be able to run `docker` commands as the current user.

Create the folder structure for the mounted docker volumes:

```
mkdir -p /opt/couchdb /opt/redis
chown $USER:docker /opt/couchdb /opt/redis
```

You should also have created the `spritualisms.rc` file in your home directory containing authentication information and ensured that it is sourced when you log in to your shell (`~/.zshrc` or `~/.bashrc`):

```
[ -f ~/.spiritualisms.rc ] && source ~/.spiritualisms.rc
```

See the [.spiritualisms.rc.example](https://github.com/tmpfs/spiritualisms/blob/master/conf/.spiritualisms.rc.example) file.

### Hosts

Then add the [host](https://github.com/tmpfs/spiritualisms/blob/master/conf/hosts) to `/etc/hosts` so that the domains are mapped locally, remember to comment these out if you are testing against a live environment. If you are running a local DNS server you may need to restart it after changing the hosts file, for example:

```
sudo /etc/init.d/dnsmasq restart
nslookup db.spiritualisms.org
```

### Database Bootstrap

To bootstrap the database with the required initial user and default documents you must have [rlx][] installed and run:

```
./sbin/bootstrap :lh
```

You can reverse this at any time with:

```
./sbin/teardown :lh
```

If you are modifying database views or adding documents you may want to do:

```
./sbin/teardown :lh && ./sbin/bootstrap :lh
```

To bootstrap to a remote database you configure a different alias in [rlx][], typically `:spiritualisms` will point to the live database URL (`http://db.spiritualisms.org:5984`) and then you can bootstrap using that alias:

```
./sbin/bootstrap :spiritualisms
```

### Start

#### Test

To run the test suite start [couchdb][] and [redis][] and then run:

```
npm test
```

You can generate code coverage with:

```
npm run cover
```

Note that for the `test` environment different ports are used so you can have the `devel` environment running and execute the tests at the same time.

#### Development

To start in the development environment you should run [couchdb][] and [redis][] using [docker-compose][]:

```
docker-compose up couchdb
```

And in a different shell:

```
docker-compose up redis
```

Then you can start the services running in the `devel` environment with [browser-sync][] enabled:

```
./sbin/sync
```

And view the application at [localhost:3000](http://localhost:3000).

#### Stage

To start everything running in the stage environment you build the images to ensure they are up to date:

```
docker-compose build
docker-compose create
```

Then start all the services:

```
docker-compose up
```

And view the application at [www.spiritualisms.org](http://www.spiritualisms.org).

### Scripts

#### CSS

To compile the CSS files run:

```
npm run css
```

#### Standalone CSS

To compile the standalone CSS file run:

```
npm run standalone
```

This is the CSS injected into standalone downloads of quotes when appending a `.html` file extension.

#### Compile

To compile the client-side javascript run:

```
npm run compile
```

#### Minify

To compile and minify the client-side javascript run:

```
npm run minify
```

#### Lint

Run the source tree through [jshint][] and [jscs][]:

```
npm run lint
```

#### Clean

Remove generated files:

```
npm run clean
```

#### Readme

To build the readme file from the partial definitions (requires [mkdoc][]):

```
npm run readme
```

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on December 29, 2016

[node]: https://nodejs.org
[docker]: http://www.docker.com
[nginx]: http://nginx.org
[elastic]: https://www.elastic.co/
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

