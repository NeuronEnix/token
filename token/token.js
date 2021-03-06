
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
        return { tid:refTokData._id, email:"a" };
    },
}

module.exports.validateAndAuthorizeToken = function ( accTokData, refTokData ) {
    console.log( "Validating and authorizing the token -> user")
}
