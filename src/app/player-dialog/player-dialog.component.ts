import { Component, OnInit } from '@angular/core';
import { Countries, SquadNumber } from '../interfaces/players';
import { PlayerService } from '../services/player.service';
import { TeamService } from '../services/team.service';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-player-dialog',
  templateUrl: './player-dialog.component.html',
  styleUrls: ['./player-dialog.component.scss']
})
export class PlayerDialogComponent implements OnInit {
  private team;
  public countries = Object.keys(Countries).map(key => ({ label: key, key: Countries[key] }));
  public squadNumber = Object.keys(SquadNumber)
    .slice(Object.keys(SquadNumber).length / 2)
    .map(key => ({ label: key, key: SquadNumber[key] }));

  constructor(private playerService: PlayerService, private teamsService: TeamService) {}

  ngOnInit() {
    this.teamsService
      .getTeams()
      .pipe(take(1))
      .subscribe(teams => {
        if (teams.length > 0) {
          this.team = teams[0];
        }
      });
  }

  private newPlayer(playerFormatValue) {
    const key = this.playerService.addPlayer(playerFormatValue).key;
    const playerFormatValueKey = {
      ...playerFormatValue,
      key
    };
    const formattedTeam = {
      ...this.team,
      players: [...(this.team.players ? this.team.players : []), playerFormatValueKey]
    };
    this.teamsService.editTeam(formattedTeam);
  }

  onSubmit(playerForm: NgForm) {
    const playerFormValue = { ...playerForm.value };
    if (playerForm.valid) {
      playerFormValue.leftFooted = playerFormValue.leftFooted === '' ? false : playerFormValue.leftFooted;
    }

    this.newPlayer(playerFormValue);
    window.location.replace('#');
  }
}
