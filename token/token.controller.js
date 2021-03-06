const jwt = require( "jsonwebtoken" );
const userMade = require( "./token" );

class Token {
    #key;
    #expiresIn;
    constructor( key, expiresIn ) {
        this.#key = key;
        this.#expiresIn = expiresIn;
    }
    getData( tok ) {
        if ( !tok ) throw new Error( "Token Not Found" );
        try { 
            const tokData = jwt.verify( tok, this.#key );
            delete tokData.iat;
            delete tokData.exp;
            delete tokData.nbf;
            delete tokData.jti;
            return tokData;
        }
        catch ( err ) {
            if ( err.name === 'JsonWebTokenError' ) throw new Error( "InvalidToken" );
            if ( err.name === 'TokenExpiredError' ) throw new Error( "TokenExpired" );
        }
    }
    getTok( payload ) {
        return { data:payload, tok: jwt.sign( payload, this.#key, { expiresIn: this.#expiresIn } ) };
    }
}

class AccessToken extends Token {
    constructor( key, expiresIn ) { super( key, expiresIn ); }
    getTok( payload, refTokData ) { 
        return super.getTok( payload ? payload : userMade.refTok.getPayload( refTokData ) )
    }
}

class RefreshToken extends Token {
    #cookieProperties;
    constructor( key, expiresIn, cookieMaxAge  ) {
        super( key, expiresIn );
        this.#cookieProperties = { maxAge: cookieMaxAge, httpOnly: true };
    }
    getTok( payload, refTokData ) { 
        if( !payload ) payload = userMade.refTok.getPayload( refTokData );
        payload.tid = "tok_id";
        return super.getTok( payload );
    }
    validateTokData( tokData ) { console.log( "Validating refTok"); return tokData; }
    addToCookie( res, tok ) { 
        res.cookie( "refTok", tok, this.#cookieProperties ); }
    handle( res, meta, refTokData ) {
        const payload = this.getPayload( meta, refTokData );
        const tok = this.getTok( payload );
        this.addToCookie( res, tok );
        return payload;
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
        accTokData = this.accTok.getData( req.header( 'Authorization' ) );
        refTokData = this.refTok.getData( req.cookies.refTok );
        userMade.validateAndAuthorizeToken( accTokData, refTokData, res );
        console.log( "Authorized");
        next();
    } catch ( err ) {
        console.log( err.message );
        res.send( err.message );
    }
}