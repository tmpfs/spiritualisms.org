## Developer

Before running the application you should install [docker][] and [docker-compose][] and build the images with:

```
docker-compose build
docker-compose create
```

And add the [host](/conf/hosts) to `/etc/hosts` so that the domain are mapped locally.

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
