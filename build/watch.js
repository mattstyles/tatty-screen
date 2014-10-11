#!/usr/bin/env node

var path = require( 'path' );
var spawn = require( 'child_process' ).spawn;
var watch = require( 'watch' );

var src = path.join( __dirname, '../src' );

watch.createMonitor( src, {
    ignoreDotFiles: true,
    ignoreDirectoryPattern: '/node_modules/',
    interval: 500
}, function( monitor ) {

    monitor.on( 'changed', function( file, curr, prev ) {
        console.log( 'file is changing', file );
        var error = null;
        spawn( path.join( __dirname, './build.js' ) )
            .stderr.on( 'data', function( chunk ) {
                console.log( 'Error generating bundle' );
                console.log( '  ', chunk.toString() );
                error = chunk;
            })
            .on( 'close', function( code ) {
                if ( !error ) {
                    console.log( 'Bundle updated' );
                }
            });
    });

});
