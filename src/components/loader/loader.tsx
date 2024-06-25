import { Box } from '@material-ui/core';
import CircularProgress from '@mui/material/CircularProgress';

export default function Index() {
  return (
    <Box className="page d-vh-center" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );
}
