import { FormArray, FormControl as FormControlType, FormGroup } from 'react-reactive-form';
import { FormControl, InputAdornment, TextField } from '@mui/material';

import { Color } from '../../../interfaces/Color';
import keyIcon from '../../../assets/icons/key.svg';

const PasswordInputIconlogin = ({ handler, touched, hasError, meta }: FormArray | FormControlType | FormGroup) => {
  const inputElem = handler();

  const getColor = () => {
    if (touched) {
      if (hasError('required') || hasError('pattern')) {
        return Color.ERROR;
      }
      return Color.SUCCESS;
    }
    return Color.PRIMARY;
  };

  const getError = () => {
    if (touched) {
      if (hasError('required') || hasError('pattern')) {
        return true;
      }
      return false;
    }

    return false;
  };

  const getHelperText = () => {
    if (touched && hasError('required')) {
      return meta.helperText;
    } else if (hasError('pattern')) {
      return meta.helperText;
    } else {
      return '';
    }
  };

  const EndAdornment = () => {
    const handleType = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      let input = (e.target as HTMLElement)?.parentElement?.parentElement?.querySelector('input');
      if (input?.type === 'password') {
        input.type = 'text';
        (e.target as HTMLElement).innerHTML = 'Hide';
      } else {
        if (input) {
          input.type = 'password';
        }
        (e.target as HTMLElement).innerHTML = 'Show';
      }
    };

    return inputElem.value.length > 0 ? (
      <InputAdornment position="start" style={{ cursor: 'pointer' }} onClick={(e) => handleType(e)}>
        Show
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
      <TextField type="password" required {...inputElem} error={getError()} helperText={getHelperText()} color={getColor()} fullWidth label={meta.label} autoComplete={'off'} />
    </FormControl>
  );
};

export default PasswordInputIconlogin;
