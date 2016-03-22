var gulp = require('gulp'), //基础库
    concat = require('gulp-concat'), //合并文件
    connect = require('gulp-connect'),
    less = require('gulp-less'), //less解析
    minifycss = require('gulp-minify-css'), //css压缩
    jshint = require('gulp-jshint'), //js检查
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    uglify = require('gulp-uglify'), //js压缩
    rename = require('gulp-rename'), //重命名
    clean = require('gulp-clean'), //清空文件夹
    open = require('gulp-open'),
    del = require('del'),
    mkdirp = require('mkdirp'),
    livereload = require('gulp-livereload'), //livereload
    paths = {
        root: './',
        dist: {
            root: 'dist/',
            styles: 'dist/css/',
            scripts: 'dist/js/',
            fonts: 'dist/fonts/'
        },
        source: {
            root: 'src/',
            styles: 'src/less/',
            scripts: 'src/js/',
            fonts: 'src/fonts/'
        },
        assets: {
            root: 'assets/',
            styles: 'assets/less/',
            scripts: 'assets/libs/',
            fonts: 'assets/fonts/'
        },
        examples: {
            root: 'examples/',
            index: 'examples/index.html'
        }
    },
    d6 = {
        filename: 'd6',
        jsFiles: [
            'src/js/core.js',
            'src/js/iscroll.js',
            'src/js/zepto.extend.js',
            'src/js/$extend.js',
            'src/js/widgets/slider/slider.js',
            'src/js/widgets/slider/touch.js',
            'src/js/widgets/slider/guide.js',
            'src/js/widgets/slider/multiview.js',
            'src/js/widgets/slider/gestures.js',
            'src/js/widgets/accordion.js',
            'src/js/widgets/accordionList.js',
            'src/js/widgets/fullpage.js',
            'src/js/widgets/input.js',
            'src/js/widgets/lazyloadimage.js',
            'src/js/widgets/navigator.js',
            'src/js/widgets/photobrowser.js',
            'src/js/widgets/refresh.js',
            'src/js/widgets/searchbar.js',
            'src/js/widgets/swipelist.js',
            'src/js/widgets/switch.js',
            'src/js/widgets/tabs.js'

        ]
    },
    zepto = {
        filename: 'zepto',
        jsFiles: [
            'assets/zepto/zepto.js',
            'assets/zepto/plugins/event.js',
            'assets/zepto/plugins/ajax.js',
            'assets/zepto/plugins/fx.js',
            'assets/zepto/plugins/fx_methods.js',
            'assets/zepto/plugins/data.js',
            'assets/zepto/plugins/detect.js',
            'assets/zepto/plugins/touch.js'
        ]
    },
    banner = {
        header: [
            '/**',
            ' * Released on: <%= date.year %>-<%= date.month %>-<%= date.day %>',
            ' * =====================================================',
            ' * <%= name %> v1.0.1 (http://docs.369cloud.com/engine/jssdk/JS-SDK)',
            ' * =====================================================',
            ' */',
            ''
        ].join('\n'),
        footer: [
            '/**',
            ' * Released on: <%= date.year %>-<%= date.month %>-<%= date.day %>',
            ' */',
            ''
        ].join('\n')
    },
    date = {
        year: new Date().getFullYear(),
        month: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' ')[new Date().getMonth()],
        day: new Date().getDate()
    };


// 清空dist样式
gulp.task('cleanDist', function(cb) {
    return del([paths.dist.root]);
});

// dist样式处理
gulp.task('dist-css', function(cb) {
    gulp.src('src/less/d6.less')
        .pipe(less())
        .pipe(gulp.dest(paths.dist.styles))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss({
            advanced: false,
            aggressiveMerging: false,
        }))
        .pipe(header(banner.header, {
            date: date,
            name: 'D6'
        }))
        .pipe(gulp.dest(paths.dist.styles))
        .pipe(livereload())
        .on('end', function() {
            cb();
        });
});

//dist字体
gulp.task('dist-font', function(cb) {
    gulp.src(paths.source.fonts + '*.*')
        .pipe(gulp.dest(paths.dist.fonts))
        .on('finish', function() {
            cb();
        });
});

// dist样式处理
gulp.task('dist-button', function(cb) {
    gulp.src('assets/less/button.less')
        .pipe(less())
        .pipe(gulp.dest(paths.dist.styles))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss({
            advanced: false,
            aggressiveMerging: false,
        }))
        .pipe(gulp.dest(paths.dist.styles))
        .pipe(livereload())
        .on('end', function() {
            cb();
        });
});

// dist样式处理
gulp.task('dist-font-awesome', function(cb) {
    gulp.src('assets/less/font-awesome.less')
        .pipe(less())
        .pipe(gulp.dest(paths.dist.styles))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss({
            advanced: false,
            aggressiveMerging: false,
        }))
        .pipe(gulp.dest(paths.dist.styles))
        .pipe(livereload())
        .on('end', function() {
            cb();
        });
});

//dist字体
gulp.task('dist-font-ex', function(cb) {
    gulp.src('assets/fonts/*.*')
        .pipe(gulp.dest(paths.dist.fonts))
        .on('finish', function() {
            cb();
        });
});


// 样式处理
gulp.task('dist-styles', gulp.series('cleanDist', 'dist-css', 'dist-font', 'dist-button','dist-font-awesome','dist-font-ex'));

// js处理
gulp.task('dist-d6', function(cb) {
    gulp.src(d6.jsFiles) //要合并的文件
        .pipe(concat(d6.filename + ".js")) // 合并匹配到的js文件并命名为 "all.js"
        .pipe(gulp.dest(paths.dist.scripts))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(header(banner.header, {
            date: date,
            name: 'D6'
        }))
        .pipe(gulp.dest(paths.dist.scripts))
        .pipe(livereload())
        .on('end', function() {
            cb();
        });
});

// dom处理
gulp.task('dist-zepto', function(cb) {
    gulp.src(zepto.jsFiles) //要合并的文件
        .pipe(concat(zepto.filename + ".js")) // 合并匹配到的js文件并命名为 "all.js"
        .pipe(gulp.dest(paths.dist.scripts))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.scripts))
        .pipe(livereload())
        .on('end', function() {
            cb();
        });
});



gulp.task('dist-js', gulp.series('dist-d6', 'dist-zepto'));

gulp.task('build-dist', gulp.series('dist-styles', 'dist-js'));


/* =================================
    Watch
================================= */

gulp.task('watch', function(cb) {
    var server = livereload();
    livereload.listen();
    gulp.watch(paths.source.styles + '*.less', gulp.series('dist-css'));
    gulp.watch(paths.source.scripts + '**/*.*', gulp.series('dist-js'));
    cb();
});



gulp.task('connect', function(cb) {
    connect.server({
        root: [paths.root],
        port: '3003'
    });
    cb();
});

gulp.task('open', function(cb) {
    gulp.src(paths.examples.index).pipe(open('', {
        url: 'http://localhost:3003/' + paths.examples.index
    }));
    cb();
});

gulp.task('default', gulp.series('build-dist', 'connect', 'open', 'watch'));