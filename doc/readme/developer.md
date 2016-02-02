## Developer

Clone the repository and install dependencies with `npm i`, [couchdb][] should be running locally.

### Server

To start the node web server:

```
npm start
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
