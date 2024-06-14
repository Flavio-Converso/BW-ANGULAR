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

  constructor(
    private eventService: EventService,
    private charactersService: CharactersService,
    private authService: AuthService,
    private fb: FormBuilder,
    private userService: UsersService,
  ) {}

  ngOnInit(): void {
    this.caricaEventi();
    this.caricaPersonaggi();
    this.getAllUsers();
    this.scheduleDailyEventRemoval();
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
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('Utente non autenticato.');
      return;
    }

    this.charactersService.getCharactersByUserId(currentUser.id).subscribe(
      (data: iCharacter[]) => {
        this.characters = data.filter(character => character.userId === currentUser.id);
      },
      (error) => {
        console.error('Errore nel recupero dei personaggi:', error);
      }
    );
  }

  initEventForms(): void {
    this.eventForms = this.events.map(event => {
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

    if (event.guests && event.guests.some(guest => guest.userId === selectedCharacter.userId)) {
      console.log(`Il personaggio ${selectedCharacter.characterName} è già iscritto all'evento.`);
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
        console.error('Errore durante l\'iscrizione:', error);
        // Rimuovi il personaggio aggiunto in caso di errore
        event.guests = event.guests.filter(guest => guest.userId !== selectedCharacter.userId);
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

  // Funzione per ottenere il nome dell'utente dato l'ID
  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.username : 'Nome Utente';
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
  removeExpiredEvents(): void {
    const today = new Date(); // Data odierna senza ora
    today.setHours(0, 0, 0, 0); // Imposta l'ora a mezzanotte per confronti precisi

    this.events = this.events.filter(event => {
      const eventDate = new Date(event.data); // Converte la data dell'evento in oggetto Date
      return eventDate >= today; // Include gli eventi con data uguale o successiva a quella odierna
    });

    console.log('Eventi dopo il filtraggio:', this.events);
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
}
