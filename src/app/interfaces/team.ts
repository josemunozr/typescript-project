import { Player, Countries } from './players';

export interface Team {
  $key?: string;
  name: string;
  country: Countries;
  players: Player[];
}
