const Keycloak = require('keycloak-connect');
const express = require('express');
const session = require('express-session');
const expressHbs = require('express-handlebars');

const app = express();

/* Register 'handelbars' extension with The Mustache Express */
app.engine('hbs', expressHbs({ extname: 'hbs', defaultLayout: 'layout.hbs', relativeTo: __dirname }));
app.set('view engine', 'hbs');


const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });

/* session */
app.use(session({ secret: 'thisShouldBeLongAndSecret', resave: false, saveUninitialized: true, store: memoryStore }));

app.use(keycloak.middleware());

//route protected with Keycloak
app.get('/test', keycloak.protect(), (req, res) => {
  res.render('test', { title: 'Test of the test' });
});

/* unprotected route */
app.get('/', (req, res) => {
  res.render('index');
});

app.use(keycloak.middleware({ logout: '/' }));

app.listen(8000, function () {
  console.log('Server running at port 8000');
});