// import _ from '../node_modules/lodash-es6/lodash';
//import def from '../node_modules/wolfy87-eventemitter/EventEmitter';
import $ from 'jquery';

export default class Tatty extends EventEmitter {

    constructor( el, opts ) {
        this.el = el;
        this.opts = Object.assign({
            cols: 80,
            rows: 24
        }, opts || {} );
    }

    write( chars ) {
        console.log( chars );
    }

    get bufferSize() {
        return this.opts.cols * this.opts.rows;
    }

};
