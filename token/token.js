
module.exports.refTok = {
    getPayload: ( meta, refTokData ) => {
        console.log( "refTok::getPayload() -> user " )
        if( meta ) console.log( "meta: ", meta )
        else console.log( "refTokData: ", refTokData )
        return { _id:0, name :11};
    },
}

module.exports.accTok = {
    getPayload: ( meta, refTokData ) => {
        console.log( "accTok::getPayload() -> user " )
        if( meta ) console.log( "meta: ", meta )
        else console.log( "refTokData: ", refTokData )
        return { _id:0, name :11};
    },
}

module.exports.validateAndAuthorizeToken = function ( accTokData, refTokData ) {
    console.log( "Validating and authorizing the token -> user")
}
