import EventEmitter from 'eventEmitter';

export default class Tatty extends EventEmitter {

    /**
     * Attaches itself to the element supplied and gets ready to print
     */
    constructor( el, opts ) {
        this.el = el;
        this.opts = Object.assign({
            cols: 80,
            rows: 24
        }, opts || {} );

        this.insertStyle();

        this.lines = [];

        this.el.classList.add( 'tatty' );
        this.lineHeight = 19;
        this.height = this.opts.rows * this.lineHeight;
    }

    /**
     * Write the characters to the teleprinter.
     * Maintains cursor position at the end of the current line.
     *
     * @unimplemented
     * @param chars {String} the characters to print
     */
    write( chars ) {
        console.log( chars );
        this.trigger( 'write', [ chars ]);
    }

    /**
     * Writes the specified characters to a new line
     *
     * @param chars {String} the characters to print
     */
    writeln( chars ) {
        console.log( chars.length );

        var line = this.createLine();
        line.innerHTML = chars;
    }

    /*-----------------------------------------------------------*\
     *
     *  Getters/Setters
     *
    \*-----------------------------------------------------------*/

    /**
     * Mirrors the desired tatty height with the dom element.
     * Use 'default' to set height based on line height and number of lines
     */
    set height( h ) {
        if ( !this.el ) return;

        if ( h === 'default' ) {
            this.el.style.height = this.opts.rows * this.lineHeight + 'px';
            return;
        }

        this.el.style.height = h + 'px';
    }

    /**
     * Grabs the element height and returns as an integer
     */
    get height() {
        if ( !this.el ) return;

        return ~~this.el.style.height.replace( 'px', '' );
    }

    /**
     * Calculates the char width based on the width of the current 'm' character
     */
    get charWidth() {
        var el = document.createElement( 'span' );
        el.style.opacity = 0;
        el.innerHTML = 'm';
        document.body.appendChild( el );
        var fontWidth = el.offsetWidth;
        document.body.removeChild( el );
        return fontWidth;
    }

    /**
     * Returns the current onscreen buffer size
     */
    get bufferSize() {
        return this.opts.cols * this.opts.rows;
    }

    /*-----------------------------------------------------------*\
     *
     *  Helpers
     *
    \*-----------------------------------------------------------*/

    /**
     * Creates a new line and appends it
     */
    createLine() {
        var div = document.createElement( 'div' );
        div.classList.add( 'line' );
        div.style.top = this.lineHeight * this.lines.length + 'px';
        this.el.appendChild( div );
        this.lines.push( div );
        return div;
    }


    /**
     * Inserts the main style for the tatty element
     */
    insertStyle() {
        var style = document.createElement( 'style' );
        style.id = 'tatty';
        style.innerHTML = `
            .tatty {
                background:white;
                color: #333a3c;
                font-family: 'Source Code Pro';
                font-size: 15px;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                padding: 8px;
            }
            .tatty .line {
                position: absolute;
            }
        `;

        var head = document.querySelector( 'head' );
        head.appendChild( style );
    }
};
