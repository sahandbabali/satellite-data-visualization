
const tleLine1 = '1 00902U 64063E   23165.60556257  .00000047  00000+0  57989-4 0  9995';
const tleLine2 = '2 00902  90.2055  51.1520 0018571 170.3974 259.4735 13.52752592707731';


let loaddatabtn = document.getElementById("loaddatabtn")
loaddatabtn.addEventListener("click", (e) => {


    //load txt file
    fetch('/active.txt')
        .then(response => response.text())
        .then(data => {

            // console.log(data)

            // iterate over the data
            const lines = data.split('\n'); // Split the file content into an array of lines
            console.log(lines.length)
            // add number of satellites to ui
            document.getElementById("satcount").innerText = Math.floor(lines.length / 3)


            var j = 0
            for (let i = 0; i < lines.length - 10; i += 3) {
                const line1 = lines[i];
                const line2 = lines[i + 1];
                const line3 = lines[i + 2];
                let coords = calculatecoordinates(line2, line3)
                pinitonmap(coords[0], coords[1], line1, j)
                j++

            }








        })
        .catch(error => {
            console.error('Error:', error);
        });




})

function calculatecoordinates(tleLine1, tleLine2) {

    // Sample TLE data
    // const tleLine1 = '1 00900U 64063C   23165.59706885  .00000655  00000+0  68297-3 0  9993';
    // const tleLine2 = '2 00900  90.1901  47.8093 0028049  16.4697   2.3836 13.74345484920396';

    // Parse the TLE data using satellite.js
    const satrec = satellite.twoline2satrec(tleLine1, tleLine2);

    // Calculate the satellite's position at a specific point in time
    const now = new Date(); // Use the current time or specify a custom time
    const positionAndVelocity = satellite.propagate(satrec, now);

    // Extract the satellite's position coordinates
    const positionEci = positionAndVelocity.position;
    const gmst = satellite.gstime(now);

    // Convert the position from ECI to ECF
    const positionEcf = satellite.eciToEcf(positionEci, gmst);

    // Observer coordinates (example values)
    const observerGd = {
        longitude: 0, // Specify the observer's longitude in degrees (-180 to 180)
        latitude: 0, // Specify the observer's latitude in degrees (-90 to 90)
        height: 0, // Specify the observer's height above the Earth's surface in kilometers
    };

    // Convert the position from ECF to latitude, longitude, and altitude
    const positionGd = satellite.eciToGeodetic(positionEcf, gmst, observerGd);

    // Extract the latitude, longitude, and altitude values
    const latitude = satellite.degreesLat(positionGd.latitude);
    const longitude = satellite.degreesLong(positionGd.longitude);
    const altitude = positionGd.height;

    // Print the satellite's position coordinates
    //  console.log('Latitude:', latitude);
    // console.log('Longitude:', longitude);
    //  console.log('Altitude (km):', altitude);

    return [latitude, longitude]

}




function pinitonmap(x, y, name, j) {

    let jj = processNumber(j)
    let xx = map(y, -180, 180, 0, canvaswidth);
    let yy = map(x, -90, 90, canvaswidth * 0.5, 0);

    noStroke()
    fill(jj, 100, 100)
    circle(xx, yy, 5)

}


function processNumber(input) {
    if (input < 360) {
        return input;
    } else {
        return input % 360;
    }
}


let canvaswidth = document.getElementById("map").clientWidth


function setup() {

    // Create a p5.js canvas
    const canvas = createCanvas(canvaswidth, canvaswidth * 0.5);

    // Attach the canvas to the 'canvas-container' div
    canvas.parent("map");
    colorMode(HSB);

    loadImage('world_map.png', function (img) {
        image(img, 0, 0, canvaswidth, canvaswidth * 0.5);
    });


}

function draw() {
    // Add your drawing code here
    // background(220);

}


