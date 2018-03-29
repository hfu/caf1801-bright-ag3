# caf1801-bright-ag3
caf1803-bright via ArcGIS API for JavaScript version 3

## outputs
- [with ArcGIS API for JavaScript 3.21](https://hfu.github.io/caf1801-bright-ag3/index.html)
- [with Mapbox GL JS 0.44](https://hfu.github.io/caf1801-bright-ag3/mb.html)
- [with OpenLayers 4.6.4 with ol-mapbox-style](https://hfu.github.io/caf1801-bright-ag3/ol.html)

## important findings in writing interoperable style.json
### Do not use color description in hsl() or hsla().
ArcGIS API for JavaScript 3.21 does not understand color description like 'hsl(100, 50%, 50%)' and 'hsla(100, 50%, 50%, 1)'. [bright.js](bright.js) includes workaround to convert hsl(a) color to rgb(a) color.

### Make sure you have layer.layout for all layers.
ArcGIS API for JavaScript 3.21 aborts without error message if any layer has no layout. Inserting empty object ({}) doest the workaround.

### Do not use 'has' data operator.
ArcGIS API for JavaScript 3.21 aborts without error message if any layer has 'has' data operator in layer.filter. Only workaround found is to simply emiminate the 'has' operator.

### [open] sprite jsonp issue
ArcGIS API for JavaScript 3.21 make a JSONP call to sprite.json with ?callback=dojo.io.script.jsonp.... I could not find workaround to this without opening up a JSONP hole to sprite providing server. 

## fine print
ArcGIS API for JavaScript 3.21 is not the latest version of ArcGIS API for JavaScript.
