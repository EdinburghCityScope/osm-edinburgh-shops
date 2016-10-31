// OSM importer script
var query_overpass = require('query-overpass');
var fs = require('fs');
var edinburghcityscopeUtils = require('edinburghcityscope-utils');
var csv2geojson = require('csv2geojson');
var json2csv = require('json2csv');
var path = require('path');
var datadir = path.join(__dirname, '..', 'data');
var outputCsvFile = path.join(datadir, 'edinburgh-shops.csv');
var outputGeoJsonFile = path.join(datadir, 'edinburgh-shops.geojson');

var nominatim_api = "http://nominatim.openstreetmap.org/search?q=City+of+Edinburgh,+Scotland,+UK&format=jsonv2&polygon=1";
edinburghcityscopeUtils.getDataFromURL(nominatim_api, (body) => {
    var city = JSON.parse(body);
    var boundary = city[0].polygonpoints;
    var polygon = "";
    for (var i = 0; i < boundary.length; i += 20) {
        polygon += " " + boundary[i][1] + " " + boundary[i][0];
    }
    polygon = polygon.trim();
    boundary = city[0].boundingbox;
    boundary = boundary[0] + ',' + boundary[2] + ',' + boundary[1] + ',' + boundary[3];
    var query = '[out:json][bbox:' + boundary + '];node(poly:"' + polygon + '")[shop];out;';

    console.log("Getting OSM data from API");
    query_overpass(query, (err, geoJsonData) => {
        if (err) {
            console.error("Overpass API " + err.message);
            return;
        }
        fs.writeFile(outputGeoJsonFile, JSON.stringify(geoJsonData), (err) => {
            if (err) throw err;
            console.log('GeoJSON file saved to ' + outputGeoJsonFile);
        });

        // Generate a CSV including all tags used.
        var fields = [];
        var datum = {};
        var data = [];
        var keys;
        for (var i = 0; i < geoJsonData.features.length; ++i) {
            datum = {'id': geoJsonData.features[i].id};
            console.log( Object.keys(geoJsonData.features[i].properties.tags));
            keys = Object.keys(geoJsonData.features[i].properties.tags);
            for (var k = 0; k < keys.length; ++k) {
                 datum[keys[k]] = geoJsonData.features[i].properties.tags[keys[k]];
                 if (fields.indexOf(keys[k]) == -1) {
                     fields.push(keys[k]);
                 }
            }
            data.push(datum);
        }
        fields = fields.sort();
        // Make sure the id field is listed first.
        fields.unshift('id');

        var csv = json2csv({'data': data, 'fields': fields});
        fs.writeFile(outputCsvFile, csv, (err) => {
            if (err) throw err;
            console.log('CSV file saved to ' + outputCsvFile);
        });

    });
});
