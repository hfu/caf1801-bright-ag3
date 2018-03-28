const https = require ('https')
const url = 'https://raw.githubusercontent.com/openmaptiles/osm-bright-gl-style/master/style.json'

let style = {
  version: 8,
  sources: {
    openmaptiles: {
      type: "vector",
      tiles: ["https://hfujimura.gitlab.io/caf1801/{z}/{x}/{y}.mvt"],
      attribution: "&copy; OpenMapTiles &copy; OpenStreetMap contributors",
      maxzoom: 22
    }
  },
  glyphs: "https://hfu.github.io/noto-jp/{fontstack}/{range}.pbf",
  layers: []
}

https.get(url, res => {
  let json = ''
  res.setEncoding('utf-8')
  res.on('data', chunk => { json += chunk })
  res.on('end', () => {
    json = JSON.parse(json)
    for (let i in json.layers) {
      if (json.layers[i]['source-layer'] === 'waterway') {
        delete json.layers[i].metadata
        style.layers.push(json.layers[i])
      }
    }
    console.log(JSON.stringify(style, null, 2))
  })
})
