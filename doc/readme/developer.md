## Developer

To get started clone the repository and install dependencies, start [couchdb][], [redis][] and a browser sync session:

```
npm i
couchdb
redis-server
npm run sync
```

### Sync

To start the services and sync with the browser:

```
npm run sync
```

### Server

To start the node web server:

```
npm start
```

### API

To start the node api server:

```
npm run api
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

Beforehand ensure the database is created (see [bootstrap](#bootstrap)) and [couchdb][] is running.

Run the test specifications:

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

To build the readme file from the partial definitions:

```
npm run readme
```
