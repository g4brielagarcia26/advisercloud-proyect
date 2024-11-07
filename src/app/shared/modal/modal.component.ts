import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() title: string = ''; // Título del modal
  @Input() showModal: boolean = false; // Estado del modal
  @Output() closeModalEvent = new EventEmitter<void>(); // Evento para cerrar el modal

  closeModal() {
    this.closeModalEvent.emit();
  }

}
