import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Team } from '../interfaces/team';
import { map } from 'rxjs/operators';

export const TeamsTableHeaders = ['name', 'country', 'players'];

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teamsDB: AngularFireList<Team>;

  constructor(private db: AngularFireDatabase) {
    this.teamsDB = this.db.list('/teams', ref => ref.orderByChild('name'));
  }

  getPlayers(): Observable<Player[]> {
    return this.teamsDB.snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => ({ $key: c.payload.key, ...c.payload.val() }));
      })
    );
  }

  addPlaer(player: Player) {
    return this.teamsDB.push(player);
  }

  deletePlayer(id: string) {
    this.db.list('/teams').remove(id);
  }

  editPlayer(newPlayerData) {
    const $key = newPlayerData.$key;
    delete(newPlayerData.$key);
    this.db.list('/teams').update($key, newPlayerData);
  }
}
