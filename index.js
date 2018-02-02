
var path = require('path');
var glob = require('glob');
var fs = require('fs');
var SVGO = require('svgo-sync');
var mkdir = require('mkdir-p');


var outputFilename = 'sprite.svg';
var outputSpriteStart = '<svg style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs>';
var outputSpriteEnd = '</defs></svg>';


function SvgspritePlugin(opts) {
    this.opts = Object.assign({
        source: 'sprite',
        dest: './',
        prefix: 'icon-'
    }, (opts || {}));
}


SvgspritePlugin.prototype.apply = function(compiler) {
    let _this = this;

    /**
     * From
     * /web/source/sprite
     */
    this.opts.source = path.resolve(compiler.context, this.opts.source);

    /**
     * To, as array
     * [
     *   '/web/public/images',
     *   'web/public'
     ** ]
     */
    if (isArray(this.opts.dest)) {
        for (let i = 0, len = this.opts.dest.length; i < len; i++) {
            this.opts.dest[i] = path.resolve(compiler.context, this.opts.dest[i]);
        }
    }

    /**
     * To, as string
     * /web/public
     */
    else {
        this.opts.dest = path.resolve(compiler.context, this.opts.dest);
    }

    console.log(this.opts.source);
    console.log(this.opts.dest);

    compiler.plugin('emit', function(compilation, cb) {
        _this.processSprite();

        cb();
    });
}


SvgspritePlugin.prototype.processSprite = function(cb) {
    let opts = this.opts;
    let prefix = opts.prefix;
    let sourcePath = opts.source;
    let files = glob.sync('**/*.svg', { cwd: sourcePath });
    let sprites = [];

    let svgo = new SVGO({
        plugins: [
            { removeUselessDefs: true },
            { cleanupIDs: true },
            { removeDimensions: true }
        ]
    });

    files.forEach(function(fileName) {
        let parsed = path.parse(fileName);
        let fileContent = fs.readFileSync(path.join(sourcePath, fileName), 'utf8');
        let fileContentAsString = fileContent.toString();

        if (fileContentAsString) {
            let optimizedSvg = svgo.optimizeSync(fileContent.toString());
            sprites.push(optimizedSvg.data.replace(/<svg/, `<svg id="${prefix}${parsed.name}"`));
        }
    });

    if (isArray(opts.dest)) {
        opts.dest.forEach((p) => {
            mkdir.sync(p);
            fs.writeFileSync(path.join(p, outputFilename), outputSpriteStart + sprites.join(' ') + outputSpriteEnd);
        });
    }

    // plain string
    else {
        mkdir.sync(opts.dest);
        fs.writeFileSync(path.join(opts.dest, outputFilename), outputSpriteStart + sprites.join(' ') + outputSpriteEnd);
    }
}


function isArray(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
}


module.exports = SvgspritePlugin;
