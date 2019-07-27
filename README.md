# Muncher

Reads your `.png` and `.piskel` files and automatically generates sprite sheets using Texture Packer.

You just specify the `input` and `output` folders and the tool takes care of the rest.

## Requirements

 - Texture Packer CLI.

 - imagemagick

## Optional dependencies

 - Piskel

## How to use

`npm i --save-dev muncher` or `yarn add --dev muncher`

`muncher --input example/sprites --output example/output/spritesheet.png`

It will use the options that you have specified in the Texture Packer UI.

## Potential improvements

 - Enable passing options on the command line

 - Default input and output folders
 