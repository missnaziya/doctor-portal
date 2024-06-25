import { FormArray, FormControl as FormControlType, FormGroup } from 'react-reactive-form';
import { FormControl, TextField } from '@mui/material';

import { Color } from '../../../interfaces/Color';
import emailIcon from '../../../assets/icons/email.svg';

const EmailInputIcon = ({ handler, touched, hasError, meta }: FormArray | FormControlType | FormGroup) => {
  const inputElem = handler();
  const id = `email`;

  const getColor = () => {
    if (touched) {
      if (hasError('required') || hasError('email')) {
        return Color.ERROR;
      }
      return Color.SUCCESS;
    }
    return Color.PRIMARY;
  };

  const getHelperText = () => {
    if (touched && hasError('required')) {
      return 'Email/Username is required';
    } else if (touched && hasError('email')) {
      return 'Invaild Email';
    }
    return '';
  };

  const getError = () => {
    return touched && (hasError('required') || hasError('email'));
  };

  return (
    <FormControl className="form-input" sx={{ width: '100%' }} variant="filled">
      <div className="icon" style={{ width: 30, height: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={emailIcon} alt="email" width={20} />
      </div>
      <TextField
        id={id}
        type="text"
        required
        {...inputElem}
        InputLabelProps={{
          shrink: true
        }}
        error={getError()}
        helperText={getHelperText()}
        color={getColor()}
        fullWidth
        label={meta.label}
        autoComplete={'off'}
        disabled={meta.disabled}
      />
    </FormControl>
  );
};

export default EmailInputIcon;
