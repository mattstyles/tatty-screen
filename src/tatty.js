
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
