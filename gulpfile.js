var gulp        = require('gulp');
var $           = require('gulp-load-plugins')({
  rename: {
    'gulp-merge-media-queries': 'mmq'
  }
});
var	browserSync = require('browser-sync').create();
var	sequence    = require('run-sequence');
var	del         = require('del');
var panini      = require('panini');

var COMPATIBILITY = ['last 2 versions', 'ie >= 9'];

var PATH = {
  dist: 'dist',
  assets: 'dist/assets',
  sass: [
    'bower_components/sanitize-css/lib',
    // NOTE: Due to current `font-size` bug use `normalize.css`.
    'bower_components/normalize-css',
    'bower_components/bourbon/app/assets/stylesheets',
    'src/scss/components',
    'src/scss/pages'
  ],
  javascript: [
    'src/js/debug.js',
    'src/js/helpers.js',
    'src/js/darksection.js',
    'src/js/app.js'
  ],
  jquery: [
    'bower_components/jquery/dist/jquery.slim.min.js'
  ]
}

/*
 * Browsersync
 */

gulp.task('browserSync', function() {
	browserSync.init({
    server: 'dist',
    port:   3000,
    notify: true, // boolean value, Toggle notifications of bsync activity
    open:   false // toggle auotmatic opening of webpage upong bsync starting
    });
});

/*
 * PANINI
 */
gulp.task('pages', function() {
  gulp.src('src/pages/**/*.html')
    .pipe(panini({
      root:     'src/pages/',
      layouts:  'src/layouts/',
      partials: 'src/partials/',
      helpers:  'src/helpers/',
      data:     'src/data/'
    }))
    .pipe(gulp.dest('dist'));
});
gulp.task('resetPanini', function(){
  panini.refresh();
});
gulp.task('reloadPages', function(cb) {
  sequence(
    'resetPanini',
    'pages',
    cb
  )
});

/*
 * PIPES
 */

/* Clean */
gulp.task('clean', function(cb) {
  return del('./dist');
});

gulp.task('devImages', function() {
  return gulp.src('src/imgs/**/*')
  .pipe(gulp.dest(PATH.assets + '/imgs'));
});
gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
  .pipe(gulp.dest(PATH.assets + '/fonts'));
});

gulp.task('rootItems', function() {
  return gulp.src('src/root-items/**/*')
  .pipe(gulp.dest(PATH.dist));
});

gulp.task('jquery', function() {
  return gulp.src(PATH.jquery)
  .pipe(gulp.dest(PATH.assets + '/js'));
});

/* Compile SCSS */
gulp.task('compileSass', function() {
	return gulp.src('src/scss/app.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sass({
			includePaths: PATH.sass
		})
			.on('error', $.sass.logError)
		)
		.pipe($.mmq({
			log: true
		}))
		.pipe($.autoprefixer({
			browsers: COMPATIBILITY
		}))
		.pipe($.sourcemaps.write('./'))
		.pipe(gulp.dest(PATH.assets + '/css'))
		.pipe(browserSync.stream({ // Inject Styles
			match: '**/*.css' // Force source map exclusion *This fixes reloading issue on each file change*
		}));
});

/* Concatinate Main JS Files */
gulp.task('concatScripts', function() {
	return gulp.src(PATH.javascript)
	.pipe($.sourcemaps.init())
	.pipe($.concat('app.js'))
	.pipe($.sourcemaps.write('./'))
	.pipe(gulp.dest(PATH.assets + '/js'));
});

/* Watch Task */
gulp.task('watch', ['browserSync'], function() {
	gulp.watch('src/scss/**/*.scss', ['compileSass']);
  gulp.watch('src/js/**/*.js', ['concatScripts']).on('change', browserSync.reload);
  gulp.watch('src/imgs/**/*', ['devImages']).on('change', browserSync.reload);
	gulp.watch([
    'src/data/**/*',
    'src/helpers/**/*',
    'src/layouts/**/*',
    'src/pages/**/*',
    'src/partials/**/*'
  ],
  ['reloadPages']).on('change', browserSync.reload);
});

/* Development Task */
gulp.task('dev', function(cb) {
	sequence(
		'clean',
    'pages',
    'devImages',
    'fonts',
		'compileSass',
		'concatScripts',
		cb
	);
});

gulp.task('default', function() {
  gulp.start('watch', ['dev']);
});

/* Production tasks */

/* Compile & Minify SCSS */
gulp.task('sassToProduction', function() {
	return gulp.src('src/scss/app.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sass({
			includePaths: PATH.sass
		})
			.on('error', $.sass.logError)
		)
		.pipe($.mmq({
			log: true
		}))
		.pipe($.autoprefixer({
			browsers: COMPATIBILITY
		}))
    .pipe($.cssnano())
		.pipe($.sourcemaps.write('./'))
		.pipe(gulp.dest(PATH.assets + '/css'));
});
/* Concat & Uglify JS */
gulp.task('scriptsToProduction', function() {
	return gulp.src(PATH.javascript)
	.pipe($.sourcemaps.init())
	.pipe($.concat('app.js'))
  .pipe($.uglify())
	.pipe($.sourcemaps.write('./'))
	.pipe(gulp.dest(PATH.assets + '/js'));
});

gulp.task('dist', function(cb) {
  sequence(
    'clean',
    'pages',
    'devImages',
    'fonts',
    'rootItems',
    'sassToProduction',
    'scriptsToProduction',
    cb
  );
});

gulp.task('deploy', function() {
  return gulp.src('dist')
  .pipe($.ghPages());
});
