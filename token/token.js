
module.exports.refTok = {
    getPayload: ( refTokData ) => {
        console.log( "refTok::getPayload() -> user " )
        console.log( "refTokData: ", refTokData )
        return refTokData;
    },
}

module.exports.accTok = {
    getPayload: ( refTokData ) => {
        console.log( "accTok::getPayload() -> user " )
        console.log( "refTokData: ", refTokData )
        return { tid:refTokData.tid, email:"a" };
    },
}

module.exports.validateAndAuthorizeToken = function ( accTokData, refTokData, res ) {
    console.log( "Validating and authorizing the token -> user")
    if ( accTokData.tid !== refTokData.tid ) throw new Error( "InvalidToken" );
    res.user = {...refTokData, ...accTokData };
    console.log( res.user )
}
