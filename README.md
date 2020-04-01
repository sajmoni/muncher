<h1 align="center" style="background-color: purple; color:green; padding: 10px 0 15px 0">
  Muncher
</h1>
<h4 align="center">
  CLI tool to generate sprite sheets for games
</h4>
<div align="center">
  <img src="https://badgen.net/npm/v/muncher?icon=npm" />
  <!-- <img src="https://badgen.net/npm/dw/muncher?icon=npm" /> -->
  <img src="https://badgen.net/github/last-commit/sajmoni/muncher?icon=github" />
</div>

---

## :sparkles: Features

- Reads `.piskel` and `.png` files and turns them into sprite sheets using [Texture Packer](https://www.codeandweb.com/texturepacker)

- Can add a horizontally flipped copy to the output

---

## How to use

Example usage with `npx`:

```shell
npx muncher --input sprites/ --output output/spritesheet
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
"munch": "muncher --input sprites/ --output output/spritesheet"
```

---

## CLI flags

`input` - The source folder. Contains `.png` and `.piskel` files that you want to turn into a sprite sheet.

`output` - The output filename. A `.json` and a `.png` sprite sheet file will be created.

`flip` - Every file name that ends with either `left` or `right` will also generate a horizontally flipped copy. (Optional)

`config` - Path to config file. (Optional)

### Texture packer options

All options that you can pass to the `texturepacker` CLI you can also pass to `muncher`. For example:

```shell
muncher --input sprites --output output/spritesheet --extrude 5 --multipack
```

[Available options](https://www.codeandweb.com/texturepacker/documentation/texture-settings)

### Config file

Instead of passing options as flags on the command line, you can specify them in a config file:

```shell
npx muncher --config muncher.json
```

The format has to be `.json`

`muncher.json`

```json
{
  "input": "sprites",
  "output": "output/spritesheet",
  "flip": true,
  "extrude": 5
}
```

---

## Example output

**png**

`example.png` => `example.png`

With `flip` enabled:

`player/walk-right.png` => `player/walk-right.png` and `player/walk-left.png`

**piskel**

Since `piskel` files can contain multiple images (frames), the texture name will include the frame index as a suffix:

`example.piskel` => `example-1.png`

With `flip` enabled:

`example-right.piskel` => `example-right-1.png` and `example-left-1.png`

### Example

**input folder structure**

```
sprites/
├── multiple-layers.piskel
├── green/
│   └── green.png
├── muncher/
│   ├── piskel/
│   │   └── muncher-right.piskel
│   └── png/
│       └── muncher-right.png
└── square/
    ├── square1.png
    └── square2.png
```

```shell
muncher --input sprites/ --output output/spritesheet --flip
```

**output texture names**

```
multiple.layers.png
green/green.png
muncher/piskel/muncher-right-0.png
muncher/piskel/muncher-left-0.png
muncher/png/muncher-right.png
muncher/png/muncher-left.png
square/square1.png
square/square2.png
```

---

## Requirements

### **Texture Packer CLI**

- Download [Texture Packer](https://www.codeandweb.com/texturepacker).

- Install the command line tool from the application UI.

---

### **imagemagick**

#### MacOS

You can install `imagemagick` with homebrew:

`brew install imagemagick`

#### Linux

https://medium.com/@sanjaywrites/install-latest-version-of-imagemagick-in-ubuntu-16-04-c406ddea1973

---

### **Node.js**

[nodejs.org](https://nodejs.org/) - Version 11 or higher

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
