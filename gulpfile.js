'use strict';

const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const del = require('del');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const runSequence = require('run-sequence');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');

// Set the browser that you want to support
const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

gulp.task('styles', function() {
    return gulp.src(['public/css/**/*.css', '!public/css/test.css'])
        .pipe(autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS
        }))
        .pipe(csso())
        .pipe(gulp.dest('public/dist/css'))
});

// Gulp task to minify JavaScript files
gulp.task('scripts', function() {
    return gulp.src(['public/js/**/*.js', '!public/js/test.js'])
        .pipe(uglify())
        .pipe(gulp.dest('public/dist/js'))
        .on('error', function(err) {
            console.error('Error in compress task', err.toString());
        });
});

// Gulp task to minify HTML files
gulp.task('pages', function() {
    return gulp.src(['public/index.html'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('public/dist'));
});

// Gulp task to minify image files
gulp.task('images', function() {
    gulp.src('public/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('public/dist/images'))
        .on('error', function(err) {
            console.error('Error in compress task', err.toString());
        });
});

// Clean output directory
gulp.task('clean', () => del(['dist']));

// Gulp task to minify all files
gulp.task('default',
    gulp.series('clean',
        gulp.parallel('styles', 'pages', 'scripts', 'images')
    )
);
