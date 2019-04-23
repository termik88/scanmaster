const gulp = require('gulp');
const less = require('gulp-less');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const server = require('browser-sync').create();
const minify = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const webp = require('imagemin-webp');
const extReplace = require('gulp-ext-replace');
const svgstore = require('gulp-svgstore');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
const run = require('run-sequence');
const del = require('del');
const uglify = require('gulp-uglify');

const watch = require('gulp-watch');

gulp.task('clean', () => {
    return del('build');
});

gulp.task('copy', () => {
    return gulp.src([
        'source/**/*.{woff,woff2}',
        'source/**/favicon.ico'
    ])
        .pipe(gulp.dest('build'));
});

gulp.task('style', () => {
    gulp.src('source/less/style.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest('build/css'))
        .pipe(minify())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('build/css'))
        .pipe(server.stream());
});

gulp.task('scripts', () => {
    return gulp.src('source/js/*.js')
        .pipe(uglify())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest('build/js'));
});

gulp.task('sprite', () => {
    return gulp.src(['!source/img/logo.svg', '!source/img/icon-map-pin.svg', 'source/img/*.svg'])
        .pipe(imagemin([
            imagemin.svgo()
        ]))
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename('sprite.svg'))
        .pipe(gulp.dest('build/img'));
});

gulp.task('svg', () => {
    return gulp.src(['source/img/logo.svg', 'source/img/icon-map-pin.svg'])
        .pipe(imagemin([
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('build/img'));
});

gulp.task('images', () => {
    return gulp.src('source/**/*.{png,jpg}')
        .pipe(gulp.dest('build'))
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.jpegtran({progressive: true}),
            webp({quality: 75})
        ]))
        .pipe(extReplace('.webp'))
        .pipe(gulp.dest('build'));
});

gulp.task('html', () => {
    return gulp.src('source/**/*.html')
        .pipe(posthtml([
            include()
        ]))
        .pipe(gulp.dest('build'));
});

gulp.task("clean-images", function() {
    return del("build/**/*.{png,jpg,webp}");
});

gulp.task('build', (done) => {
    run(
        'clean',
        'copy',
        'style',
        'scripts',
        'images',
        'sprite',
        'svg',
        'html',
        done
    );
});

gulp.task('serve', (done) => {
    server.init({
        server: 'build/',
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch('source/less/**/*.less', ['style']);
    gulp.watch('source/js/*.js', ['scripts']);
    gulp.watch(['!source/img/logo.svg', '!source/img/icon-map-pin.svg', 'source/img/**/*.svg'], ['sprite']);
    gulp.watch(['source/img/logo.svg', 'source/img/icon-map-pin.svg'], ['svg']);
    gulp.watch('source/**/*.html', ['html']);
    watch(['source/**/*.{png,jpg}'], function () {
        run("clean-images", "images");
    });
    gulp.watch('build/**/*.html').on('change', server.reload);
});