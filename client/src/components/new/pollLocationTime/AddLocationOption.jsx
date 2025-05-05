'use client';
import { useState, useEffect } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
  getDetails,
} from 'use-places-autocomplete';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddLocationOption({ onLocationSubmit, setExpanded }) {
  const [manualEntry, setManualEntry] = useState(false); // Tracks if user wants manual input
  const [suggestionDetails, setSuggestionDetails] = useState({});
  const [useGeneralSearch, setUseGeneralSearch] = useState(false); // Toggles API query type

  const [locationValue, setLocationValue] = useState(''); // Location for return to backend
  const [addressValue, setAddressValue] = useState(''); // Address for return to backend
  const [manualInputValue, setManualInputValue] = useState(''); // To track manual input functionality

  const [gpData, setGPData] = useState({
    name: '',
    address: '',
    street: '',
    city: '',
    locationState: '',
    zip: '',
    latitude: null,
    longitude: null,
    googlePlaceId: '',
    source: '',
  });

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
    requestOptions: {
      types: useGeneralSearch ? [] : ['establishment'], // Switch to general search when typing manually,
      // Bias to a specific region if desired (optional)
      // componentRestrictions: { country: 'us' },
    },
  });

  useEffect(() => {
    const fetchDetailsForSuggestions = async () => {
      const detailsMap = {};
      for (const { place_id } of data) {
        try {
          const details = await getDetails({ placeId: place_id });

          const addressComponents = details.address_components;

          let street = '';
          let city = '';
          let state = '';
          let zip = '';

          addressComponents.forEach((component) => {
            if (component.types.includes('street_number')) {
              street = component.long_name + ' ' + street;
            }
            if (component.types.includes('route')) {
              street += component.long_name;
            }
            if (component.types.includes('locality')) {
              city = component.long_name;
            }
            if (component.types.includes('administrative_area_level_1')) {
              state = component.short_name;
            }
            if (component.types.includes('postal_code')) {
              zip = component.long_name;
            }
          });

          detailsMap[place_id] = {
            name: details.name,
            street,
            cityStateZip: `${city}, ${state} ${zip}`.trim(),
            website: details.website || null,
            phoneNumber: details.international_phone_number || null,
            rating: details.rating || null,
            ratingsCount: details.user_ratings_total || 0,
            businessHours: details.opening_hours?.weekday_text || null,
          };
        } catch (error) {
          console.error('Error fetching suggestion details:', error);
        }
      }
      setSuggestionDetails(detailsMap); // ✅ Store results in state
    };

    if (data.length > 0) {
      fetchDetailsForSuggestions();
    }
  }, [data]);

  const handleLocationChange = (e) => {
    setLocationValue(e.target.value); // This ensures API calls are triggered
    setValue(e.target.value);
  };

  // Handles typing inside the manual entry input
  const handleManualInputChange = (e) => {
    setManualInputValue(e.target.value);
    setAddressValue(e.target.value);
    setValue(e.target.value);
    setUseGeneralSearch(true); // Switch to general address search
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (locationValue.trim()) {
      if (gpData.name === locationValue && gpData.address === addressValue) {
        setExpanded(false);
        onLocationSubmit(gpData);
      } else {
        setExpanded(false);
        onLocationSubmit({
          name: locationValue,
          address: addressValue,
          source: 'manual',
        });
      }
    }
  };

  const handleSelect = async (description, placeId) => {
    setValue(description, false);
    clearSuggestions();

    try {
      // Fetch detailed place info
      const placeDetails = await getDetails({ placeId });

      const placeName = placeDetails.name || description; // Business Name
      const formattedAddress = placeDetails.formatted_address; // Full Address
      const addressComponents = placeDetails.address_components; // Structured Address

      // Extract structured address parts safely
      let street = '';
      let city = '';
      let state = '';
      let zip = '';

      addressComponents.forEach((component) => {
        if (component.types.includes('street_number')) {
          street = component.long_name + ' ' + street;
        }
        if (component.types.includes('route')) {
          street += component.long_name;
        }
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          state = component.short_name; // Use short_name for state codes (e.g., "CA" instead of "California")
        }
        if (component.types.includes('postal_code')) {
          zip = component.long_name;
        }
      });

      const selectedLocation = {
        name: placeName, // Correct name
        address: formattedAddress, // Full formatted address
        street: street, // Extracted Street
        cityStateZip: `${city}, ${state} ${zip}`.trim(), // City, State ZIP
        lat: placeDetails.geometry.location.lat(),
        lng: placeDetails.geometry.location.lng(),
      };

      setLocationValue(selectedLocation.name);
      setAddressValue(selectedLocation.address);

      // FIX THIS TO BE THE LOCATION OBJECT
      setGPData({
        name: selectedLocation.name,
        address: selectedLocation.address,
        street: selectedLocation.street,
        city: city,
        locationState: state,
        zip: zip,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        googlePlaceId: placeId,
        source: 'google',
      });

      console.log('Place Name:', selectedLocation.name);
      console.log('Street Address:', selectedLocation.street);
      console.log('City, State, ZIP:', selectedLocation.cityStateZip);
    } catch (error) {
      console.error('Error getting place details:', error);
    }
  };

  return (
    <div className="flex w-[90%] flex-col items-center mt-5 relative">
      <form onSubmit={handleSubmit} className="w-full relative">
        <input
          type="text"
          value={locationValue}
          onChange={handleLocationChange}
          placeholder="Ex: Dave's Bar"
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="button"
          disabled={locationValue.trim() === ''}
          className={`absolute inset-y-1 right-2 font-medium py-2 px-6 rounded-full shadow bg-rallyBlue hover:bg-rallyBlue ${
            locationValue.trim() === '' ? 'text-gray-50' : 'text-rallyYellow'
          }`}
          style={{ minWidth: '110px', height: '40px' }}
          onClick={handleSubmit}
        >
          Next
        </button>
      </form>

      {/* Manual Entry Input */}
      <li className="p-2 border-b w-full list-none border-gray-300">
        <input
          type="text"
          value={addressValue}
          onChange={handleManualInputChange}
          placeholder="Enter address manually"
          className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </li>

      {/*  Display formatted suggestions */}
      {status === 'OK' && (
        <ul className="absolute w-full left-0 mt-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          {/* Display pre-fetched formatted suggestions */}
          {data.map(({ place_id, description }) => {
            const suggestion = suggestionDetails[place_id]; // Fetch stored details
            return (
              <li
                key={place_id}
                onClick={() => handleSelect(description, place_id)}
                className="cursor-pointer px-4 py-2 hover:bg-rallyYellow border-b border-gray-300"
              >
                {/* Business Name */}
                <span className="block font-semibold text-black">
                  {suggestion ? suggestion.name : description.split(',')[0]}
                </span>

                {/* Street Address */}
                <span className="block text-sm text-gray-700">
                  {suggestion ? suggestion.street : ''}
                </span>

                {/* City, State ZIP */}
                <span className="block text-sm text-gray-500">
                  {suggestion ? suggestion.cityStateZip : ''}
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {/* If manual entry is selected, show an input box */}
      {manualEntry && (
        <div className="w-full mt-2">
          <input
            type="text"
            placeholder="Enter full address"
            className="w-full border border-gray-300 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            className="w-full mt-2 bg-blue-500 text-white p-2 rounded-lg"
            onClick={() => onLocationSubmit({ description: value })}
          >
            Use this address
          </button>
        </div>
      )}
    </div>
  );
}
