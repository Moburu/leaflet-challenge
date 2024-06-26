let map;

const buildMap = () => {
    d3.json('data/all_week.geojson').then((data) => {
        // Color picker
        const colorPicker = (depth) => {
            return (
                depth < 10 ? '#14db42' :
                depth < 30 ? '#bddb14' :
                depth < 50 ? '#dbba14' :
                depth < 70 ? '#db8b14' :
                depth < 90 ? '#db6014' :
                '#db3214'
            )
        }

        // Size picker
        const sizePicker = (mag) => {
            return mag*5
        }

        // Styling function
        const style = (feature) => {
            return {
                color: 'black',
                weight: 0.5,
                fillColor: colorPicker(feature.geometry.coordinates[2]),
                radius: sizePicker(feature.properties.mag),
                fillOpacity: 0.8
            }
        }

        // Set popup content
        const onEachFeature = (feature, layer) => {
            layer.bindPopup(`<p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p><p>(${feature.geometry.coordinates[0]}, ${feature.geometry.coordinates[1]})</p>`)
        }

        // Create map
        map = L.map('map').setView([37.8, -96], 4);

        // Add base layer
        let tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // GeoJSON layer
        let geojson = L.geoJson(data, {
            style: style,
            onEachFeature: onEachFeature,
            pointToLayer: (feature, latlng) => {
                return L.circleMarker(latlng);
            }
        }).addTo(map);

        // Legend
        let legend = L.control({
            position: 'bottomright',
            legends: [{
                label: '-10-10',
                type: 'rectangle',
                color: '#14db42'
            }]
        })

        // Add legend
        legend.onAdd = (map) => {
            const div = L.DomUtil.create('div', 'legend');
            div.innerHTML += '-10-10: #14db42 </br>11-30: #bddb14</br>31-50: #dbba14</br>51-70: #db8b14</br>71-90: #db6014</br>90+: #db3214'
            return div
        }

        legend.addTo(map)
    })
}

buildMap();
