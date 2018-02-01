// As seen here: http://blog.pagepro.co/2016/11/22/creating-amp-boilerplate-with-sass/

var gulp = require('gulp')
var plumber = require('gulp-plumber')
var sass = require('gulp-sass')
var cssnano = require('gulp-cssnano')
var fs = require('fs')
var inject = require('gulp-inject-string')
var browser = require('browser-sync')
var reload = browser.reload
var deploy = require('gulp-gh-pages')

gulp.task('sass', function () {
  gulp.src('./src/sass/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./dist'))
})

gulp.task('html', function () {
  var cssContent = fs.readFileSync('./dist/main.css', 'utf8')
  gulp.src('./src/html/*.html')
    .pipe(inject.after('style amp-custom>', cssContent))
    .pipe(gulp.dest('./dist'))
    .pipe(reload({
      stream: true
    }))
})

gulp.task('serve', function () {
  browser({
    port: 4500,
    open: false,
    ghostMode: false,
    server: {
      baseDir: './dist'
    }
  })
})

gulp.task('assets', function () {
  gulp.src('./src/assets/*')
    .pipe(gulp.dest('./dist/assets'))
})

gulp.task('watch', function () {
  gulp.watch('./src/sass/**', ['sass'])
  gulp.watch('./dist/*.css', ['html'])
  gulp.watch('./src/html/*.html', ['html'])
  gulp.watch('./src/assets/**', ['assets'])
})

/**
 * Push build to gh-pages
 */
gulp.task('deploy', function () {
  return gulp.src('./dist/**/*')
    .pipe(deploy())
})

gulp.task('default', ['assets', 'sass', 'html', 'watch', 'serve'])
