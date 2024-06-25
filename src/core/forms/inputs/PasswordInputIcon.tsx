import { FormArray, FormControl as FormControlType, FormGroup } from 'react-reactive-form';
import { FormControl, InputAdornment, TextField } from '@mui/material';

import { Color } from '../../../interfaces/Color';
import keyIcon from '../../../assets/icons/key.svg';

const PasswordInputIcon = ({ handler, touched, hasError, meta }: FormArray | FormControlType | FormGroup) => {
  const inputElem = handler();
  const id = `password`; //-${uuid()}`

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

  const getHelperText = () => {
    if (touched && hasError('required')) {
      return 'Password is required';
    }
    return '';
  };

  const getEndAdornmentLabel = () => {
    const input = document.getElementById(id) as HTMLInputElement;
    if (input?.type === 'text') {
      return 'Hide';
    }
    return 'Show';
  };

  const EndAdornment = () => {
    const handleType = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      let input = (e.target as HTMLElement)?.parentElement?.parentElement?.querySelector('input');
      input?.blur();
      setTimeout(() => {
        if (input?.type === 'password') {
          input.type = 'text';
          input.focus();
          input?.blur();
        } else {
          if (input) {
            input.type = 'password';
            input.focus();
            input?.blur();
          }
        }
      }, 100);
    };

    return inputElem.value.length > 0 ? (
      <InputAdornment position="start" style={{ cursor: 'pointer' }} onClick={(e) => handleType(e)}>
        {getEndAdornmentLabel()}
      </InputAdornment>
    ) : (
      <InputAdornment position="start"></InputAdornment>
    );
  };

  return (
    <FormControl className="form-input" sx={{ width: '100%' }} variant="filled">
      <div className="icon" style={{ width: 30, height: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={keyIcon} alt="" />
      </div>
      <TextField
        id={id}
        type="password"
        required
        {...inputElem}
        InputLabelProps={{
          shrink: true
        }}
        InputProps={{ endAdornment: <EndAdornment></EndAdornment>, autoComplete: 'off' }}
        error={getError()}
        helperText={getHelperText()}
        color={getColor()}
        fullWidth
        label={meta.label}
        autoComplete={'off'}
      />
    </FormControl>
  );
};

export default PasswordInputIcon;
