var gulp = require('gulp');
var plugins = {
    livereload: require('gulp-livereload'),
    sass: require('gulp-sass'),
    autoprefixer: require('gulp-autoprefixer'),
};
var paths = {
    scss: './src/scss/**/*.s[ac]ss'
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

gulp.task('js-src', function() {
  return gulp.src('./src/js/*.js')
    .pipe(gulp.dest('js'));
});

gulp.task('js-libs', function() {
  return gulp.src([
    'node_modules/foundation-sites/js/foundation/foundation.js',
  ]).pipe(gulp.dest('js'));
});

gulp.task('default', ['js-src', 'js-libs', 'scss']);

gulp.task('server', function(done) {
  http = require('http');
  st = require('st');
  http.createServer(
    st({ path: __dirname, index: 'index.html', cache: false })
  ).listen(3000, done);
});


gulp.task('watch', ['server'], function() {
  plugins.livereload.listen();
  gulp.watch(paths.scss, ['scss']);
});
