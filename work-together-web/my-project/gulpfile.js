var gulp = require('gulp');

gulp.task('default', function() {

	// 将你的默认的任务代码放在这
	var install = require("gulp-install");

	gulp.src(__dirname + '/templates/**')

	.pipe(gulp.dest('./'))

	.pipe(install());
	var gulp = require('gulp');

	var clean = require('gulp-clean');

	gulp.task('clean', function() {

			return gulp.src('build', {
				read: false
			})

			.pipe(clean());

		}

	);
});