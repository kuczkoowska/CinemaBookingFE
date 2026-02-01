import {AppRoute} from '@cinemabooking/enums/app-routes';

export interface NavLink {
  readonly label: string;
  readonly route: AppRoute;
}
