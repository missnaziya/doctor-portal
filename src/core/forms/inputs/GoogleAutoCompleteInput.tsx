import { useEffect, useState } from 'react';

import { FieldControl } from 'react-reactive-form';
import { InputAddress } from './InputAddress';
import { Loader } from '@googlemaps/js-api-loader';

declare var window: any;

export const GoogleAutoCompleteInput = ({ uniqueKey, handleAutoCompleteChange, type, required }: any) => {
  const [autoCompleteService, setAutoCompleteService] = useState<any>(undefined);
  const apiKey = 'AIzaSyA5LPLPuL206eVefgmJXn4K7foO5rX6j8s';

  useEffect(() => {
    loadAutoComplete();
  }, []);

  useEffect(() => {
    if (autoCompleteService) {
      autoCompleteService.addListener('place_changed', handleMapChange);
    }
  }, [autoCompleteService]);

  const loadAutoComplete = async () => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      await new Loader({ apiKey, ...{ libraries: ['places'] } }).load();
    }

    const inputHtml: HTMLInputElement = document.querySelector('#' + uniqueKey) as any;

    setAutoCompleteService(
      new window.google.maps.places.Autocomplete(inputHtml, {
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'geometry'],
        types: ['address']
      })
    );
  };

  const handleMapChange = () => {
    const place = autoCompleteService.getPlace();

    let address1 = '';
    let postcode = '';
    let locality = '';
    let short_name = '';
    let country = '';

    for (const component of place.address_components as any[]) {
      const componentType = component.types[0];

      switch (componentType) {
        case 'street_number': {
          address1 = `${component.long_name} ${address1}`;
          break;
        }

        case 'route': {
          address1 += component.short_name;
          break;
        }

        case 'postal_code': {
          postcode = `${component.long_name}${postcode}`;
          break;
        }

        case 'postal_code_suffix': {
          postcode = `${postcode}-${component.long_name}`;
          break;
        }

        case 'locality':
          locality = component.long_name;
          break;

        case 'administrative_area_level_1': {
          short_name = component.short_name;
          break;
        }

        case 'country':
          country = component.long_name;
          break;
      }
    }

    handleAutoCompleteChange({ address1, locality, short_name, postcode, country });
  };

  if (type === 'addFacility') {
    return <FieldControl name="street" render={InputAddress} meta={{ id: uniqueKey, name: 'street', helperText: 'Address 1 is required', label: 'Address 1', placeholder: 'Please Enter Address 1', required: required }} />;
  } else {
    return <FieldControl name="street" render={InputAddress} meta={{ id: uniqueKey, name: 'street', helperText: 'Street is required', label: 'Street', placeholder: 'Please Enter Street' ,required: required}} />;
  }
};
