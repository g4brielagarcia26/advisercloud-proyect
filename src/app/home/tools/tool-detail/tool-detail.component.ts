import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ToolModel } from '../tool-model/tool.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tool-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tool-detail.component.html',
  styleUrl: './tool-detail.component.css'
})
export class ToolDetailComponent {
  @Input() toolData: ToolModel| null = null;  
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
