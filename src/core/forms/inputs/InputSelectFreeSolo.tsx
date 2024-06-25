import { FormArray, FormControl as FormControlType, FormGroup } from 'react-reactive-form';
import { FormControl, InputLabel, MenuItem, Select, Autocomplete, TextField } from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { Color } from '../../../interfaces/Color';



const arrowIcon = () => (
  <svg width="38" height="22" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <svg width="28" height="18" x="10" y="13" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.6664 1.17334C11.6005 1.38801 11.4512 1.53965 11.3007 1.69341C9.64847 3.37876 7.99715 5.06532 6.3479 6.75402C6.14555 6.96138 5.91548 7.0582 5.63862 6.96351C5.5352 6.92819 5.43328 6.85815 5.3555 6.77868C3.64009 5.03152 1.92737 3.28193 0.215843 1.53051C-0.0717466 1.23637 -0.0705537 0.855458 0.211075 0.558581C0.343098 0.41943 0.474525 0.278451 0.618766 0.153002C0.861951 -0.0583138 1.19901 -0.0476556 1.4419 0.165487C1.47915 0.198371 1.51432 0.233996 1.54918 0.269621C2.94243 1.69311 4.33597 3.11629 5.72862 4.54038C5.7608 4.57327 5.78703 4.61194 5.8669 4.67375C5.88865 4.63264 5.90266 4.58362 5.93365 4.55195C7.33912 3.11355 8.74577 1.67636 10.153 0.239782C10.4156 -0.0281683 10.7774 -0.0817585 11.0229 0.138691C11.2733 0.363404 11.5484 0.575024 11.6667 0.916965V1.17304L11.6664 1.17334Z"
        fill="#00ACBA"
        />
    </svg>
  </svg>
);

const filter = createFilterOptions();

export const InputSelectFreeSolo = ({ handler, touched, hasError, meta }: FormArray | FormControlType | FormGroup) => {
  const name = meta.name ?? 'input-name';
  const label = meta.label ?? 'input-label';
  
  const inputElem = handler();
  const defaultOnChange = inputElem.onChange;

  const onChange = (e: React.SyntheticEvent, newValue: unknown) => {
    defaultOnChange(e);
    if (meta.onChange) {
      meta.onChange(newValue);
    }
  }

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
      return meta.required
    }
    return true;
  }

  return meta?.options ? (
    <FormControl className="form-input select" sx={{ width: '100%' }} error={getError()}>
      <Autocomplete
        options={meta?.options}
        getOptionLabel={(option: any) => option.label}
        // filterSelectedOptions
        // filterOptions={(options, params) => {
        //   const filtered = filter(options, params);
        //   const { inputValue } = params;
        //   const isExisting = options.some((option) => inputValue === option.label);
        //   if (inputValue !== '' && !isExisting) {
        //     filtered.push({
        //       id: inputValue,
        //       label: inputValue,
        //       value: inputValue,
        //     });
        //   }
        //   return filtered;
        // }}
        renderInput={
          (params) => <TextField required={isRequired()} helperText={getError() && meta.helperText} color={getColor()} error={getError()} {...params} label={meta.label} placeholder={meta.placeholder} />
        }
        // value={meta.editMode ? meta?.options[meta?.defaultIndex] : undefined}
        onChange={(event: React.SyntheticEvent, newValue: unknown) => { onChange(event, newValue) }}
        freeSolo // Allow free typing
      />
    </FormControl>
  ) : (
    <></>
  );
};
