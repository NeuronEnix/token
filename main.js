require( "dotenv" ).config();

const cookieParser = require( "cookie-parser" );

const express = require( "express" );
const app = express()

const tok = require("./token/token.controller.js" );
const tokRouter = require("./token/token.router" );
app.use( cookieParser(), express.json() );

app.get( "/", ( req, res, next ) => {
    res.status( 200 ).send( "Hello" );
})

app.get("/login", ( req, res, next ) => {
    const userDoc = { _id:2, name:"aa" };
    tok.refTok.createAndAddToCookie(res);
    res.status(200).send( { accTok : tok.accTok.getNewTok( userDoc ) } );
})
app.use(  tokRouter );

app.use( tok.auth );

app.get( "/resource", ( req, res, next )=> {
    res.status( 200 ).send( "Your Resources...");
});

const PORT = process.env.PORT || 9999
app.listen( PORT, () => { console.log( 'Listening on port ' + PORT ) } ) ;
