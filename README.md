
# SVG Sprite Plugin for webpack:

It is difficult to imagine, but it works. Almost the same as [transfer-webpack-plugin](https://www.npmjs.com/package/transfer-webpack-plugin)

#### What i want?
Collection of svg`s in __/app/source/sprite/**__, and they are all must be compiled as one svg sprite file, and moved to public directory, or somewhere else, for ex. include inline to __.pug__ file.

File structure (example, you can customize):
```
yourApp/
  public/
    index.html *
    sprite.svg   -> compiled file

  source/
    js/
      ***

    sprite/
      heart.svg
      plus.svg
      some.svg
      even/
        folders/
          it-works.svg    -> xlink:href="#svg-it-works"
```


## Install:

```
npm i svgsprite-plugin -D
```

Setup:

```javascript
let SvgSpritePlugin = require('svgsprite-plugin');
let path = require('path');


module.exports = {
  context: path.resolve(root, 'source'),

  entry: {
    main: 'js/main.js'
  },

  output: {
    path: path.resolve(root, 'public'),
    publicPath: '/',
    filename: 'assets/js/[name].js',
    chunkFilename: 'assets/js/[name].[id].js'
  },

  plugins: [
    new SvgSpritePlugin({
      // config, not necessary
    })
  ]
};
```


## Config defaults:

```javascript
{
  // mean /yourApp/source/sprite  ->  exports.context as root
  source: 'sprite',

  // mean /yourApp/public/%HERE%  ->  exports.output.path as root
  dest: './',

  // svg-{icon-name}
  // <use xlink:href="sprite.svg#svg-box"></use>
  prefix: 'svg-'
}
```

Will compile:

`/yourApp/source/sprite/**/*.svg` > `/yourApp/public/sprite.svg`


## Nice to know:
```javascript
new SvgSpritePlugin({
  dest: '../source/'
});
```

Will compile sprite to your __source__ directory, and you can include it inline =)


### Warning. You should optimize your svgs by yourself
