/// <binding BeforeBuild='min' Clean='clean' />
"use strict";

var gulp = require("gulp"),
    del = require("del"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    sass = require("gulp-sass");

var paths = {
    webroot: "./wwwroot/"
};

paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.cssSrc = paths.webroot + "css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css";
paths.sass = paths.webroot + "sass/**/*.scss";
paths.bowerComponents = paths.webroot + "lib/";

gulp.task("sass", function () {
    return gulp.src(paths.sass)
        .pipe(sass({
            includePaths: [
                paths.bowerComponents + "foundation-sites/scss",
                paths.bowerComponents + "motion-ui/src",
                paths.bowerComponents + "bulma"
            ]
        }).on('error', sass.logError))
        .pipe(gulp.dest(paths.cssSrc));
});

gulp.task("clean:js", function () {
    return del([paths.concatJsDest, paths.minJs]);
});

gulp.task("clean:css", function (cb) {
    return del([paths.concatCssDest, paths.minCss]);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("min:js", ["clean:js"], function () {
    return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", ["sass"], function () {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("build", ["min"]);

/*var sassChanges = gulp.watch(paths.sass, ["min:css"]);
sassChanges.on("change", function (e) {
    console.log("SASS File " + e.path + " was " + e.type + ", building css...");
});*/

/*var jsChanges = gulp.watch(paths.js, ["min:js"]);
jsChanges.on("change", function (e) {
    console.log("JS File " + e.path + " was " + e.type + ", building js...");
});*/

gulp.task("min", ["min:js", "min:css"]);