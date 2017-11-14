const fs = require('fs');
const kmz = require('./kmz');

console.log(process.argv);

const argv = process.argv;

if (argv.length < 4) {
	exit();
}

const directory = argv[2];
const target = argv[3];

fs.readdir(directory, (err, files) => {
	console.log(files);
	files.forEach(file => {
		if (file.indexOf('kmz') !== -1) {
			const path = `${directory}${file}`;
			const targetPath = `${target}${file}`;

			kmz.toGeoJson(path, (error, geoJson) => {
				const newPath = targetPath.split('.');
				newPath.pop();
				newPath.push('geojson');

				fs.writeFile(newPath.join('.'), JSON.stringify(geoJson), (err) => {
					console.log(err);
				});
			});
		}
	});
});
