const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=b0e1018b0e40fdaa950b657867b99580&query=' + latitude + ',' + longitude + '&units=f';
    request( {url, json: true}, (error,{ body }) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined);
        }  else if (body.error) {
            callback('Unable to find location', undefined);
        } else {
            callback(undefined, body.current.weather_descriptions[0] +` It is currently ` + body.current.temperature + ` degrees out. There is a ` + 
            body.current.precip + ` chance that it will rain today.`);
        }
    })
}

module.exports = forecast;