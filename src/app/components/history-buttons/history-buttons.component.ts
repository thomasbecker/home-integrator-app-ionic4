import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'history-buttons',
  templateUrl: './history-buttons.component.html',
  styleUrls: ['./history-buttons.component.scss']
})
export class HistoryButtonsComponent {
  @Output() changeHistoryHoursEvent = new EventEmitter<number>();

  constructor() {
  }

  setHistoryHours(hours: number) {
    this.changeHistoryHoursEvent.next(hours);
  }
}
