# React Redux Template

A UI template utilizing the following technologies:
* React
* Redux
* Redux Sagas
* Font Awesome
* Toastr
* Jest
* Nightwatch
* Sinon

# Get Started

1. Download and extract this template to a new folder on your local machine (do not use a folder that has already been added to GitHub).
2. From a command line in the new directory, run the following command and follow the prompts: `npm run setup`. The setup script will call `npm install` for you, and allow you to rename the project. A simple demo app will be available with a sample of the React/Redux flow.
3. Add the project to GitHub as a new repository.

## Deployment

### MTAR [XXXXX](http://mtar/MTARForm.aspx?MTARID=XXXXX)

### Docker

#### Build

```
docker build -t team/name .
```

#### Run (development)

```
docker run -p 3000:3000 \
-e PORT=3000 \
-e NODE_ENV="development" \
-e SERVE_DIR_NAME="dist" \
-e oAuthApiEndpoint="https://test-sso.chrobinson.com" \
-e oAuthDomain="test-sso.chrobinson.com" \
-e oAuthConnection="chradfs" \
-e oAuthAudience="audience" \
-d --name {name} --restart=always {team}/{name}
```

#### Run (integration)

```
docker run -p 3000:3000 \
-e PORT=3000 \
-e NODE_ENV="integration" \
-e SERVE_DIR_NAME="dist" \
-e oAuthApiEndpoint="https://test-sso-int.chrobinson.com" \
-e oAuthDomain="test-sso-int.chrobinson.com" \
-e oAuthConnection="chradfs" \
-e oAuthAudience="audience" \
-d --name {name} --restart=always {team}/{name}
```

#### Run (training)

```
docker run -p 3000:3000 \
-e PORT=3000 \
-e NODE_ENV="training" \
-e SERVE_DIR_NAME="dist" \
-e oAuthApiEndpoint="https://app-training-auth.chrobinson.com" \
-e oAuthDomain="app-training-auth.chrobinson.com" \
-e oAuthConnection="chradfs" \
-e oAuthAudience="audience" \
-d --name {name} --restart=always {team}/{name}
```

#### Run (production)

```
docker run -p 3000:3000 \
-e PORT=3000 \
-e NODE_ENV="production" \
-e SERVE_DIR_NAME="dist" \
-e oAuthApiEndpoint="https://app-auth.chrobinson.com" \
-e oAuthDomain="app-auth.chrobinson.com" \
-e oAuthConnection="chradfs" \
-e oAuthAudience="audience" \
-d --name {name} --restart=always {team}/{name}
```

### Deployment Locations

| Environment | URI |
| ----------- | --- |
| Development | {dev deployment location} |
| Integration | {int deployment location} |
| Training | {trn deployment location} |
| Production | {prod deployment location} |

## Helpful NPM Script Commands
- **Run the example app** `npm start -s`
This will run the automated build process, start up a webserver, and open the application in your default browser. Note: The -s flag is optional. It enables silent mode which suppresses unnecessary messages during the build.
- **Run the example app with watchers** `npm run start:watch`
This will run the automated build process, start up a webserver, and open the application in your default browser. When doing development with this kit, this command will continue watching all your files. Every time you hit save the code is rebuilt, linting runs, and tests run automatically.
- **Run the tests and generate code coverage** `npm run test`
This will run the unit tests and display the pass/fail test output in the console. It will also generate an .lcov file.
- **Run e2e tests** `npm start` `npm run e2e`
These two commands, in order, will start the webserver and open the app, and then run the end to end tests against the running app.
- **Having issues?** See "Having Issues?" below.

## Initial Machine Setup
1. **Install [Node 6.0.0 or greater](https://nodejs.org)**.
2. **Install [Git](https://git-scm.com/downloads)**.
4. **[Disable safe write in your editor](http://webpack.github.io/docs/webpack-dev-server.html#working-with-editors-ides-supporting-safe-write)** to assure hot reloading works properly.
5. On a Mac? You're all set. If you're on Linux or Windows, complete the steps for your OS below.  
 
**On Linux:**  

 * Run this to [increase the limit](http://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc) on the number of files Linux will watch. [Here's why](https://github.com/coryhouse/react-slingshot/issues/6).    
`echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p` 

**On Windows:** 
 
* **Install [Python 2.7](https://www.python.org/downloads/)**. Some node modules may rely on node-gyp, which requires Python on Windows.
* **Install C++ Compiler**. Browser-sync requires a C++ compiler on Windows. [Visual Studio Express](https://www.visualstudio.com/en-US/products/visual-studio-express-vs) comes bundled with a free C++ compiler. Or, if you already have Visual Studio installed: Open Visual Studio and go to File -> New -> Project -> Visual C++ -> Install Visual C++ Tools for Windows Desktop. The C++ compiler is used to compile browser-sync (and perhaps other Node modules).

## Having Issues? Try these things first.
1. Make sure you ran all steps in [Get started](https://github.com/coryhouse/react-slingshot/blob/master/README.md#get-started) including the [initial machine setup](https://github.com/coryhouse/react-slingshot#initial-machine-setup).
2. Run `npm install` - If you forget to do this, you'll see this: `babel-node: command not found`.
3. Make sure files with names that begin with a dot (.babelrc, .editorconfig, .eslintrc) are copied to the project directory root. This is easy to overlook if you copy this repository manually.
4. Don't run the project from a symbolic link. It may cause issues with file watches.
5. Delete any .eslintrc that you're storing in your user directory. Also, disable any ESLint plugin / custom rules that you've enabled within your editor. These will conflict with the ESLint rules defined in this project.

## Questions?
Check out the [FAQ](/docs/FAQ.md)
