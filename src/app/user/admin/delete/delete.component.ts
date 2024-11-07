import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToolModel } from '../../../home/tools/tool-model/tool.model';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css'
})
export default class DeleteComponent {

  @Input() toolData: ToolModel| null = null;  
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<void>(); // Nuevo evento para confirmar el borrado
  
  showConfirmation: boolean = false;
  // Nuevo campo para almacenar el texto ingresado
  enteredName: string = ''; 

  close() {
    this.closeModal.emit();
  }

  confirmDeletion() {
    // Si el texto ingresado coincide con el nombre de la herramienta, emitimos el evento de confirmación
    if (this.enteredName.trim() === this.toolData?.name) {
      this.confirmDelete.emit();
    }
  }

}
