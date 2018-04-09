const https = require('https')
const colorcolor = require('colorcolor')
const url = 'https://raw.githubusercontent.com/openmaptiles/osm-bright-gl-style/master/style.json'

let style = {
  version: 8,
  sources: {
    openmaptiles: {
      type: 'vector',
      tiles: ['https://hfujimura.gitlab.io/caf1801/{z}/{x}/{y}.mvt'],
      attribution: '&copy; OpenMapTiles &copy; OpenStreetMap contributors',
      maxzoom: 14
    }
  },
  glyphs: 'https://hfu.github.io/openmaptiles-fonts/{fontstack}/{range}.pbf',
  //sprite: 'https://openmaptiles.github.io/osm-bright-gl-style/sprite',
  layers: []
}

// esri interoperability challenge :-)
style.sources.openmaptiles.initialExtent = {
  xmin: -20037508.342787,
  ymin: -20037508.342787,
  xmax: 20037508.342787,
  ymax: 20037508.342787,
  spatialReference: {wkid: 102100, latestWkid: 3857}
}
style.sources.openmaptiles.fullExtent = {
  xmin: -20037508.342787,
  ymin: -20037508.342787,
  xmax: 20037508.342787,
  ymax: 20037508.342787,
  spatialReference: {wkid: 102100, latestWkid: 3857}
}
style.sources.openmaptiles.minScale = 295828763.7957775
style.sources.openmaptiles.maxScale = 564.248588
style.sources.openmaptiles.tileInfo = {
  rows: 512,
  cols: 512,
  dpi: 96,
  format: 'pbf',
  origin: {x: -20037508.342787, y: 20037508.342787},
  spatialReference: {wkid: 102100, latestWkid: 3857}
}
style.sources.openmaptiles.tileInfo.lods = [
{level: 0, resolution: 78271.516964, scale: 295828763.7957775 },
{level: 1, resolution: 39135.75848199995, scale: 147914381.8978885},
{level: 2, resolution: 19567.87924100005, scale: 73957190.9489445},
{level: 3, resolution: 9783.93962049995, scale: 36978595.474472},
{level: 4, resolution: 4891.96981024998, scale: 18489297.737236},
{level: 5, resolution: 2445.98490512499, scale: 9244648.868618},
{level: 6, resolution: 1222.992452562495, scale: 4622324.434309},
{level: 7, resolution: 611.496226281245, scale: 2311162.2171545},
{level: 8, resolution: 305.74811314069, scale: 1155581.1085775},
{level: 9, resolution: 152.874056570279, scale: 577790.5542885},
{level: 10, resolution: 76.4370282852055, scale: 288895.2771445},
{level: 11, resolution: 38.2185141425366, scale: 144447.638572},
{level: 12, resolution: 19.1092570712683, scale: 72223.819286},
{level: 13, resolution: 9.55462853563415, scale: 36111.909643},
{level: 14, resolution: 4.777314267817075, scale: 18055.9548215},
{level: 15, resolution: 2.388657133974685, scale: 9027.977411},
{level: 16, resolution: 1.19432856698734, scale: 4513.9887055},
{level: 17, resolution: 0.597164283427525, scale: 2256.9943525},
{level: 18, resolution: 0.2985821417799085, scale: 1128.4971765},
{level: 19, resolution: 0.1492910708238085, scale: 564.248588}
]

https.get(url, res => {
  let json = ''
  res.setEncoding('utf-8')
  res.on('data', chunk => { json += chunk })
  res.on('end', () => {
    json = JSON.parse(json)
    layers: for (let i in json.layers) {
      let layer = json.layers[i]
      if (layer.id.indexOf('railway') !== -1) continue layers
      if (!layer.layout) layer.layout = {}
      if (layer.layout['icon-image']) continue layers
      if (layer.layout['text-field'] && layer.id.includes('country')) {
        if (layer.layout['text-field'].includes('latin')) {
          layer.layout['text-field'] = '{name:en}'
        }
      }
      if (layer.type === 'symbol') {
        if (layer.id.includes('place-country')) {
          if (layer.id === 'place-country-other') continue layers
          layer.filter.pop()
        } else if (layer.id.includes('place')) {
        } else {
          for (let j in layer.filter) {
            if (layer.filter[j][0] === 'has') {
              layer.filter.splice(j, 1)
            }
          }
        }
      }
      delete layer.metadata
      for (let item of [
        'line-color', 'fill-color', 'fill-outline-color', 'text-color']) {
        if (layer.paint[item]) {
          if (typeof layer.paint[item] === 'string') {
            layer.paint[item] = colorcolor(layer.paint[item])
          } else {
            if (layer.paint[item].stops) {
              for (let i in layer.paint[item].stops) {
                layer.paint[item].stops[i][1] =
                colorcolor(layer.paint[item].stops[i][1])
              }
            }
          }
        }
      }
      style.layers.push(layer)
    }
    console.log(JSON.stringify(style, null, 2))
  })
})
