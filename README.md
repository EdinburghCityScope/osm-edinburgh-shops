# osm-edinburgh-shops
Shops in the City of Edinburgh

## License

The data is made available under the Open Database License: http://opendatacommons.org/licenses/odbl/1.0/.
© OpenStreetMap contributors: http://www.openstreetmap.org/copyright

## Requirements

- NodeJS
- npm

## Installation

Clone the repository

```
git clone https://github.com/EdinburghCityScope/osm-edinburgh-shops.git
```

Install npm dependencies

```
cd osm-edinburgh-shops
npm install
```

Run the API (from the osm-edinburgh-shops directory)

```
node .
```

Converting the csv into loopback data.

```
node scripts/featureCollectionToLoopbackJson.js
```

Importing data from OpenStreetMap's overpass API

```
node scripts/osm-import.js
```
