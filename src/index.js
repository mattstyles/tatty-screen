import EventEmitter from 'eventEmitter';

export default class Tatty extends EventEmitter {

    /**
     * Attaches itself to the element supplied and gets ready to print
     */
    constructor( el, opts ) {
        this.parent = el;
        this.el = this.createElement();
        this.opts = Object.assign({
            cols: 80,
            rows: 24
        }, opts || {} );

        this.insertStyle();

        this.lines = [];

        // Set DOM styles
        this.parent.classList.add( 'tatty' );
        this.lineHeight = 19;
        this.height = 'default';
        this.width = 'default';

        for ( let y = 0; y < this.opts.rows; y ++ ) {
            this.createLine();
        }
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
            this.parent.style.height = this.opts.rows * this.lineHeight + 'px';
            return;
        }

        this.parent.style.height = h + 'px';
    }

    /**
     * Grabs the element height and returns as an integer
     */
    get height() {
        if ( !this.el ) return;

        return ~~this.parent.style.height.replace( 'px', '' );
    }

    /**
     * Sets the width of the element.
     * Use 'default' to set the width based on character width and number of columns
     */
    set width( w ) {
        if ( !this.el ) return;

        if ( w === 'default' ) {
            this.parent.style.width = this.opts.cols * this.charWidth + 'px';
            return;
        }

        this.parent.style.width = w + 'px';
    }

    /**
     * Grabs the element width and returns as an integer
     */
    get width() {
        if ( !this.el ) return;

        return ~~this.parent.style.width.replace( 'px', '' );
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
        div.style.width = this.width + 'px';
        this.el.appendChild( div );
        this.lines.push( div );
        this.el.style.width = this.width + 'px';
        this.el.style.height = this.lines.length * this.lineHeight + 'px';
        this.showLastLine();
        return div;
    }


    showLastLine() {
        console.log( ( this.lines.length * this.lineHeight ) - ( this.lineHeight * this.opts.rows ) );
        this.el.style.transform = 'translatey(-' + ( ( this.lines.length * this.lineHeight ) - ( this.lineHeight * this.opts.rows ) ) + 'px )';
    }

    /**
     * Inserts the main style for the tatty element
     */
    insertStyle() {
        var style = document.createElement( 'style' );
        style.id = 'tatty';
        style.innerHTML = `
            .tatty {
                position: relative;
                background:white;
                color: #333a3c;
                font-family: 'Source Code Pro';
                font-size: 15px;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                overflow: hidden;
            }
            .tatty .inner {
                position: absolute;
            }
            .tatty .line {
                position: absolute;
            }
        `;

        var head = document.querySelector( 'head' );
        head.appendChild( style );
    }


    createElement() {
        var el = document.createElement( 'div' );
        el.classList.add( 'inner' );
        this.parent.appendChild( el );
        return el;
    }
};
