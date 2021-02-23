const express = require('express')
const Datastore = require('nedb')
const fetch = require('node-fetch')
require('dotenv').config()

const app = express()
app.listen(3000, () => console.log('Starting server: http://localhost:3000'))
app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }))

const database = new Datastore('database.db')
database.loadDatabase()

app.get('/api', (request, response) => {
  database
    .find({})
    .sort({ timestamp: -1 })
    .exec((err, data) => {
      if (err) {
        response.end()
        return
      }
      response.json(data)
    })
})

app.post('/api', (request, response) => {
  const data = request.body
  const timestamp = Date.now()
  data.timestamp = timestamp
  database.insert(data)
  response.json(data)
})

app.get('/weather/:latlon', async (request, response) => {
  const latlon = request.params.latlon.split(',')
  const lat = latlon[0]
  const lon = latlon[1]
  console.log(lat, lon)
  const weather_url = `https://dark-sky.p.rapidapi.com/${lat},${lon}?lang=nl&units=si`
  const weather_response = await fetch(weather_url, {
    // method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'dark-sky.p.rapidapi.com',
    },
  })
  const weather_data = await weather_response.json()

  // const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`
  const aq_url = `https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/latest?limit=100&page=1&offset=0&sort=desc&coordinates=${lat},${lon}&radius=1000&order_by=lastUpdated&dumpRaw=false`
  const aq_response = await fetch(aq_url)
  const aq_data = await aq_response.json()

  const data = {
    weather: weather_data,
    air_quality: aq_data,
  }

  response.json(data)
})

// Dit is server side!
