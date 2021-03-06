import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import debounce from "lodash"

import './App.css';

function App() {
  const [options,setOptions] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [placeDetail, setPlaceDetail] = useState({});

  const getAutocompleteSuggestions = (input) => {
    if(typeof window?.google !== 'object') 
      return;
    
    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions({ input }, (pred, status) => {
  
      if(typeof window?.google !== 'object') 
        return;
  
      if (status != window.google.maps.places.PlacesServiceStatus.OK || !pred || !pred.length) {
        setOptions([]);
        console.log("Autocomplete query status:", status);
      }
      setOptions(pred);

    });

  }

  const getSelectedPlaceInfo = (place) => {
    if(typeof place !== "object" || typeof window?.google !== "object")
      return;

    console.log(place);
    const geocoder = new window.google.maps.Geocoder();

    geocoder
      .geocode({placeId: place.place_id})
      .then((results, status) => {
        console.log(results,status);
        if(results.results){
          setPlaceDetail(results.results[0]);
        }
      });
  };

  useEffect(() => {
    if(typeof inputVal !== "string" || inputVal?.trim() === ""){
      setOptions([]);
      return;
    }
    getAutocompleteSuggestions(inputVal);
  }, [inputVal]);

  /**
   * {
        "description": "4500 68th Street Southeast, Caledonia, MI, USA",
        "matched_substrings": [
            {
                "length": 4,
                "offset": 0
            }
        ],
        "place_id": "ChIJJ1CNhJlLGIgRalC9XvFC9Zc",
        "reference": "ChIJJ1CNhJlLGIgRalC9XvFC9Zc",
        "structured_formatting": {
            "main_text": "4500 68th Street Southeast",
            "main_text_matched_substrings": [
                {
                    "length": 4,
                    "offset": 0
                }
            ],
            "secondary_text": "Caledonia, MI, USA"
        },
        "terms": [
            {
                "offset": 0,
                "value": "4500"
            },
            {
                "offset": 5,
                "value": "68th Street Southeast"
            },
            {
                "offset": 28,
                "value": "Caledonia"
            },
            {
                "offset": 39,
                "value": "MI"
            },
            {
                "offset": 43,
                "value": "USA"
            }
        ],
        "types": [
            "street_address",
            "geocode"
        ]
    }
   */

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Enter location
        </p>
        <Autocomplete
          filterOptions={(a) => a}
          sx={{width: 600}}
          options={options.map(a => a.description)}
          renderInput={(params) => (
            <TextField {...params} label="Add a location" fullWidth />
          )}
          onInputChange={(e) => {
            setInputVal(e.target.value);
          }}
          onChange={(e, value, details) => {
            
            let selOption = options?.filter(a => a.description === value)?.[0] || {};
            getSelectedPlaceInfo(selOption);
          }}
        />
        <div style={{ textAlign: 'left', marginTop: '200px' }}>
          <div style={{}}>
            Full address
          </div>
          <div style={{color: 'grey'}}>
            {placeDetail?.formatted_address}
          </div>
          <div>
            Place type
          </div>
          <div style={{color: 'grey'}}>
            {placeDetail?.types?.join(",")}
          </div>
          <div>
            Coordinates
          </div>
          <div style={{color: 'grey'}}>
            {placeDetail?.geometry?.location?.lat()},{placeDetail?.geometry?.location?.lng()}
          </div>
        </div>

      </header>
    </div>
  );
}

export default App;
