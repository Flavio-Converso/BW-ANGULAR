import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { iEventi } from '../../interfaces/ieventi';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crea-eventi',
  templateUrl: './crea-eventi.component.html',
  styleUrls: ['./crea-eventi.component.scss']
})
export class CreaEventiComponent implements OnInit {
  eventForm!: FormGroup;
  formSubmitted = false;

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.eventForm = new FormGroup({
      master: new FormControl('', Validators.required),
      titolo: new FormControl('', Validators.required),
      descrizione: new FormControl(''),
      urlImmagine: new FormControl(''),
      data: new FormControl('', Validators.required),
      tipo: new FormControl('', Validators.required),
      numeroGiocatori: new FormControl('', [Validators.required, Validators.min(1)]),
      indirizzo: new FormControl('', Validators.required)
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.eventForm.valid) {
      const newEvent: iEventi = {
        ...this.eventForm.value,
        data: new Date(this.eventForm.value.data) // Converte la data nel formato desiderato
      };

      this.eventService.addEventi(newEvent).subscribe(
        response => {
          console.log('Event created', response);
          this.router.navigate(['/dashboard/eventi-disponibili']);
        },
        error => {
          console.error('Error creating event', error);
        }
      );
    }
  }
}
