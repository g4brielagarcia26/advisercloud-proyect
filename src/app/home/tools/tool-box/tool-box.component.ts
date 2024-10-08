import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolModel } from '../tool-model/tool.model';


@Component({
  selector: 'app-tool-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tool-box.component.html',
  styleUrl: './tool-box.component.css'
})


export class ToolBoxComponent {


  @Output() toolSelected = new EventEmitter<ToolModel>();  // Define un evento de salida (Output) llamado toolSelected, que emitirá datos del tipo ToolModel. 
  // Esto permitirá que el componente padre pueda "escuchar" cuando se seleccione una herramienta.


  //Lista de Herramientas de Prueba
  toolList: ToolModel[] = [
    { id: 1, name: 'Visual Studio Code', description: 'IDE creado por Microsoft', price: 0 },
    { id: 2, name: 'Google Chrome', description: 'Navegador creado por Google', price: 0 },
    { id: 3, name: 'Skype', description: 'Software de comunicaciones propietario distribuido por Microsoft', price: 0 },
    // ... otras posibles herramientas
  ];

   // Función que se ejecuta cuando se selecciona una herramienta.
  // Recibe como parámetro un objeto de tipo ToolModel (la herramienta seleccionada) y emite el evento toolSelected con esta herramienta.
  selectTool(Tool: ToolModel) {
    this.toolSelected.emit(Tool);
  }

}
