<h1 align="center" style="background-color: purple; color:green; padding: 10px 0 15px 0">
  Muncher
</h1>
<h4 align="center">
  Generate sprite sheets from the command line
</h4>

---

Reads your `.png` and `.piskel` files and automatically generates sprite sheets using [Texture Packer](https://www.codeandweb.com/texturepacker).

You just specify the `input` and `output` folders and the tool takes care of the rest.

```
muncher --input example/sprites/ --output example/output/spritesheet
```

---

## Possible inputs

 - :rice_scene: `.png`

 - :movie_camera: `.piskel`

 - :file_folder: `folder`

---

## Requirements

### Texture Packer CLI

 - Download [Texture Packer](https://www.codeandweb.com/texturepacker).

 - Install the command line tool from the application UI.

_Muncher will use the options that you have specified in the Texture Packer UI._

### imagemagick

#### MacOS

You can install `imagemagick` with homebrew:

`brew install imagemagick`

#### Linux

https://medium.com/@sanjaywrites/install-latest-version-of-imagemagick-in-ubuntu-16-04-c406ddea1973

---

## How to use

Best way to use it is to add it as a dependency in your project:

`npm i --save-dev muncher` or `yarn add --dev muncher`

You can also install it globally:

`npm i -g muncher` or `yarn add --global muncher`

Example usage:

`muncher --input example/sprites/ --output example/output/spritesheet`

---

## CLI flags

`input` - The source folder. Contains `.png` and `.piskel` files that you want to turn into a sprite sheet.

`output` - The output filename. A `.json` and a `.png` sprite sheet file will be created.

`flip` - Every file name that ends with either `left` or `right` will also generate a horizontally flipped copy.

---

## Inputs

`example.png` - The name of the texture will be `example.png` 

`example.piskel` - Since `piskel` files can contain multiple images, the texture names will get a numbered suffix: `example-0.png`

---

## Recipes

### Multiple output sprite sheets

Try to only use one output spritesheet for as long as possible. This is better for performance reasons. If your spritesheet becomes too big, try to divide it by layer in your game. For example, 'background' and 'foreground'. You can add your multiple muncher commands to a script and execute that one.

For example:

`./munch.sh`

```sh
muncher --input example/sprites/background/ --output example/output/background
muncher --input example/sprites/foreground/ --output example/output/foreground
```

---

## Develop

### Test your changes

1. Make changes

2. `yarn build`

3. `cd example`

4. `yarn refresh`

5. `yarn munch`
