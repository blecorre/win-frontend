import { Box, Stack, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';
import { DISABLE_FEATURES } from '../../config';
import { getGroupMode } from '../../hooks/useAccommodationsAndOffers/helpers';

export const SelectGuestsAndRooms = () => {
  const { watch } = useFormContext();
  const FIELD_WIDTH = '80px';

  const roomCount = watch('roomCount');
  const groupMode = getGroupMode(roomCount);
  const groupModeDisabled = DISABLE_FEATURES;

  return (
    <Stack spacing={2} p={4}>
      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Typography fontWeight="bold">Adults</Typography>
          <Typography variant="caption">18 years or older</Typography>
        </Box>
        <Box width={FIELD_WIDTH}>
          <RHFTextField
            size="small"
            name="adultCount"
            type="number"
            InputProps={{
              type: 'number',
              inputMode: 'numeric',
              inputProps: {
                min: 1
              }
            }}
          />
        </Box>
      </Stack>

      <Stack direction="row" justifyContent="space-between">
        <Box mr={1}>
          <Typography fontWeight="bold">Rooms</Typography>
          {groupMode && (
            <Stack direction={'column'} sx={{ color: 'info.main' }}>
              <Typography variant="caption">{'More than 9 rooms '}</Typography>
              <Typography variant="caption">{'qualifies for a group booking'}</Typography>
            </Stack>
          )}
        </Box>

        <Box width={FIELD_WIDTH}>
          <RHFTextField
            size="small"
            name="roomCount"
            type="number"
            InputProps={{
              inputMode: 'numeric',
              inputProps: {
                min: 1,
                step: 1,
                ...(groupModeDisabled ? { max: 9 } : {})
              }
            }}
          />
        </Box>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Typography fontWeight="bold">Children</Typography>
          <Typography variant="caption">
            We don&apos;t support booking with children yet.
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
};
