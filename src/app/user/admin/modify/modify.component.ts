import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modify',
  standalone: true,
  imports: [],
  templateUrl: './modify.component.html',
  styleUrl: './modify.component.css'
})
export default class ModifyComponent {

  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
  

}
