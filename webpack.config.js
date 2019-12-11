const path = require('path');
const SpritesmithPlugin = require('webpack-spritesmith')
var ImageminPlugin = require('imagemin-webpack-plugin').default

// 需要生成几倍的图
const times = 2;
const templateFunction = function (data) {
    const shared = '.icon {display: inline-block; background-image: url(I); background-size: Wpx Hpx;}'
        .replace('I', data.sprites[0].image)
        .replace('W', data.sprites[0].total_width / times)
        .replace('H', data.sprites[0].total_height / times);

    var perSprite = data.sprites.map(function (sprite) {
        return '.icon-N { width: Wpx; height: Hpx; background-position: Xpx Ypx;}'
            .replace('N', sprite.name)
            .replace('W', sprite.width / times)
            .replace('H', sprite.height / times)
            .replace('X', sprite.offset_x / times)
            .replace('Y', sprite.offset_y / times);
    }).join('\n');

    return shared + '\n' + perSprite;
};

module.exports = {
    // JavaScript 执行入口文件
    entry: './main.js',
    output: {
        // 把所有依赖的模块合并输出到一个 bundle.js 文件
        filename: 'bundle.js',
        // 输出文件都放到 dist 目录下
        path: path.resolve(__dirname, './dist'),
    },
    mode: 'production',
    plugins: [
        new ImageminPlugin({
            disable: process.env.NODE_ENV !== 'production', // Disable during development
            pngquant: {
                quality: '95-100'
            }
        }),
        new SpritesmithPlugin({
            src: {
                cwd: path.resolve(__dirname, 'images'), // 图标根路径
                glob: '**/*.png' // 匹配任意 png 图标
            },
            target: {
                image: path.resolve(__dirname, 'css/sprites.png'), // 生成雪碧图目标路径与名称
                // 设置生成CSS背景及其定位的文件或方式
                css: [
                    [path.resolve(__dirname, 'css/sprites.css'), {
                        format: 'function_based_template'
                    }]
                ]
                // css: path.resolve(__dirname, '../src/assets/spritesmith-generated/sprite.less')
            },
            customTemplates: {
                'function_based_template': templateFunction,
            },
            apiOptions: {
                cssImageRef: "./sprites.png", // css文件中引用雪碧图的相对位置路径配置
            },
            // 核心组件配置
            spritesmithOptions: {
                padding: 5,
            }
        })
    ]
};
