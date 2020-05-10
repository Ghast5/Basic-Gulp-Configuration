const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const sourceMap = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cleanCss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const htmlReplace = require('gulp-html-replace');
const htmlMin = require('gulp-htmlmin');
const del = require('del');

const paths = {}

const server = (done) => {
    browserSync.init({
        server: {
            baseDir: 'src'
        },
        ghostMode: {
            clicks: true,
            forms: true,
            scroll: true
        }
    });
  
    done;
}

const watch = () => {
    gulp.watch('src/*.html').on('change', browserSync.reload);
    gulp.watch('src/scss/**/*.scss', gulp.series('sassTask'));
    gulp.watch('src/app/**/*.js', gulp.series('babelTask'));
}

const sassTask = (done) => {
    return gulp.src('src/scss/**/*.scss')
    .pipe(sourceMap.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([ autoprefixer() ]))
    .pipe(sourceMap.write())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());

    done;
}

const css = function(){
    return gulp.src('src/css/**/*.css')
        .pipe(concat('style.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest('dist/css'));
}

const babelTask = (done) => {
    return gulp.src('src/app/**/*.js')
    .pipe(sourceMap.init())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(sourceMap.write())
    .pipe(gulp.dest('src/appTwo'))
    .pipe(browserSync.stream());

    done;
}

const js = () => {
    return gulp.src('src/appTwo/**/*.js')
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'));
}

const img = () => {
    return gulp.src('src/image/**/*.{jpg,jpeg,png,gif}')
        .pipe(changed('folder_gdzie_sa_juz_zminifikowane_zdjecia'))
        .pipe(imagemin())
        .pipe(gulp.dest('dist/image'));
}

const html = () => {
    return gulp.src('src/*.html')
        .pipe(htmlReplace({
            'css': 'css/style.css',
            'js': 'scripts/script.js',
        }))
        .pipe(htmlMin({
            sortAttributes: true,
            sortClassName: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist/'));
}

const clean = () => {
    return del(['dist']);
}

const build = (done) => {
    return gulp.series('clean', 'css', 'js', 'html')(done);
}

exports.default = gulp.series(server, gulp.parallel(sass, babelTask), watch);
exports.css = css;
exports.sass = sassTask;
exports.babel = babelTask;
exports.js = js;
exports.html = html;
exports.clean = clean;
exports.build = build;
exports.server = server;