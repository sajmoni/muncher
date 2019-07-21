# Extract texture packer

Reads your `.png` and `.piskel` files and automatically generates sprite sheets using Texture Packer.

You just specify the `input` and `output` folders and the tool takes care of the rest.

## Requirements

 - Texture Packer CLI.

 - imagemagick

## How to use

`node index.js example/sprites example/output`

It will use the options that you have specified in the Texture Packer UI.

## Potential improvements

 - Enable passing options on the command line

 - Default input and output folders
