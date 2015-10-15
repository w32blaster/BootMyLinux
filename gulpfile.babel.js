import gulp from 'gulp';
import browserify from 'browserify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import eslint from 'gulp-eslint';
import babelify from 'babelify';
import uglify from 'gulp-uglify';
import rimraf from 'rimraf';
import notify from 'gulp-notify';
import browserSync, { reload } from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import nested from 'postcss-nested';
import vars from 'postcss-simple-vars';
import extend from 'postcss-simple-extend';
import cssnano from 'cssnano';
import htmlReplace from 'gulp-html-replace';
import image from 'gulp-image';
import runSequence from 'run-sequence';
import react from 'gulp-react';
import reactify from 'reactify';

const paths = {
  bundle: 'app.js',
  srcJsx: [
      'src/js/index.js',
      'src/js/components/Application.js'
      ],
  srcCss: 'src/styles/*.css',
  srcImg: 'src/images/**',
  dist: 'dist',
  distImg: 'dist/images',
  distCss: 'dist/styles'
};

gulp.task('clean', cb => {
  rimraf('dist', cb);
});

gulp.task('browserSync', () => {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('watchify', () => {
  let bundler = watchify(browserify(paths.srcJsx, watchify.args));

  function rebundle() {
    return bundler
      .transform(reactify)
      .bundle()
      .on('error', notify.onError())
      .pipe(source(paths.bundle))
      .pipe(gulp.dest(paths.dist))
      .pipe(reload({stream: true}));
  }

  bundler
  .on('update', rebundle);
  return rebundle();
});

gulp.task('browserify', () => {
  browserify(paths.srcJsx)
  .transform(reactify)
  .bundle()
  .pipe(source(paths.bundle))
  .pipe(buffer())
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.dist));
});

gulp.task('styles', () => {
  gulp.src(paths.srcCss)
  .pipe(sourcemaps.init())
  .pipe(postcss([vars, extend, nested, cssnano]))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.distCss))
  .pipe(reload({stream: true}));
});

gulp.task('jsons', () => {
  gulp.src('src/*.json')
  .pipe(gulp.dest(paths.dist));
});

gulp.task('htmlReplace', () => {
  gulp.src('src/index.html')
  .pipe(htmlReplace({css: 'styles/main.css', js: 'app.js'}))
  .pipe(gulp.dest(paths.dist));
});

gulp.task('images', () => {
  gulp.src(paths.srcImg)
  .pipe(image())
  .pipe(gulp.dest(paths.distImg));
});

gulp.task('lint', () => {
  gulp.src(paths.srcJsx)
  .pipe(eslint())
  .pipe(eslint.format());
});

gulp.task('watchTask', () => {
  gulp.watch(paths.srcCss, ['styles']);
  gulp.watch(paths.srcJsx, ['lint']);
});

gulp.task('watch', cb => {
  runSequence('clean', ['browserSync', 'watchTask', 'watchify', 'styles', 'jsons', 'lint', 'htmlReplace', 'images'], cb);
});

gulp.task('build', cb => {
  process.env.NODE_ENV = 'production';
  runSequence('clean', ['browserify', 'styles', 'jsons', 'htmlReplace', 'images'], cb);
});