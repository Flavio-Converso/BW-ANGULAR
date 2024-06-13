import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { iEventi } from '../../interfaces/ieventi';

@Component({
  selector: 'app-eventi-disponibili',
  templateUrl: './eventi-disponibili.component.html',
  styleUrls: ['./eventi-disponibili.component.scss']
})
export class EventiDisponibiliComponent implements OnInit {
  events: iEventi[] = [];

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.eventService.getEventi().subscribe((data: iEventi[]) => {
      this.events = data;
    }, error => {
      console.error('Errore nel recupero degli eventi:', error);
    });
  }
}
