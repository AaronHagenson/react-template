/* eslint-disable no-var */
const rimraf = require('rimraf');
const chalk = require('chalk');
const replace = require("replace");
const prompt = require("prompt");
const prompts = require('./setupPrompts');

const chalkSuccess = chalk.green;
const chalkProcessing = chalk.blue;
const chalkWarn = chalk.red;

/* eslint-disable no-console */

console.log(chalkSuccess('Dependencies installed.'));

prompt.start();

console.log(chalkWarn("WARNING:  Preparing to delete local git repository..."));
prompt.get([{
  name: 'deleteGit',
  description: "Delete the git repository?  YES to continue or NO to skip."
}], function (err, result) {
  let deleteGit;

  if (err) {
    process.exit(1);
  }

  deleteGit = result.deleteGit.toUpperCase();
  if (deleteGit === 'Y' || deleteGit === "YES") {
    // remove the original git repository
    rimraf('.git', error => {
      if (error) throw new Error(error);
      console.log(chalkSuccess('Original Git repository removed.\n'));

      console.log(chalkProcessing('Updating package.json settings:'));

      prompt.get(prompts, function (err, result) {
        // parse user responses
        // default values provided for fields that will cause npm to complain if left empty
        const responses = [
          {
            key: 'name',
            value: result.projectName || 'new-project'
          },
          {
            key: 'version',
            value: result.version || '0.1.0'
          },
          {
            key: 'author',
            value: result.author
          },
          {
            key: 'license',
            value: result.license || 'C.H. Robinson'
          },
          {
            key: 'description',
            value: result.description
          },
          // simply use an empty URL here to clear the existing repo URL
          {
            key: 'url',
            value: ''
          }
        ];

        // update package.json with the user's values
        responses.forEach(res => {
          replace({
            regex: `("${res.key}"): "(.*?)"`,
            replacement: `$1: "${res.value}"`,
            paths: ['package.json'],
            recursive: false,
            silent: true
          });
        });

        replace({
          regex: 'react-slingshot',
          replacement: result.projectName,
          paths: ['src/index.ejs', 'tests/store/configureStore.spec.js'],
          recursive: false,
          silent: true
        });

        // remove all setup scripts from the 'tools' folder
        console.log(chalkSuccess('\nSetup complete! Cleaning up...\n'));
        rimraf('./tools/setup', error => {
          if (error) throw new Error(error);
        });
      });
    });
  }
});
