require( "dotenv" ).config();

const cookieParser = require( "cookie-parser" );

const express = require( "express" );
const app = express()

const Token = require( "./token/token.js" );

app.use( cookieParser(), express.json() );

app.get( "/", ( req, res, next ) => {
    res.status( 200 ).send( "Hello" );
})



app.use( Token.auth );
const PORT = process.env.PORT || 9999
app.listen( PORT, () => { console.log( 'Listening on port ' + PORT ) } ) ;

