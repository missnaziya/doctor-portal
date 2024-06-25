import { Autocomplete, FormControl, TextField } from '@mui/material';
import { FormArray, FormControl as FormControlType, FormGroup } from 'react-reactive-form';

import { Color } from '../../../interfaces/Color';
import { Meta } from '../../../interfaces/meta';

export const InputMultiSelect = ({ handler, touched, hasError, meta }: FormArray | FormControlType | FormGroup) => {
  const inputElem = handler();
  const defaultOnChange = inputElem.onChange;

  const onChange = (e: React.SyntheticEvent<Element, Event>, newValue: unknown) => {
    defaultOnChange(e);
    if (meta.onChange) {
      meta.onChange(newValue);
    }
  };

  const getColor = () => {
    if (touched) {
      if (hasError('required')) {
        return Color.ERROR;
      }
      return Color.SUCCESS;
    }
    return Color.PRIMARY;
  };

  const getError = () => {
    if (typeof meta.required != 'undefined' && meta.required === false) {
      return false;
    }

    if (touched) {
      if (hasError('required')) {
        return true;
      }
      return false;
    }

    return false;
  };

  const isRequired = () => {
    if (typeof meta.required != 'undefined') {
      return meta.required;
    }

    return true;
  };

  return meta.options ? (
    <FormControl className="form-input" sx={{ width: '100%' }}>
      <Autocomplete
        multiple
        fullWidth
        options={meta.options}
        getOptionLabel={(option: { label: string }) => option.label}
        filterSelectedOptions
        onChange={(event: React.SyntheticEvent<Element, Event>, newValue: unknown) => {
          onChange(event, newValue);
        }}
        renderInput={(params) => <TextField onMouseDownCapture={(e) => e.stopPropagation()} required={isRequired()} color={getColor()} error={getError()} {...handler()} {...params} label={meta.label} placeholder={meta.placeholder} />}
      />
    </FormControl>
  ) : (
    <></>
  );
};
