require( "dotenv" ).config();

const cookieParser = require( "cookie-parser" );

const express = require( "express" );
const app = express()

const tok = require("./token/token.controller.js" );
const tokRouter = require("./token/token.router" );
app.use( cookieParser(), express.json() );
let req_num = 1;
app.use( ( req, res, next ) => { console.log("\nRequest:", req_num++ ); next(); } )

app.get( "/", ( req, res, next ) => {
    res.status( 200 ).send( "Hello" );
})

app.post("/login", ( req, res, next ) => {
    const userDoc = {
        _id:0,
        email:"a",
        pass:"a",
    };

    const refTokPayload = { uid:userDoc._id };
    const newRefTok = tok.refTok.getTok( refTokPayload );
    tok.refTok.addToCookie( res, newRefTok.tok );
    const accTokPayload = { tid:newRefTok.data._id, email: userDoc.email };
    const newAccTok = tok.accTok.getTok( accTokPayload );
    res.status(200).send( { accTok : newAccTok.tok } );
})
app.use(  tokRouter );

app.use( tok.auth );

app.get( "/resource", ( req, res, next )=> {
    res.status( 200 ).send( "Your Resources...");
});

const PORT = process.env.PORT || 9999
app.listen( PORT, () => { console.log( 'Listening on port ' + PORT ) } ) ;
