const jwt = require( "jsonwebtoken" );

class Token {
    _key;
    _expiresIn;

    constructor( key, expiresIn ) {
        this._key = key;
        this._expiresIn = expiresIn;
    }

    verify( tok ) {
        if ( !tok ) throw new Error( "Token Not Found" );
        try { return jwt.verify( tok, this._key ); }
        catch ( err ) {
            if ( err.name === 'JsonWebTokenError' ) throw new Error( "InvalidToken" );
            if ( err.name === 'TokenExpiredError' ) throw new Error( "TokenExpired" );
        }
    }

    getNewTok( payload ) {
        return jwt.sign(payload, this._key, { expiresIn: this._expiresIn } );
    }

    getPayload() {
        return { _id: 1, name: "aa" };
    };
}

class AccessToken extends Token {
    constructor( key, expiresIn ) {
        super( key, expiresIn );
        this.getPayload = undefined
    }
}

class RefreshToken extends Token {
    #cookieProperties

    constructor( key, expiresIn, cookieMaxAge  ) {
        super( key, expiresIn );
        this.#cookieProperties = { maxAge: cookieMaxAge, httpOnly: true };
    }

    validate() {
        console.log( "Validating refTok");
    }

    createAndAddToCookie( res ) {
        // res.cookie( cookieName, cookieValue, cookieProperties );
        res.cookie( "refTok", this.getNewTok( this.getPayload() ), this.#cookieProperties );
    }

}

module.exports.accTok = new AccessToken (
    process.env.ACC_TOK_KEY || "accTokKey",
    process.env.ACC_TOK_EXPIRES_IN || "1m"
);

module.exports.refTok = new RefreshToken(
    process.env.REF_TOK_KEY || "refTokKey",
    process.env.REF_TOK_EXPIRES_IN || "2d",
    eval( process.env.REF_TOK_COOKIE_MAX_AGE || "2*24*60*60*1000" )
);

module.exports.auth = ( req, res, next ) => {
    console.log( "Authorizing...");
    try {
        accTok = this.accTok.verify( req.header( 'Authorization' ) );
        refTok = this.refTok.verify( req.cookies.refTok );
        // validateAndAuthorizeTokens( accTok, refTok, res );
        console.log( "Authorized");
        next();
    } catch ( err ) {
        console.log( err.message );
        res.send( err.message );
    }
}