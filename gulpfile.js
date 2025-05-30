import gulp from "gulp";
import rename from "gulp-rename";
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import panini from 'panini';
import plumber from 'gulp-plumber';
import htmlmin from 'gulp-htmlmin'
import autoPrefixer from "gulp-autoprefixer";
import sassGlob from 'gulp-sass-glob';
import uglify from 'gulp-uglify';
import webpack from 'webpack-stream';
import imagemin from "gulp-imagemin";
import newer from "gulp-newer";
import babel from "gulp-babel";
import fonter from "gulp-fonter";
import ttf2woff2 from "gulp-ttf2woff2";
import {deleteAsync} from "del";
import browserSync from "browser-sync";


const publicPath = "_public/";
const srcPath = "src/";

const path = {
    build:{
        html: publicPath,
        css: publicPath + "css/",
        js: publicPath + "js/",
        img: publicPath + "img/",
        font: publicPath + "font/"
    },
    src:{
        html: srcPath + "html/*.html",
        css: srcPath + "scss/style.scss",
        js: srcPath + "js/**/*.js",
        img: srcPath + "img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}",
        font: srcPath + "font/**/*.{eot,woff,woff2,ttf,svg}"
    },
    watch:{
        html: srcPath + "html/**/*.html",
        css: srcPath + "scss/**/*.scss",
        js: srcPath + "js/**/*.js",
        img: srcPath + "img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}",
        font: srcPath + "font/**/*.{eot,woff,woff2,ttf,svg}"
    },
    clear: "./" + publicPath
};

export const html = () => {
    panini.refresh();
    return gulp.src(path.src.html)
        .pipe(panini({
            root: srcPath + "html/",
            layouts: srcPath + "html/" + "layouts/",
            partials:srcPath + "html/" + "partials/",
            helpers: srcPath + "html/" + "helpers/",
            data: srcPath + "html/" + "data/",
        }))
        // .pipe(htmlmin({
        //     collapseWhiteSpace: true
        // }))
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream())
}

export const js = () => {
    return gulp.src(path.src.js)
        .pipe(babel())
        .pipe(webpack({
					mode: "production",
					entry:{
						index: './src/js/main.js'
					},
				}))
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js))
}



export const clear = () => {
    return deleteAsync("./_public");
}

export const scss = () => {
    return gulp.src(path.src.css, {sourcemaps: true})
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(autoPrefixer())
        .pipe(gulp.dest(path.build.css))
}

export const img = () => {
    return gulp.src(path.src.img)
        .pipe(newer(path.build.img))
        .pipe(imagemin({
            verbose: true
        }))
        .pipe(gulp.dest(path.build.img));
}

export const font = () => {
    return gulp.src(path.src.font)
        .pipe(newer(path.build.font))
        .pipe(fonter({
            formats: ["ttf", "woff", "eot", "svg"]
        }))
        .pipe(gulp.dest(path.build.font))
        .pipe(ttf2woff2())
        .pipe(gulp.dest(path.build.font))
}
export const server = () => {
    browserSync.init({
        server:{
            baseDir: "./_public"
        }
    })
}

export const watch = () => {
    gulp.watch(path.watch.html, html).on("all", browserSync.reload);
    gulp.watch(path.watch.css, scss).on("all", browserSync.reload);
    gulp.watch(path.watch.js, js).on("all", browserSync.reload);
    gulp.watch(path.watch.img, img).on("all", browserSync.reload);
    gulp.watch(path.watch.font, font).on("all", browserSync.reload);
}

export const dev = gulp.series(
    clear,
    gulp.parallel(html, scss, js, img, font),
    gulp.parallel(watch,server)
);