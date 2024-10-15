import { Component, EventEmitter, inject, Output } from '@angular/core';

@Component({
  selector: 'app-tool-detail',
  standalone: true,
  imports: [],
  templateUrl: './tool-detail.component.html',
  styleUrl: './tool-detail.component.css'
})
export class ToolDetailComponent {
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
