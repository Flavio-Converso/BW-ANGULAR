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

    this.caricaDatiIniziali();
    this.scheduleDailyEventRemoval();
  }

  caricaDatiIniziali(): void {
    this.caricaEventi();
    this.caricaPersonaggi();
    this.getAllUsers();
  }

  caricaEventi(): void {
    this.eventService.getEventi().subscribe(
      (data: iEventi[]) => {
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        this.events = data.map((event) => {
          const eventDate = new Date(event.data);
          const eventDay = new Date(
            eventDate.getFullYear(),
            eventDate.getMonth(),
            eventDate.getDate()
          );
          return {
            ...event,
            data: eventDate,
            scaduto: eventDay < today,
          };
        });
        console.log('Eventi caricati:', this.events);
        this.initEventForms();
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
    this.eventForms = this.events
      .filter((event) => !event.scaduto)
      .map((event) => {
        return this.fb.group({
          event: event,
          selectedCharacter: new FormControl(null),
          successMessage: new FormControl(''),
          messageType: new FormControl(''),
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
      eventForm
        .get('successMessage')
        ?.setValue(`Hai già un personaggio iscritto all'evento.`);
      eventForm.get('messageType')?.setValue('error');
      console.log(`Hai già un personaggio iscritto all'evento.`);
      setTimeout(() => {
        eventForm.get('successMessage')?.setValue('');
        eventForm.get('messageType')?.setValue('');
      }, 3000);
      return;
    }

    if (!event.guests) {
      event.guests = [];
    }
    event.guests.push(selectedCharacter);

    this.eventService.updateEventi(event.id, event).subscribe(
      (updatedEvent: iEventi) => {
        eventForm
          .get('successMessage')
          ?.setValue(
            `Personaggio ${selectedCharacter.characterName} iscritto con successo all'evento ${updatedEvent.titolo}.`
          );
        eventForm.get('messageType')?.setValue('success');
        console.log(
          `Personaggio ${selectedCharacter.characterName} iscritto con successo all'evento ${updatedEvent.titolo}.`
        );
        this.events = this.events.map((ev) =>
          ev.id === updatedEvent.id ? updatedEvent : ev
        );
        eventForm.get('selectedCharacter')?.setValue(null);

        // Nascondere il messaggio dopo 3 secondi
        setTimeout(() => {
          eventForm.get('successMessage')?.setValue('');
          eventForm.get('messageType')?.setValue('');
        }, 3000);
      },
      (error) => {
        console.error("Errore durante l'iscrizione:", error);
        event.guests = event.guests.filter(
          (guest) => guest.userId !== selectedCharacter.userId
        );
        eventForm
          .get('successMessage')
          ?.setValue("Errore durante l'iscrizione.");
        eventForm.get('messageType')?.setValue('error');
        setTimeout(() => {
          eventForm.get('successMessage')?.setValue('');
          eventForm.get('messageType')?.setValue('');
        }, 3000);
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
        this.events = this.events.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        );
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

  getUserName(userId: number): string {
    const user = this.users.find((u) => u.id === userId);
    return user ? user.username : 'Nome Utente';
  }

  removeExpiredEvents(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.events = this.events.filter((event) => {
      const eventDate = new Date(event.data);
      return eventDate >= today;
    });

    console.log('Eventi dopo il filtraggio:', this.events);
    this.initEventForms();
  }

  scheduleDailyEventRemoval(): void {
    setTimeout(() => {
      this.removeExpiredEvents();
      console.log('Eventi aggiornati:', this.events);

      setInterval(() => {
        this.removeExpiredEvents();
        console.log('Eventi aggiornati:', this.events);
      }, 24 * 60 * 60 * 1000);
    }, this.getTimeUntilSpecificTime(24, 0));
  }

  getTimeUntilSpecificTime(hour: number, minute: number): number {
    const now = new Date();
    const specificTime = new Date();
    specificTime.setHours(hour, minute, 0, 0);

    if (specificTime <= now) {
      specificTime.setDate(specificTime.getDate() + 1);
    }

    return specificTime.getTime() - now.getTime();
  }
}
