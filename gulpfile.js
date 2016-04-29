var gulp = require('gulp');
var plugins = {
    autoprefixer: require('gulp-autoprefixer'),
    inject: require('gulp-inject'),
    livereload: require('gulp-livereload'),
    sass: require('gulp-sass'),
    svgmin: require('gulp-svgmin'),
    svgstore: require('gulp-svgstore'),
};
var paths = {
    icons: './src/icons/*.svg',
    index: './src/html/index.html',
    scss: './src/scss/**/*.s[ac]ss',
}

gulp.task('scss', function() {
    return gulp.src(paths.scss)
    .pipe(plugins.sass({
        includePaths: [
            './node_modules/foundation-sites/scss'
        ]
    }))
    .pipe(plugins.autoprefixer({
        browsers: ['last 2 versions', '> 1%', 'IE 9', 'IE 10', 'IE 11']
    }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(plugins.livereload());
});

gulp.task('index', function () {
    var path = require('path');
    var svgs = gulp.src(paths.icons)
    .pipe(plugins.svgmin(function (file) {
        var prefix = path.basename(file.relative, path.extname(file.relative));
        return {
            plugins: [{
                cleanupIDs: {
                    prefix: prefix + '-',
                    minify: true
                }
            }]
        }
    }))
    .pipe(plugins.svgstore({ inlineSvg: true}))

    return gulp.src(paths.index)
    .pipe(plugins.inject(svgs, {
        transform: function (filePath, file) {return file.contents.toString('utf8')}
    }))
    .pipe(gulp.dest('dist'))
    .pipe(plugins.livereload());
});

gulp.task('default', ['scss', 'index']);

gulp.task('server', function(done) {
    var path = require('path');
    var http = require('http');
    var st = require('st');
    http.createServer(st({
        path: path.join(__dirname, 'dist'),
        index: 'index.html',
        cache: false
    })).listen(3000, done);
});

gulp.task('watch', ['server'], function() {
    plugins.livereload.listen();
    gulp.watch(paths.scss, ['scss']);
    gulp.watch(paths.icons, ['index']);
    gulp.watch(paths.index, ['index']);
});
