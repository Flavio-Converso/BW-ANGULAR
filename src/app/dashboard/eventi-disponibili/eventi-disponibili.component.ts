import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { CharactersService } from '../../services/characters.service';
import { AuthService } from '../../auth/auth.service';
import { iEventi } from '../../interfaces/ieventi';
import { iCharacter } from '../../interfaces/icharacter';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { iUsers } from '../../interfaces/iusers';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-eventi-disponibili',
  templateUrl: './eventi-disponibili.component.html',
  styleUrls: ['./eventi-disponibili.component.scss'],
})
export class EventiDisponibiliComponent implements OnInit {


  events: iEventi[] = [];
  characters: iCharacter[] = [];
  eventForms: FormGroup[] = [];
  users: iUsers[] = [];
  currentUser: iUsers | null = null;


  constructor(
    private eventService: EventService,
    private charactersService: CharactersService,
    private authService: AuthService,
    private fb: FormBuilder,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      console.error('Utente non autenticato.');
      return;
    }
    console.log('Utente loggato:', this.currentUser.username);

    this.caricaEventi();
    this.caricaPersonaggi();
    this.getAllUsers();
  }

  caricaEventi(): void {
    this.eventService.getEventi().subscribe(
      (data: iEventi[]) => {
        this.events = data;
        this.initEventForms(); // Inizializza i form per ogni evento
      },
      (error) => {
        console.error('Errore nel recupero degli eventi:', error);
      }
    );
  }

  caricaPersonaggi(): void {
    if (!this.currentUser) {
      console.error('Utente non autenticato.');
      return;
    }

    this.charactersService.getCharactersByUserId(this.currentUser.id).subscribe(
      (data: iCharacter[]) => {
        this.characters = data.filter(
          (character) => character.userId === this.currentUser!.id
        );
      },
      (error) => {
        console.error('Errore nel recupero dei personaggi:', error);
      }
    );
  }

  initEventForms(): void {
    this.eventForms = this.events.map((event) => {
      return this.fb.group({
        event: event,
        selectedCharacter: new FormControl(null),
      });
    });
  }

  iscriviti(eventForm: FormGroup): void {
    const selectedCharacter = eventForm.get('selectedCharacter')?.value;
    const event: iEventi = eventForm.get('event')?.value;

    if (!selectedCharacter) {
      console.error('Nessun personaggio selezionato.');
      return;
    }

    if (
      event.guests &&
      event.guests.some((guest) => guest.userId === selectedCharacter.userId)
    ) {
      console.log(`Hai già un personaggio iscritto all'evento.`);
      return;
    }

    if (!event.guests) {
      event.guests = [];
    }
    event.guests.push(selectedCharacter);

    this.eventService.updateEventi(event.id, event).subscribe(
      (updatedEvent: iEventi) => {
        console.log(
          `Personaggio ${selectedCharacter.characterName} iscritto con successo all'evento ${updatedEvent.titolo}.`
        );
        // Aggiorna l'evento nella lista degli eventi
        this.events = this.events.map((ev) =>
          ev.id === updatedEvent.id ? updatedEvent : ev
        );
      },
      (error) => {
        console.error("Errore durante l'iscrizione:", error);
        // Rimuovi il personaggio aggiunto in caso di errore
        event.guests = event.guests.filter(
          (guest) => guest.userId !== selectedCharacter.userId
        );
      }
    );
  }

  rimuoviIscrizione(eventId: number, guestId: number): void {
    if (!this.currentUser) {
      console.error('Utente non autenticato.');
      return;
    }

    this.eventService.removeGuest(eventId, guestId).subscribe(
      (updatedEvent: iEventi) => {
        console.log(
          `Personaggio con ID ${guestId} rimosso dall'evento con ID ${eventId}.`
        );
        // Aggiorna l'evento nella lista degli eventi locali
        this.events = this.events.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        );
        // Aggiorna il form associato all'evento
        const eventForm = this.eventForms.find(
          (form) => form.get('event')?.value.id === updatedEvent.id
        );
        if (eventForm) {
          eventForm.patchValue({ event: updatedEvent });
        }
      },
      (error) => {
        console.error("Errore durante la rimozione dell'iscrizione:", error);
      }
    );
  }
  //<button *ngIf="currentUser && currentUser.id === guest.userId" (click)="rimuoviIscrizione(eventForm.get('event')?.value.id, guest.id)">Delete</button>

  //
  getAllUsers(): void {
    this.userService.getAllUsers().subscribe(
      (users: iUsers[]) => {
        this.users = users;
      },
      (error) => {
        console.error('Errore nel recupero degli utenti:', error);
      }
    );
  }

  // Funzione per ottenere il nome dell'utente dato l'ID
  getUserName(userId: number): string {
    const user = this.users.find((u) => u.id === userId);
    return user ? user.username : 'Nome Utente';
  }
}
