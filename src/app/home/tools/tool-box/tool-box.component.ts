import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolModel } from '../tool-model/tool.model';
import { ToolService } from '../tool-service/tool-service'; 
import { Observable } from 'rxjs';


@Component({
  selector: 'app-tool-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tool-box.component.html',
  styleUrl: './tool-box.component.css'
})


export class ToolBoxComponent {
  tools: Observable<ToolModel[]>; // Esta variable almacenará las herramientas de Firestore.

  constructor(private toolService: ToolService) {
    this.tools = this.toolService.getTools(); // Usar el servicio ToolService para obtener los datos de las herramientas
  }
}
