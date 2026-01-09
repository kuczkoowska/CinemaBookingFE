import {signalStore, withState} from '@ngrx/signals';
import {Movie} from '@cinemabooking/interfaces/movie';

type BookingState = {
  movie: Movie | undefined;
  isLoading: boolean;
};

const initialState: BookingState = {
  movie: undefined,
  isLoading: false,
};

export const BookingStore = signalStore(withState(initialState));
