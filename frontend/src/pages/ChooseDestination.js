import React, {useState, useRef, useEffect} from 'react';
import { Wrapper } from "@googlemaps/react-wrapper";

const  MyMap = ({setTripInput, response}) => {
    const [map, setMap] = useState();
    const ref = useRef();
    const style = { height: "100vh" }
    
    // add to CSS file later
    const overlayTextStyle = {
        font: "Times New Roman",
        position: 'absolute',
        top: '5px',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#ffffff',
        margin: '20px',
        fontStyle: 'italic'
    };

    
    useEffect(() => {
        console.log(Object.keys(response).length);
    }, [])

    
    const [placesList, setPlacesList] = useState([]);
    // let placesList = Object.keys(response).map((placeName) => ({
    //     placeName: placeName,
    //     latitude: response[placeName].latitude,
    //     longitude: response[placeName].longitude,
    //     description: response[placeName].description,
    //     // for Unsplash
    //     // pictureURL: generateImage(response[placeName]).imageUrl,
    //     // pictureSource: generateImage(response[placeName]).imageAuthor
    //     // // for CustomSearchAPI
    //     // pictureURL: response[placeName].picture,
    //     // pictureSource: response[placeName].pictureSource
    // }));
    
  
    useEffect(() => {
        setMap(new window.google.maps.Map(ref.current, {
            center: {lat: 0, lng: 0},
            zoom: 3
        }));

        const generateImage = async (locationName, count = 5) => {
            const url = `http://localhost:5002/generate_image?location=${encodeURIComponent(locationName)}&count=${count}`;
          
            return fetch(url, {
              method: 'POST',
              headers: { "Content-Type": "application/json" }
            })
              .then(response => response.json())
              .then(data => {
                if (data && Array.isArray(data) && data.length > 0) {
                  const images = data.map(image => ({
                    imageUrl: image[0],
                    imageAuthor: image[1]
                  }));
                  return images;
                } else {
                  console.log('Images not found');
                  return null;
                }
              })
              .catch(error => {
                console.error('Error:', error);
                return null;
              });
          };
          
      
          const generatePlacesList = async () => {
            const generatedPlacesList = await Promise.all(
              Object.keys(response).map(async (placeName) => {
                const imagesData = await generateImage(placeName, 5);
                const images = imagesData.map((imageData) => imageData.imageUrl);
                const pictureURLsHTML = images.map((pictureURL) => `
                    <div style="width: 200px; height: 200px; overflow: hidden; border: 2px solid black; border-radius: 10px;">
                    <img src="${pictureURL}" alt="Image" style="width: 100%; height: 100%; object-fit: cover; object-position: center; border-radius: 8px;">
                    </div>
                `).join('');
                const imageAuthors = imagesData.map((imageData) => imageData.imageAuthor);
          
                return {
                  placeName: placeName,
                  latitude: response[placeName].latitude,
                  longitude: response[placeName].longitude,
                  description: response[placeName].description,
                  imageURLs: pictureURLsHTML,
                  imageAuthors: imageAuthors
                };
              })
            );
          
            console.log(generatedPlacesList);
            setPlacesList(generatedPlacesList);
          };

          generatePlacesList();
    }, []);


    return (
        <>
            <div ref={ref} style={style} id="map" />
            {placesList.map((place) => (
                <Marker
                    key={place.placeName}
                    position={{ lat: Number(place.latitude), lng: Number(place.longitude) }}
                    map={map}
                    content={{name: place.placeName, description: place.description,
                         pictureURLs: place.imageURLs}} 
                />
            ))}
            <div style={overlayTextStyle}> CHOOSE YOUR DESTINATION </div>
        </>
    );
};

const Marker = React.memo( ({ position, map, content }) => {
    const [marker, setMarker] = useState(null);
    const [infoWindow, setInfoWindow] = useState(null);
    
    useEffect(() => {
        const newMarker = new window.google.maps.Marker({});
        const newInfoWindow = new window.google.maps.InfoWindow({
            content: `<div style="margin-bottom: 20px;">
                        <h1>${content.name}</h1>
                        <p style="margin-bottom: 10px;">${content.description}</p>
                        <br>
                        <button id="selectButton" style="margin-bottom: 10px; border-radius: 20px; padding: 10px 20px; color: #000; font-size: 16px; cursor: pointer;">Select</button>
                        <div style="display: flex; justify-content: center; align-items: flex-start; flex-wrap: wrap;">
                            ${content.pictureURLs}
                        </div>
                    </div>`
        });
        
        
        setMarker(newMarker);
        setInfoWindow(newInfoWindow);

        return () => {
            newMarker.setMap(null);
            newInfoWindow.close();
        };
    }, [content]);
  
    useEffect(() => {
        const changeDestination = () => {
            console.log('FUCK');
        };

        if (marker && map) {
            marker.setMap(map);
            marker.setPosition(position);
            const handleClick = () => {
                infoWindow.open(map, marker);
                infoWindow.addListener('domready', () => {
                    const selectButton = document.getElementById('selectButton');
                    if (selectButton) {
                        selectButton.addEventListener('click', changeDestination);
                    }
                });
            };
            marker.addListener('click', handleClick);
        }
        window.google.maps.event.addListener(map, 'click', function() {
            if (infoWindow.getMap()) {
              infoWindow.close();
            }
          });
    }, [marker, map, position, infoWindow]);

  
    return null;
});



const ChooseDestinationPage = ({setTripInput, response}) => {
    return <Wrapper apiKey={process.env.REACT_APP_GMAPS_API_KEY}>
        <MyMap setTripInput={setTripInput} response={response}/>
    </Wrapper>
};

export default ChooseDestinationPage;