const jwt = require( "jsonwebtoken" );
// const Token = require( "mongoose" ).model( "tokens" );
const router  = require( 'express' ).Router() ;

const { 
    REF_TOK_KEY,
    REF_TOK_EXPIRES_IN,

    ACC_TOK_KEY,
    ACC_TOK_EXPIRES_IN,
} = process.env;

const REF_TOK_COOKIE_MAX_AGE = eval( process.env.REF_TOK_COOKIE_MAX_AGE );

function newAccTok( payload ) {
    return jwt.sign( payload, ACC_TOK_KEY, { expiresIn: ACC_TOK_EXPIRES_IN } )
}

function newRefTok( payload ) {
    return jwt.sign( payload, REF_TOK_KEY, { expiresIn: REF_TOK_EXPIRES_IN } )
}

function genRefTokAndAddToCookie( payload, res ) {
    const cookieProperties = { maxAge: REF_TOK_COOKIE_MAX_AGE, httpOnly: true };
    // res.cookie( cookieName, cookieValue, cookieProperties );
    res.cookie( "refTok", newRefTok( payload ), cookieProperties );
}

function verifyTok( tok, key ) {
    if( !tok ) throw new Error( "Token Not Found" );

    try { return jwt.verify( tok, key ); }
    catch ( err ) {
        if ( err.name === 'JsonWebTokenError' ) throw new Error( "InvalidToken" );
        if ( err.name === 'TokenExpiredError' ) throw new Error( "TokenExpired" );
    }
}

function auth( req, res, next ) {
    console.log( "Authentication")
    try {
        accTok = verifyTok( req.header( 'Authorization' ), ACC_TOK_KEY );
        refTok = verifyTok( req.cookies.refTok, REF_TOK_KEY );
        validateAndAuthorizeTokens( accTok, refTok );
        next();
    } catch ( err ) {
        console.log( err.message );
        res.send( err.message );
    }
}

router.get( "/tok/new-acc", ( req, res, next ) => {

    console.log( "Verifying refTok")
    try {
        refTok = verifyTok( req.cookies.refTok, REF_TOK_KEY );
        // Do Validation on refTok
        // ...
        // Do creation of refTok payload
        // ...
        const userDoc = { _id:3, name:"aa" };
        res.status(200).send( { accTok: newAccTok( userDoc ) } );

    } catch ( err ) {
        res.send( err.message );
    }
})

router.get( "/tok/new-ref", ( req, res, next ) => {

    console.log( "Verifying refTok")
    try {
        refTok = verifyTok( req.cookies.refTok, REF_TOK_KEY );
        // Do Validation on refTok
        // ...
        // Do creation of refTok payload
        // ...
        const userDoc = { _id:3, name:"aa" };
        genRefTokAndAddToCookie( userDoc, res )
        res.status(200).send("Attached new ref tok");

    } catch ( err ) {
        res.send( err.message );
    }
})

function validateAndAuthorizeTokens( accTok, refTok ) {
    console.log( "validating token")
}

module.exports = { auth, newAccTok, newRefTok, gemRefTokAndAddToCookie: genRefTokAndAddToCookie, router };