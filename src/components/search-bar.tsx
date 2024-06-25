import * as React from 'react';
import { makeStyles } from '@material-ui/styles';

import { Box, CircularProgress, FormControl, TextField } from '@mui/material';

import searchIcon from '../../src/assets/icons/search_icon.svg';
import { ChangeEvent } from 'react';

const useStyles = makeStyles((theme) => ({
  textField: {
    '& input::placeholder': {
      lineHeight: 'auto',
      verticalAlign: 'middle',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center'
    },
    '& input:-moz-placeholder': {
      /* Firefox 19+ */ lineHeight: 'auto',
      verticalAlign: 'middle',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center'
    },
    '& input::-moz-placeholder': {
      /* Firefox 4 - 18 */ lineHeight: 'auto',
      verticalAlign: 'middle',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center'
    },
    '& input:-ms-input-placeholder': {
      /* IE 10+ */ lineHeight: 'auto',
      verticalAlign: 'middle',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center'
    }
  }
}));

const SearchBar = (props: { value: string; setValue: (e: ChangeEvent<HTMLInputElement>) => void; autoFocus?: boolean }) => {
  const classes = useStyles();

  const loading = false;

  return (
    <Box className="search-bar-autocomplete">
      <FormControl className="autocomplete form-input" sx={{ width: '100%' }}>
        <TextField
          fullWidth
          label="Type Here to Search..."
          variant="outlined"
          autoFocus={props.autoFocus}
          value={props.value}
          onChange={props.setValue}
          InputProps={{
            autoComplete: 'off',
            endAdornment: <React.Fragment>{loading ? <CircularProgress color="inherit" size={20} /> : <img src={searchIcon} alt="search" height={14} width={18} />}</React.Fragment>
          }}
          autoComplete="off"
        />
      </FormControl>
    </Box>
  );
};

export default SearchBar;
