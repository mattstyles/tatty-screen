
export default class Tatty {

    constructor( el, opts ) {
        this.el = el;
        this.opts = Object.assign({
            cols: 80,
            rows: 24
        }, opts || {} );

        console.log( 'Tatty instantiated' );
    }

    write( chars ) {
        console.log( chars );
    }

    get bufferSize() {
        return this.opts.cols * this.opts.rows;
    }
};
