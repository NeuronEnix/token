const router = require( 'express' ).Router() ;
const {accTok,refTok} = require("./token.controller.js" );

function validateRefTok( tok ) { return refTok.validateTokData( refTok.getData( tok ) ); }

router.get( "/tok/new-acc", ( req, res, next ) => {
    console.log( "Verifying refTok" )
    try {
        let refTokData = validateRefTok( req.cookies.refTok );
        const accTokPayload = accTok.getPayload( null, refTokData );
        res.status(200).send( { accTok: accTok.getTok( accTokPayload ) } );
    } catch ( err ) {
        res.send( err.message );
    }
})

router.get( "/tok/new-ref", ( req, res, next ) => {
    console.log( "Verifying refTok" )
    try {
        let refTokData = validateRefTok( req.cookies.refTok );
        RefTokData = refTok.handle( res, null, refTokData );
        const accTokPayload = accTok.getPayload( null, refTokData );
        res.status(200).send( { accTok: accTok.getTok( accTokPayload ) } );
    } catch ( err ) {
        res.send( err.message );
    }
})

module.exports = router;
