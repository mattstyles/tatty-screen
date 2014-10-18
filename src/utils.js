import EventEmitter from '../../EventEmitter/index';

var position = {
    x: 0,
    y: 0
}

export class Point extends EventEmitter {
    constructor( x, y ) {
        if ( typeof x === 'object' ) {
            this.x = x.x;
            this.y = x.y;
            return;
        }

        this.x = x || 0;
        this.y = y || 0;
    }

    set x( j ) {
        position.x = j;
        this.emit( 'changeX', position.x );
    }

    set y( k ) {
        position.y = k;
        this.emit( 'changeY', position.y );
    }

    get x() {
        return position.x;
    }

    get y() {
        return position.y;
    }

    debug( id='Point') {
        console.log( id, position.x, position.y );
    }
}

export class Modules extends EventEmitter {
    constructor() {
        this.modules = [];
    }

    push( module ) {
        if ( this.getModule( module.name ) ) {
            console.error( 'module id already registered' );
            return;
        }

        this.modules.push( module );
        this.emit( 'module:added', module );
    }

    getModule( id ) {
        let i = this.modules.length - 1;
        while( i >= 0 ) {
            if ( this.modules[ i ].name === id ) {
                return this.modules[ i ];
            }
            i--;
        }
        return false;
    }
}
