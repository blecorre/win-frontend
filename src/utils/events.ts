import { DateTime } from 'luxon';
import { EventItemProps, upcomingEvents } from '../config';
import { Coordinates } from '../hooks/useAccommodationsAndOffers.tsx/api';
import { NullableDate } from './date';
import { crowDistance } from './geo';

export interface EventSearchParams {
  fromDate: Date;
  toDate: Date;
}

export const datesOverlap = (
  dateRange: EventSearchParams,
  targetDateRange: EventSearchParams
) => {
  const { fromDate: targetFromDate, toDate: targetToDate } = targetDateRange;
  return (
    (dateRange.fromDate <= targetFromDate && dateRange.toDate >= targetFromDate) ||
    (dateRange.fromDate <= targetToDate && dateRange.toDate >= targetToDate)
  );
};

export const getCurrentEvents = (dateRange: EventSearchParams) => {
  return upcomingEvents.filter((evt) => {
    try {
      const eventFromDate = DateTime.fromFormat(
        evt.dateRange.fromDate,
        'd-MM-yyyy'
      ).toJSDate();
      const eventToDate = DateTime.fromFormat(
        evt.dateRange.toDate,
        'd-MM-yyyy'
      ).toJSDate();

      return datesOverlap(dateRange, { fromDate: eventFromDate, toDate: eventToDate });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error parsing upcoming event: ${(error as Error).message}`);
      return false;
    }
  });
};

export const getEventsWithinRadius = (
  events: EventItemProps[],
  centerLatLon: [number, number],
  maxRadius = 3,
  useKm = true
) => {
  return events.filter((evt) => {
    return (
      evt.latlon &&
      crowDistance(
        evt.latlon[0],
        evt.latlon[1],
        centerLatLon[0],
        centerLatLon[1],
        useKm
      ) <= maxRadius
    );
  });
};

export interface CurrentEventsProps {
  fromDate?: NullableDate;
  toDate?: NullableDate;
  center?: Coordinates | null;
  radius?: number;
  focusedEvent?: string | null;
}

// get active events within a radius with optional focused event
export const getCurrentEventsWithinRadius = ({
  fromDate = null,
  toDate = null,
  center = null,
  radius = 3,
  focusedEvent
}: CurrentEventsProps) => {
  const currentEvents =
    fromDate &&
    toDate &&
    // add 1 day swing
    getCurrentEvents({
      fromDate: new Date(new Date(fromDate).setDate(fromDate.getDate() - 1)),
      toDate: new Date(new Date(toDate).setDate(toDate.getDate() + 1))
    });

  if (!currentEvents) return null;

  const focusedEventItem = currentEvents?.find((evt) => evt.name === focusedEvent);

  const initialCenter: [number, number] =
    focusedEventItem?.latlon ?? (center ? [center.lat, center.lon] : [51.505, -0.09]);

  const currentEventsWithinRadius =
    currentEvents && getEventsWithinRadius(currentEvents, initialCenter, radius);

  return { currentEventsWithinRadius, focusedEventItem };
};
