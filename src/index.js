import Tatty from './tatty';

var tty = new Tatty();
tty.on( 'write', function( data ) {
    console.log( '::', data );
});


tty.write( 'Hello from tatty' );
