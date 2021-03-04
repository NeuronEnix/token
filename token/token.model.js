const db =  require( "mongoose" );

module.exports = db.model( "tokens", new db.Schema({
    iat: { type: Date, required:true }, //issued at
    // other info goes here
    // ...
}));