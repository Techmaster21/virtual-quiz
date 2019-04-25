# VirtualQuiz

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.6.
This project is intended to be run on a Heroku server.

## Development server

Run `npm start` for a dev server. Then run the backend in a separate tab using `npm run server`. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files, including on the backend.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

##Questions and answers
####Why don't you remove the database?
A database is really overkill for the amount of data that the program has to store. It would probably be better to remove the dependency on a database and just use files to store results
and the questions. The reason why this is not possible is because Heroku's file system is ephemeral - meaning that on every restart of the app, the file system is reset to the state it was at
when the last successful deploy took place. Meaning all our files will be deleted. Thus, we need somewhere to store our persistent data and a database is as good as anything.
####Why is the npm server script so weird?
npm run server is really weird because it uses npm-run-all to synchronously build, then run a script which uses npm-run-all to launch two scripts in parallel which both watch the ts files
and recompile when they are changed and watch the js files and re-run them when they are changed. This is necessary because for some reason if there is no dist/server folder and nothing in it
nodemon for some reason decides that the right command to use is the one from npm start - which is ng serve. However that is not the correct command to use in this instance.
