import { Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolModel } from '../tool-model/tool.model';
import { Observable } from 'rxjs';
import { ToolService } from '../tool-service/tool-service'; 
import { ToolDetailComponent } from '../tool-detail/tool-detail.component';

@Component({
  selector: 'app-tool-panel',
  standalone: true,
  imports: [CommonModule, ToolDetailComponent],
  templateUrl: './tool-panel.component.html',
  styleUrl: './tool-panel.component.css'
})
export default class ToolPanelComponent {

  // Lista de herramientas obtenidas de Firebase
  tools: Observable<ToolModel[]>;
  
  // Variable para almacenar la herramienta selecciona
  selectedTool: ToolModel | null = null; // Inicialmente, no hay ninguna herramienta seleccionada, por lo que se establece en null.

  // Inyecta el servicio ToolService en el constructor
  constructor(private toolService: ToolService) {
    
    // Obtén las herramientas desde Firebase
    this.tools = this.toolService.getTools();
  }

  // Función que se ejecuta cuando se selecciona una herramienta desde el ToolBoxComponent.
  // Recibe como parámetro un objeto de tipo ToolModel, que es la herramienta seleccionada.
  onToolSelected(tool: ToolModel) {
    this.selectedTool = tool;// Actualiza la variable selectedTool con la herramienta seleccionada.
  }

  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
