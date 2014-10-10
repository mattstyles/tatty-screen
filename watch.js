#!/usr/bin/env node

var spawn = require( 'child_process' ).spawn;
var watch = require( 'watch' );

watch.createMonitor( './lib', {
    ignoreDotFiles: true,
    ignoreDirectoryPattern: '/node_modules/',
    interval: 500
}, function( monitor ) {

    monitor.on( 'changed', function( file, curr, prev ) {
        console.log( 'file is changing', file );
        var error = null;
        spawn( './build.sh' )
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
