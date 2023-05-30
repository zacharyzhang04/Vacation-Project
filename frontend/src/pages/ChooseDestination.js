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
        top: '150px',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#ffffff50',
        fontSize: '36px',
        fontWeight: 'bold',
        borderRadius: '5px',
        border: '2px solid #ffffff'
    };

    // Unsplash
    // let imageUrl, imageAuthor;
    // const generateImage = async (locationName) => {
    //     const url = `http://localhost:5002/generate_image?location=${encodeURIComponent(locationName)}`;

    //     await fetch(url)
    //     .then(response => response.json())
    //     .then(data => {
    //     if (data.image_url) {
    //     // Use the generated image URL
    //         console.log(data.image_url);
    //         imageUrl = data.image_url;
    //         imageAuthor = data.image_author;
    //         return 
    //     } else {
    //     // Handle error case
    //         console.log('Image not found');
    //     }
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });
    // };

    console.log(Object.keys(response).length);
    let placesList = Object.keys(response).map((placeName) => ({
        placeName: placeName,
        latitude: response[placeName].latitude,
        longitude: response[placeName].longitude,
        description: response[placeName].description,
        //for CustomSearchAPI
        pictureURL: response[placeName].picture,
        pictureSource: response[placeName].pictureSource
    }));
    
    // Unsplash API
    // generateImage(placesList.placeName);
    // placesList["pictureURL"] = imageUrl;
    // placesList["pictureAuthor"] = imageAuthor;
    // console.log(placesList);
    
  
    useEffect(() => {
        setMap(new window.google.maps.Map(ref.current, {
            center: {lat: 0, lng: 0},
            zoom: 3
        }));
    }, []);
    return (
        <>
            <div ref={ref} style={style} id="map" />
            {placesList.map((place) => (
                <Marker
                    key={place.placeName}
                    position={{ lat: place.latitude, lng: place.longitude }}
                    map={map}
                    content={{name: place.placeName, description: place.description,
                         pictureURL: place.pictureURL, pictureSource: place.pictureSource}} 
                />
            ))}
            <div style={overlayTextStyle}> CHOOSE YOUR DESTINATION </div>
        </>
    );
}

const Marker = ({ position, map, content }) => {
    const [marker, setMarker] = useState(null);
    const [infoWindow, setInfoWindow] = useState(null);
    

    useEffect(() => {
        const newMarker = new window.google.maps.Marker({});
        const newInfoWindow = new window.google.maps.InfoWindow({
            content: `<div>
                        <h1>${content.name}</h1>
                        ${content.description} <br>
                        <figure>
                            <img src=${content.pictureURL} alt="Image" style="max-width: 400px;
                            max-height: 400px;
                            width: auto;
                            height: auto;"/> 
                            <figcaption> Courtesy of ${content.pictureSource}. </figcaption>
                        </figure>
                        <button id="selectButton">Select</button>
                    </div>`
        });
        
        setMarker(newMarker);
        setInfoWindow(newInfoWindow);


        const changeDestination = () => {
            console.log('FUCK');
        };


        newInfoWindow.addListener('domready', () => {
            const selectButton = document.getElementById('selectButton');
            selectButton.addEventListener('click', changeDestination);
        });

        return () => {
            newMarker.setMap(null);
            newInfoWindow.close();
        };
    }, [content]);
  
    useEffect(() => {
        if (marker && map) {
            marker.setMap(map);
            marker.setPosition(position);
            const handleClick = () => {
                infoWindow.open(map, marker);
            };
            marker.addListener('click', handleClick);
        }
    }, [marker, map, position, infoWindow]);
  
    return null;
};


const ChooseDestinationPage = ({setTripInput, response}) => {
    return <Wrapper apiKey={process.env.REACT_APP_GMAPS_API_KEY}>
        <MyMap setTripInput={setTripInput} response={response}/>
    </Wrapper>
};

export default ChooseDestinationPage;