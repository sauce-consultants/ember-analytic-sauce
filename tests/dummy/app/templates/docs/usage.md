# Usage

This addon requires a [Sheetsu](https://sheetsu.com/) account at this point to allow data to be stored on your own spreadsheet.

## Installation

    ember install ember-analytic-sauce

## Config

Set the sheetsu spreadsheet id in `config/environment.js`.

    let ENV = {
      // ...
      analyticSauce: {
        sheet: '6498441a3194',
      }
    }

Ensure this spreadsheet has sheets named "**views**" & "**events**".
