#!/usr/bin/env node

var path = require( 'path' );
var fs = require( 'fs' );
var builder = require( 'systemjs-builder' );

var src = path.join( __dirname, '../src' );
var dist = path.join( __dirname, '../dist' );
var modules = path.join( __dirname, '../node_modules' );

builder.build( 'index', {
    baseURL: path.resolve( src ),
    paths: {
        eventEmitter: path.resolve( src, 'vendor/eventEmitter/EventEmitter.js' )
    }
    // map: {
    //     eventEmitter: path.join( src, 'vendor/eventEmitter/EventEmitter' ),
    //     jquery: 'vendor/jquery/dist/jquery'
    // }
}, path.join( dist, '/index.js' ) )
    .then( function() {
        console.log( 'Build complete' );
    })
    .catch( function( err ) {
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
