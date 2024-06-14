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
        // Crea una nuova data solo con la data corrente (senza ora)
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        this.events = data.map(event => {
          const eventDate = new Date(event.data);
          // Crea una nuova data solo con la data dell'evento (senza ora)
          const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
          return {
            ...event,
            data: eventDate,
            scaduto: eventDay < today
          };
        });
        console.log('Eventi caricati:', this.events); // Verifica quali eventi sono stati caricati
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
        this.characters = data.filter(character => character.userId === this.currentUser!.id);
      },
      (error) => {
        console.error('Errore nel recupero dei personaggi:', error);
      }
    );
  }

  initEventForms(): void {
    this.eventForms = this.events
      .filter(event => !event.scaduto) // Filtra solo gli eventi non scaduti
      .map(event => {
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
      event.guests.some(guest => guest.userId === selectedCharacter.userId)
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
        console.log(`Personaggio ${selectedCharacter.characterName} iscritto con successo all'evento ${updatedEvent.titolo}.`);
        // Aggiorna l'evento nella lista degli eventi
        this.events = this.events.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev);
      },
      (error) => {
        console.error("Errore durante l'iscrizione:", error);
        // Rimuovi il personaggio aggiunto in caso di errore
        event.guests = event.guests.filter(guest => guest.userId !== selectedCharacter.userId);
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
        console.log(`Personaggio con ID ${guestId} rimosso dall'evento con ID ${eventId}.`);
        // Aggiorna l'evento nella lista degli eventi locali
        this.events = this.events.map(event => event.id === updatedEvent.id ? updatedEvent : event);
        // Aggiorna il form associato all'evento
        const eventForm = this.eventForms.find(form => form.get('event')?.value.id === updatedEvent.id);
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
    const user = this.users.find(u => u.id === userId);
    return user ? user.username : 'Nome Utente';
  }

  // Rimuove gli eventi scaduti dalla lista
  removeExpiredEvents(): void {
    const today = new Date(); // Data odierna senza ora
    today.setHours(0, 0, 0, 0); // Imposta l'ora a mezzanotte per confronti precisi

    this.events = this.events.filter(event => {
      const eventDate = new Date(event.data); // Converte la data dell'evento in oggetto Date
      return eventDate >= today; // Include gli eventi con data uguale o successiva a quella odierna
    });

    console.log('Eventi dopo il filtraggio:', this.events);
    this.initEventForms(); // Aggiorna i form per riflettere gli eventi aggiornati
  }

  // Programma la rimozione quotidiana degli eventi scaduti
  scheduleDailyEventRemoval(): void {
    setTimeout(() => {
      this.removeExpiredEvents();
      console.log("Eventi aggiornati:", this.events);

      // Esegui la rimozione ogni 24 ore dopo la prima esecuzione
      setInterval(() => {
        this.removeExpiredEvents();
        console.log("Eventi aggiornati:", this.events);
      }, 24 * 60 * 60 * 1000); // 24 ore in millisecondi
    }, this.getTimeUntilSpecificTime(24, 0));
  }

  // Calcola il tempo rimanente fino a un orario specifico
  getTimeUntilSpecificTime(hour: number, minute: number): number {
    const now = new Date();
    const specificTime = new Date();
    specificTime.setHours(hour, minute, 0, 0);

    // Se l'orario specificato è già passato per oggi, imposta per domani
    if (specificTime <= now) {
      specificTime.setDate(specificTime.getDate() + 1);
    }

    return specificTime.getTime() - now.getTime();
  }
}
