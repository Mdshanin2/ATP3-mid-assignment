//declaration
const express 		= require('express');
const bodyParser 	= require('body-parser');
const exSession 	= require('express-session');
//const expressValidator	= require('express-validator/check');

const cookieParser 	= require('cookie-parser');
const login			= require('./controller/login');
const home			= require('./controller/home');
const logout		= require('./controller/logout');
const user			= require('./controller/user');
const reg			= require('./controller/register');// added the controller to the register 
//const adbuyer		= require('./controller/adBuyerlist');
const admember       = require('./controller/ad_member_listCon');
const inbox        = require('./controller/inboxCon');
const member_inbox        = require('./controller/member_inboxCon');
//const job			= require('./controller/joblistCon');
//member
const fhome			= require('./controller/member_homeCon');
const app 			= express();
// pdf work
var pdf        = require('html-pdf');
var fs         = require('fs');
var options    = {format:'A4'};

//config
app.set('view engine', 'ejs');

//middleware
app.use(express.json());
app.use('/xyz', express.static('assets'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(exSession({secret: 'my secret value', saveUninitialized: true, resave: false }));
app.use(cookieParser());
//app.use(expressValidator());

app.use('/login', login);
app.use('/home', home);
app.use('/logout', logout);
app.use('/user', user);
app.use('/register', reg); // added the path to the register
//app.use('/adBuyerlist', adbuyer);
app.use('/admemberlist', admember);
//app.use('/', job);
app.use('/inbox',inbox);
app.use('/member_inbox',member_inbox);

//memebr work
app.use('/member',fhome);


// app.use('/adBuyerlist', adbuyer);
//route
app.get('/', (req, res)=>{
	res.send('Hello from express server');	
});


//server startup
app.listen(3000, (error)=>{
	console.log('express server started at 3000...');
});