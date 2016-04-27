# National Wildlife Refuge System Map

An interactive web map of National Wildlife Refuges in the United States.  The data used to create the map comes from a public GIS Web Service called [USFWS Primary Visitor Services](http://services.arcgis.com/QVENGdaPbd4LUkLV/ArcGIS/rest/services/FWSVisitorServices/FeatureServer/0).  This application filters out other types of offices like National Fish Hatcheries as to only display wildlife refuges. For more information about the underlying data checkout [data.gov](https://catalog.data.gov/dataset/usfws-primary-visitor-services)).

## Development

This project uses [NodeJS](https://nodejs.org/en/) to create a production ready application.  To build this project you'll need to have NodeJS installed along with [npm](http://npmjs.com/).

Before you get started you'll need to install the project dependencies by running `npm install` in the terminal.

### Development Server

To kick off a development server and all required sub tasks run `npm start`.

### Production Ready build

To create a production ready build of the project run `npm run build`.

### Publish a Demo on GitHub

To publish a demo on GitHub Pages run `npm run publish`.  The demo is available at [usfws.github.io/refuge-map](http://usfws.github.io/refuge-map).

### Inspect Bundle

This project uses [Browserify](http://browserify.org/) to manage/combine project dependencies.  If you're not careful the size of the bundle can get out of control.  To inspect the bundle and the files contributing to filesize run `npm run inspect`, which will allow you to visualize the production ready bundle.

## License

This project is a [U.S. Government work](https://www.usa.gov/government-works).

The United States Fish and Wildlife Service (FWS) GitHub project code is provided on an "as is" basis and the user assumes responsibility for its use. FWS has relinquished control of the information and no longer has responsibility to protect the integrity, confidentiality, or availability of the information. Any reference to specific commercial products, processes, or services by service mark, trademark, manufacturer, or otherwise, does not constitute or imply their endorsement, recommendation or favoring by FWS. The FWS seal and logo shall not be used in any manner to imply endorsement of any commercial product or activity by FWS or the United States Government.
