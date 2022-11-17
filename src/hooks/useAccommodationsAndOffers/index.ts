import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import {
  filterAccommodationsByPriceRanges,
  getLargestImages,
  sortByLargestImage,
  CoordinatesType
} from '../../utils/accommodation';
import { daysBetween } from '../../utils/date';
import { filterOffersByPriceRanges } from '../../utils/offers';
import { usePriceFilter } from '../usePriceFilter';
import { useUserSettings } from '../useUserSettings';
import { AccommodationsAndOffersResponse, fetchAccommodationsAndOffers } from './api';
import {
  getAccommodationById,
  getActiveAccommodations,
  getOffersById,
  AccommodationWithId,
  getOffersPriceRange
} from './helpers';
import { useAccommodationsAndOffersHelpers } from './useAccommodationsAndOffersHelpers';

export interface SearchTypeProps {
  location: string;
  arrival: Date | null;
  departure: Date | null;
  roomCount: number;
  adultCount: number;
  childrenCount?: number;
  focusedEvent?: string;
}

export interface PriceFormat {
  price: number;
  currency: string;
  decimals?: number;
}

export interface PriceRange {
  lowestPrice: PriceFormat;
  highestPrice: PriceFormat;
}

export interface EventInfo {
  eventName: string;
  distance: number;
  durationInMinutes: number;
}

export type AccommodationTransformFnParams = {
  accommodation: AccommodationWithId;
  searchProps?: SearchTypeProps | void;
  searchResultsCenter?: CoordinatesType;
};

export type AccommodationTransformFn = (
  params: AccommodationTransformFnParams
) => AccommodationWithId;

export const useAccommodationsAndOffers = ({
  searchProps,
  accommodationTransformFn
}: {
  searchProps?: SearchTypeProps | void;
  accommodationTransformFn?: AccommodationTransformFn;
} = {}) => {
  const { preferredCurrencyCode } = useUserSettings();
  const { priceFilter } = usePriceFilter();
  const { data, refetch, error, isLoading, isFetching, isFetched } = useQuery<
    AccommodationsAndOffersResponse | undefined,
    Error
  >(
    ['accommodations-and-offers'],
    async () => {
      if (!searchProps) {
        return;
      }
      return await fetchAccommodationsAndOffers(searchProps);
    },
    {
      enabled: false,
      keepPreviousData: false,
      cacheTime: 25 * 60 * 1000, //25 min expiration
      refetchInterval: 25 * 60 * 1000, //25 min expiration
      staleTime: 25 * 60 * 1000 //25 min expiration
    }
  );

  const { normalizeAccommodations, normalizeOffers } =
    useAccommodationsAndOffersHelpers();

  const latestQueryParams = data?.latestQueryParams;

  // append focusedEvent query params if it exists
  if (latestQueryParams && searchProps?.focusedEvent) {
    latestQueryParams.focusedEvent = searchProps.focusedEvent;
  }

  const isGroupMode = data?.isGroupMode ?? false;

  const normalizedAccommodations = useMemo(
    () => normalizeAccommodations(data?.accommodations, data?.offers),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, preferredCurrencyCode]
  );

  // Get accommodations with active offer along with the offer with lowest price/room/night
  // and an optional "accommodation" object transformation via
  // a transformation callback function
  const allAccommodations = useMemo(() => {
    // This includes accommodations with active offers.
    const filteredAccommodations = normalizedAccommodations.filter(
      (a) => a.offers.length > 0
    );

    const numberOfDays = daysBetween(
      latestQueryParams?.arrival,
      latestQueryParams?.departure
    );

    // attach extra properties to or transform accommodations
    const nbRooms = isGroupMode ? 1 : latestQueryParams?.roomCount ?? 1;
    return filteredAccommodations?.map((accommodation) => {
      // get price ranges in local and preferred currencies
      const priceRange = getOffersPriceRange(
        accommodation.offers,
        true,
        true,
        false,
        numberOfDays,
        nbRooms
      );
      const preferredCurrencyPriceRange = getOffersPriceRange(
        accommodation.offers,
        true,
        true,
        true,
        numberOfDays,
        nbRooms
      );

      // return only high res images
      accommodation.media = getLargestImages(
        sortByLargestImage(accommodation.media ?? [])
      );

      // optional accommodation transformation callback function
      // that can be used to modify or add properties to accommodation object
      let transformedAccommodation = accommodation;
      if (accommodationTransformFn && typeof accommodationTransformFn === 'function') {
        transformedAccommodation = accommodationTransformFn({
          accommodation,
          searchProps: latestQueryParams,
          searchResultsCenter: data?.coordinates
        });
      }

      return { ...transformedAccommodation, priceRange, preferredCurrencyPriceRange };
    });
  }, [
    normalizedAccommodations,
    latestQueryParams,
    isGroupMode,
    accommodationTransformFn,
    data?.coordinates
  ]);

  // apply price filter to accommodations if any before returning accommodations
  const accommodations = useMemo(() => {
    return filterAccommodationsByPriceRanges(allAccommodations, ...priceFilter);
  }, [priceFilter, allAccommodations]);

  // all normalized offers prior to filtering
  const allOffers = useMemo(
    () => data?.offers && normalizeOffers(data.offers, data.accommodations),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, preferredCurrencyCode, normalizeOffers]
  );

  // filter offers array by price from price filter
  const offers = useMemo(
    () => (allOffers && filterOffersByPriceRanges(allOffers, ...priceFilter)) || [],
    [allOffers, priceFilter]
  );

  const getAccommodationByHotelId = useCallback(
    (hotelId: string) => accommodations.find((a) => a.hotelId === hotelId),
    [accommodations]
  );

  return {
    getOffersById,
    getAccommodationById,
    allAccommodations,
    accommodations,
    activeAccommodations: getActiveAccommodations(accommodations, offers),
    coordinates: data?.coordinates,
    allOffers,
    offers,
    refetch,
    error,
    isLoading,
    isFetching,
    latestQueryParams,
    isFetched,
    getAccommodationByHotelId,
    isGroupMode
  };
};
