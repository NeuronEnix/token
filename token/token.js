const jwt = require( "jsonwebtoken" );
// const Token = require( "mongoose" ).model( "tokens" );
const router  = require( 'express' ).Router() ;

const { 
    REF_TOK_KEY,
    REF_TOK_EXPIRES_IN,

    ACC_TOK_KEY,
    ACC_TOK_EXPIRES_IN,
} = process.env;

REF_TOK_COOKIE_MAX_AGE = eval( process.env.REF_TOK_COOKIE_MAX_AGE );

function newAccTok( payload ) {
    return jwt.sign( payload, ACC_TOK_KEY, { expiresIn: ACC_TOK_EXPIRES_IN } )
}

function newRefTok( payload ) {
    return jwt.sign( payload, REF_TOK_KEY, { expiresIn: REF_TOK_EXPIRES_IN } )
}

function gemRefTokAndAddToCookie( payload, res ) {
    const cookieProperties = { maxAge: REF_TOK_COOKIE_MAX_AGE, httpOnly: true };
    // res.cookie( cookieName, cookieValue, cookieProperties );
    res.cookie( "refTok", newRefTok( payload ), cookieProperties );
}

function verifyTok( tok, key ) {
    if( !tok ) throw new Error( "Token Not Found" );

    try { return jwt.verify( tok, key ); }
    catch ( err ) {
        if ( err.name === 'JsonWebTokenError' ) throw new Error( "Invalid Token" );
        if ( err.name === 'TokenExpiredError' ) throw new Error( "Token Expired" );
    }
}

function auth( req, res, next ) {
    try {
        accTok = verifyTok( req.header( 'Authorization' ) );
        refTok = verifyTok( req.cookies.refTok );
        validateTokens( accTok, refTok );    
        return next();
    } catch ( err ) {
        console.log( err );        
        res.send( "lol" );
    }

}

router.get( "tok/ref", ( req, res, next ) => {

    try {
        refTok = verifyTok( req.cookies.refTok );
        console.log( refTok );
        Token.findById( refTok._id );

    } catch ( err ) {
        console.log( err );
        res.send( "lol" );
    }
})


function validateTokens( accTok, refTok ) {

}

module.exports = { auth, newAccTok, newRefTok };