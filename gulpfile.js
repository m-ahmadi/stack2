const gulp = require("gulp");
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// watching templates
const shell = require("gulp-shell");
const t = "handlebars ./src/templates/template/ -f ./dist/js/templates.js -e hbs -m -o";
const p = "handlebars ./src/templates/partial/ -f ./dist/js/partials.js -p -e hbs -m -o";

gulp.task("part", shell.task([ p ]));
gulp.task("temp", shell.task([ t ]));

gulp.task("temp-w", () => {
	gulp.watch( "./src/templates/template/**", {ignoreInitial: false}, gulp.series("temp") );
});
gulp.task("part-w", () => {
	gulp.watch( "./src/templates/partial/**", {ignoreInitial: false}, gulp.series("part") );
});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// livereload
const livereload = require("gulp-livereload");
const h = "./dist/index.html";
const c = "./dist/css/**/*.css";
const j = "./dist/js/**/*.js";

gulp.task("live-html", cb => {
	gulp.src(h)
		.pipe( livereload() );
	cb();
});
gulp.task("live-css", cb => {
	gulp.src(c)
		.pipe( livereload() );
	cb();
});
gulp.task("live-js", cb => {
	gulp.src(j)
		.pipe( livereload() );
	cb();
});
gulp.task("live", () => {
	livereload.listen();
	
	gulp.watch( h, gulp.series("live-html") );
	gulp.watch( c, gulp.series("live-css") );
	gulp.watch( j, gulp.series("live-js") );
});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@