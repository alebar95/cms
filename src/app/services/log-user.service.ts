import { Injectable, OnInit } from '@angular/core';
import { User } from '../api/models';
import { UsersService } from '../api/services';

@Injectable({
  providedIn: 'root'
})
export class LogUserService implements OnInit {

  loggedUser?: User;
  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.getLoggedUser();
  }

  getLoggedUser() {
    //mock: prende sempre l'utente Calvin Candie, per cambiare utente cambiare id qui
    this.userService.getUserById({ userId: 1 }).subscribe({
      next: (res) => {
        this.loggedUser = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

}
