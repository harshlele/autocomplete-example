import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import debounce from "lodash"

import './App.css';

function App() {
  const [options,setOptions] = useState([]);
  const [inputVal, setInputVal] = useState("");

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

  useEffect(() => {
    if(typeof inputVal !== "string" || inputVal?.trim() === ""){
      setOptions([]);
      return;
    }
    getAutocompleteSuggestions(inputVal);
  }, [inputVal]);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Enter location
        </p>
        <Autocomplete
          filterOptions={(a) => a}
          sx={{width: 600}}
          options={options.map(o => o.description)}
          renderInput={(params) => (
            <TextField {...params} label="Add a location" fullWidth />
          )}
          onInputChange={(e) => {
            setInputVal(e.target.value);
          }}
        />
      </header>
    </div>
  );
}

export default App;
