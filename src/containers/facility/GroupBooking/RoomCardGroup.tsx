import type { RoomTypes } from '@windingtree/glider-types/dist/win';
import type { OfferRecord } from 'src/store/types';
import { Box, Divider, Grid, Stack, TextField, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { RoomInformation } from '../RoomInformation';
import { currencySymbolMap } from '../../../utils/currencies';

export interface FacilityGalleryProps {
  offer: OfferRecord;
  room: RoomTypes;
}

export const RoomCardGroup: React.FC<{
  room: RoomTypes;
  offer: OfferRecord;
  index: number;
  nightCount: number;
}> = ({ offer, room, index, nightCount }) => {
  const { register } = useFormContext();
  const pricePerNight: number = Number(offer.price.public) / nightCount;
  const currencySymbol = currencySymbolMap[offer.price.currency] ?? offer.price.currency;

  return (
    <Box mb={5}>
      <Divider />
      <Box py={5}>
        <Grid container spacing={5}>
          <Grid item xs={8}>
            <RoomInformation room={room} />
          </Grid>
          <Grid item xs={4}>
            <Stack spacing={1} alignItems="flex-end" sx={{ textAlign: 'end' }}>
              <Typography>Select rooms</Typography>
              <TextField
                sx={{ width: 80 }}
                {...register(`offers.${index}.quantity`)}
                size="small"
                type="number"
                InputProps={{
                  type: 'number',
                  inputMode: 'numeric',
                  inputProps: {
                    min: 0
                  }
                }}
              />
              <Typography variant="body2">{`${currencySymbol} ${pricePerNight.toFixed(
                2
              )} / room / night`}</Typography>
              {nightCount > 1 && (
                <Typography variant="body2">{`${currencySymbol} ${offer.price.public} / room / ${nightCount} nights`}</Typography>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
