const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const del = require('del');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');


//compile scss into css
function style() {
    return gulp.src('scss/**/*.scss')
    .pipe(sass().on('error',sass.logError))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

// Concat and minify libraries JS files
gulp.task('build-vendor-js', function () {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('dist/js'));
});

// Adding html to dist

gulp.task('html', function() {
    return gulp.src(['./*.html'])
        .pipe(gulp.dest('./dist'));
});

// Concat and minify application specific JS files
gulp.task('build-js', function () {
    return gulp.src([ 'js/main.js' ])
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('clean', async () => {
   return del.sync('build');
});

// Adding img to dist and optimize

gulp.task('image', function () {
    return gulp.src('./img/*')
      .pipe(imagemin())
      .pipe(gulp.dest('./dist/img'));
});

function watch() {
    browserSync.init({
        server: {
           baseDir: "./",
           index: "/index.html"
        }
    });
    gulp.watch('scss/**/*.scss', style)
    gulp.watch('./*.html').on('change',browserSync.reload);
    gulp.watch('./js/**/*.js').on('change', browserSync.reload);
}



gulp.task('style-scss', style);

gulp.task('default', gulp.series('build-js', 'build-vendor-js', 'style-scss', 'html', 'image'));

exports.watch = watch;
exports.style = style;

