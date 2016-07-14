var gulp = require('gulp'),
    connect = require('gulp-connect'),
    notify = require("gulp-notify"),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    htmlreplace = require('gulp-html-replace'),
    concat = require('gulp-concat'),
    path = require('path'),
    include = require('gulp-html-tag-include');

gulp.task('connect', function () {
    connect.server({
        root: 'dist/',
        livereload: true
    });
});

//css plugin
gulp.task('css', function () {
    gulp.src('app/css/plugins/**.css')
        .pipe(minifyCSS())
        .pipe(concat('plugins.css'))
        .pipe(gulp.dest('dist/css'));
});
// images
gulp.task('clean-images', function () {
    gulp.src('dist/img')
        .pipe(clean({force: true}))
});
gulp.task('images', function () {
    gulp.src('app/img/**/*')
        .pipe(gulp.dest('dist/img'));
});
//fonts
gulp.task('fonts', function () {
    gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/bootstrap'));
});
//sass
gulp.task('sass', ['images', 'fonts'], function () {
    return gulp.src('./app/css/**.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 20 versions'],
            cascade: false
        }))
        .pipe(concat('style.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});
// html
gulp.task('html-include', function () {
    return gulp.src('app/modules/**/**/**')
        .pipe(include())
        .pipe(gulp.dest('app/'));
});
gulp.task('html', ['html-include'], function () {
    gulp.src('app/**.html')
        .pipe(htmlreplace({
            'cssPlugins': 'css/plugins.css',
            'plugins': 'js/plugins.js'
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(connect.reload());
});

gulp.task('js', function () {
    gulp.src('app/js/**.js')
        .pipe(uglify())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
    gulp.src('app/js/plugins/*.js')
        .pipe(uglify())
        .pipe(concat('plugins.js'))
        .pipe(gulp.dest('dist/js'));
    gulp.src('app/js/vendor/**.js')
        .pipe(gulp.dest('dist/js/vendor'));
});


gulp.task('watch',['html', 'js', 'css', 'sass'], function () {
    gulp.watch('app/modules/**/**/**', ['html']);
    gulp.watch('app/js/**/**', ['js']);
    gulp.watch('app/css/**/**/**', ['css']);
    gulp.watch('./app/css/**/**.*', ['sass']);
});

gulp.task('default', ['connect', 'watch']);
