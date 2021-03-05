const router = require( 'express' ).Router() ;

const tok = require("./token.controller.js" );


router.get( "/tok/new-acc", ( req, res, next ) => {

    console.log( "Verifying refTok" )
    try {
        const refTok = tok.refTok.verify( req.cookies.refTok );
        // Do Validation on refTok
        // ...
        // Do creation of accTok payload
        // ...
        const userDoc = { _id:3, name:"aa" };
        res.status(200).send( { accTok: tok.accTok.getNewTok( userDoc ) } );

    } catch ( err ) {
        res.send( err.message );
    }
})

router.get( "/tok/new-ref", ( req, res, next ) => {

    console.log( "Verifying refTok" )
    try {
        const refTok = tok.refTok.verify( req.cookies.refTok );
        // Do Validation on refTok
        // ...
        // Do creation of accTok payload
        // ...
        const userDoc = { _id:3, name:"aa" };
        tok.refTok.createAndAddToCookie( res );
        res.status(200).send( { accTok: tok.accTok.getNewTok( userDoc ) } );

    } catch ( err ) {
        res.send( err.message );
    }
})

module.exports = router;