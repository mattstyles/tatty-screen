#!/usr/bin/env node

var path = require( 'path' );
var fs = require( 'fs' );
var builder = require( 'systemjs-builder' );
var pkg = require( '../package.json' );

var src = path.join( __dirname, '../src' );
var dist = path.join( __dirname, '../dist' );
var modules = path.join( __dirname, '../node_modules' );

builder.build( './' + pkg.name + '/' + pkg.name, {
    baseURL: '../'
}, path.join( dist, pkg.name + '.js' ) )
    .then( function() {
        console.log( 'Build complete' );
    })
    .catch( function( err ) {
        console.error( 'Build error' );
        console.error( err );
    });

fs.readFile( path.join( modules, 'traceur/bin/traceur-runtime.js' ), 'utf8', function( err, file ) {
    fs.writeFile( path.join( dist, 'common/traceur-runtime.js' ), file, 'utf8' );
});

fs.readFile( path.join( modules, 'es6-module-loader/dist/es6-module-loader.src.js' ), 'utf8', function( err, file ) {
    fs.writeFile( path.join( dist, 'common/es6-module-loader.js' ), file, 'utf8' );
});

fs.readFile( path.join( modules, 'systemjs/dist/system.src.js' ), 'utf8', function( err, file ) {
    fs.writeFile( path.join( dist, 'common/system.js' ), file, 'utf8' );
});
