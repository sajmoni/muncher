# Muncher

Reads your `.png` and `.piskel` files and automatically generates sprite sheets using [Texture Packer](https://www.codeandweb.com/texturepacker).

You just specify the `input` and `output` folders and the tool takes care of the rest.

## Requirements

 - Texture Packer CLI.

 - imagemagick

_MacOS install: `brew install imagemagick`_

## How to use

`npm i --save-dev muncher` or `yarn add --dev muncher`

`muncher --input example/sprites/ --output example/output/spritesheet`

_It will use the options that you have specified in the Texture Packer UI._

## CLI flags

`input` - The source folder. Contains `.png` and `.piskel` files that you want to turn into a sprite sheet.

`output` - The output filename. A `.json` and a `.png` sprite sheet file will be created.

`flip` - Every file name that contains either `left` or `right` will also generate a horizontally flipped copy.

## Potential improvements

 - Enable passing options on the command line

 - Default input and output folders
 
---

## Develop

### Test changes

1. Make changes

1. `yarn build`

2. `cd example`

3. `yarn refresh`

4. `yarn munch`
