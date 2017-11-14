const fs = require('fs');
const togeojson = require('togeojson');
const unzip = require('unzip');
const xmldom = new (require('xmldom').DOMParser)();


const toKML = (path, callback) => {
	fs.createReadStream( path )
    .pipe(unzip.Parse())
    .on('entry', function ( entry ) {
      var fileName = entry.path;
      var type = entry.type; // 'Directory' or 'File' 
      if (fileName.indexOf('.kml') === -1) {
        entry.autodrain();
        return;
      }
      
      var data = '';
      entry.on('error', function(err) {
        callback(err);
      });

      entry.on('data', function(chunk) {
        data += chunk.toString();
      });

      entry.on('end', function() {
        callback(null, data);
      });
    })
    .on('error', callback);
  };

const toGeoJson = (path, callback) => {
	toKML(path, function(error, kml) {
      var geojson = togeojson.kml(xmldom.parseFromString(kml));
      callback(null, geojson);
    });
}

exports.toKML = toKML;
exports.toGeoJson = toGeoJson;
