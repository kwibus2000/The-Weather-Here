const mymap = L.map('checkinMap').setView([0, 0], 2)
// const attribution =
//   '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-auteurs'
// const tileUrl = 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
// const tiles = L.tileLayer(tileUrl, { attribution })
// tiles.addTo(mymap)
const mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>-auteurs'
const ocmlink = '<a href="http://thunderforest.com/">Thunderforest</a>'
L.tileLayer(
  'https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=d8619099c2d441a0ba8b1130540f5c2c',
  {
    attribution: `&copy; ${mapLink} & ${ocmlink}`,
    maxZoom: 18,
  }
).addTo(mymap)

const getData = async () => {
  const response = await fetch('/api')
  const data = await response.json()
  console.log('air:', data.air)

  for (item of data) {
    const marker = L.marker([item.lat, item.lon]).addTo(mymap)
    let txt = `Het weer hier (${item.lat}&deg;, ${
      item.lon
    }&deg;) is ${item.weather.summary.toLowerCase()}
      bij een temperatuur van ${item.weather.temperature} &deg; C. `
    if (item.air === undefined || item.air.value < 0) {
      txt += `Er zijn verder helaas geen metingen van luchtkwaliteit bekend`
    } else {
      txt += `De concentratie van kleine deeltjes (${item.air.parameter}) is ${item.air.value} ${item.air.unit}, laatst gemeten op ${item.air.lastUpdated}`
    }
    marker.bindPopup(txt)
  }
  console.log(data)
}

getData()
