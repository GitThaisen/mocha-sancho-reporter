# mocha-sancho-reporter

A reporter for mocha that creates an HTML report with system output included.

## Installation

```sh
npm install --save-dev mocha-sancho-reporter
```

## Usage

```sh
mocha --reporter mocha-sancho-reporter --reporter-options reportPath=./test-report.html,suppressOutput=true
```

## Options

### `reportPath` (default = ./test-report.html)

The path to where the HTML report should be written. 

### `suppressOutput` (default = true)

If true, suppresses console.log statements from the console. 
