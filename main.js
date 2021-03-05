require( "dotenv" ).config();

const cookieParser = require( "cookie-parser" );

const express = require( "express" );
const app = express()

const Token = require( "./token/token.js" );

app.use( cookieParser(), express.json() );

app.get( "/", ( req, res, next ) => {
    res.status( 200 ).send( "Hello" );
})

app.get("/login", ( req, res, next ) => {
    const userDoc = { _id:2, name:"aa" };
    Token.genRefTokAndAddToCookie( userDoc, res );
    res.status(200).send( { accTok : Token.newAccTok( userDoc ) } );
})
app.use( Token.router );

app.use( Token.auth );

app.get( "/resource", ( req, res, next )=> {
    res.status( 200 ).send( "Your Resources...");
});

const PORT = process.env.PORT || 9999
app.listen( PORT, () => { console.log( 'Listening on port ' + PORT ) } ) ;

