const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require("./utils/geocode")
const forecast = require("./utils/forecast")


const app = express();
const port = process.env.PORT || 3000
// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req,res) => {
    //render one of your views...handlebars templates
    res.render('index', {
        title: 'Weather App',
        name: 'Josh'
    })
})

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Josh'   
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        help: `Ahh help me I'm drowning!`,
        title: 'Help',
        name: 'Josh'
    })
})

app.get('/weather', (req,res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Error: Must provide an address'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({
                error,
            })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error,
                })
            }
        

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req,res) => {
    if (!req.query.search) { //requires search
        return res.send({ //ends function to avoid error
            error: 'You must provide a search term.'
        })
    } 
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req,res) => {
    res.render('errorPage', {
        title: 'Help',
        message: 'Help article not found',
        name: 'Josh'
    })
})

app.get('*', (req,res) => {
    res.render('errorPage', {
        title: '404',
        message: 'Page not found',
        name: 'Josh'
    })
})


//listen for a start on a port, second optional argument is a callback function
app.listen(port, () => {
    console.log('Server is up on port ' + port);
});

//start the server up so we can view it in the browser