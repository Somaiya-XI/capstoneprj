import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

const DashboardHeader = () => {
  return (
    <Card sx={{ p: 3 }}>
    <OutlinedInput
      defaultValue=""
      fullWidth
      placeholder="Search Products"
      startAdornment={(
        <InputAdornment position="start">
          <SvgIcon
            color="action"
            fontSize="small"
          >
            <MagnifyingGlassIcon />
          </SvgIcon>
        </InputAdornment>
      )}
      sx={{ maxWidth: 400 }}
    />
  </Card>
    
  )
}

export default DashboardHeader
