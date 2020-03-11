<h1 align="center" style="background-color: purple; color:green; padding: 10px 0 15px 0">
  Muncher
</h1>
<h4 align="center">
  Generate sprite sheets from the command line
</h4>
<div align="center">
  <img src="https://badgen.net/npm/v/muncher?icon=npm" />
  <img src="https://badgen.net/npm/dw/muncher?icon=npm" />
  <img src="https://badgen.net/github/last-commit/sajmoni/muncher?icon=github" />
</div>

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

### **Texture Packer CLI**

 - Download [Texture Packer](https://www.codeandweb.com/texturepacker).

 - Install the command line tool from the application UI.

_Muncher will use the options that you have specified in the Texture Packer UI._

---

### **imagemagick**

#### MacOS

You can install `imagemagick` with homebrew:

`brew install imagemagick`

#### Linux

https://medium.com/@sanjaywrites/install-latest-version-of-imagemagick-in-ubuntu-16-04-c406ddea1973

---

### **Node.js**

[nodejs.org](https://nodejs.org/)

---

## How to use

Example usage with `npx`:

```shell
npx muncher --input example/sprites/ --output example/output/spritesheet
```

---

If your project includes a `package.json`, then the preferred way is to include `muncher` as a dev dependency:

```shell
npm i --save-dev muncher
``` 
or 
```shell
yarn add --dev muncher
```

You can then add a script to your package.json `scripts` section:

```json
"munch": "muncher --input example/sprites/ --output example/output/spritesheet"
```

---

## CLI flags

`input` - The source folder. Contains `.png` and `.piskel` files that you want to turn into a sprite sheet.

`output` - The output filename. A `.json` and a `.png` sprite sheet file will be created.

`flip` - Every file name that ends with either `left` or `right` will also generate a horizontally flipped copy. (Optional)

<!-- `verbose` - Print more detailed output (Optional) -->

---

## Inputs

**png**

`example.png` - The name of the texture will be `example.png` 

**piskel**

`example.piskel` - Since `piskel` files can contain multiple images (frames), the texture names will get a numbered suffix: `example-0.png`

---

## Recipes

### Multiple output sprite sheets

Try to only use one output spritesheet for as long as possible. This is better for performance reasons. If your spritesheet becomes too big, try to separate it by layer in your game. For example, 'background' and 'foreground'. In that case, you can add multiple muncher commands to a script and execute that one.

Example:

`./munch.sh`

```sh
muncher --input example/sprites/background/ --output example/output/background
muncher --input example/sprites/foreground/ --output example/output/foreground
```

---

## Develop

### Workflow

1. Make changes

2. `yarn build-test` - Builds, packs, installs to `example` folder and executes muncher there.

3. If everything works: push `master` or make a `PR`
