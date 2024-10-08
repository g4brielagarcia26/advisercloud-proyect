import { Component, Input, ViewChild } from '@angular/core';
import { ToolBoxComponent } from "../tool-box/tool-box.component";
import { CommonModule } from '@angular/common';
import { ToolModel } from '../tool-model/tool.model';


@Component({
  selector: 'app-tool-panel',
  standalone: true,
  imports: [CommonModule, ToolBoxComponent],
  templateUrl: './tool-panel.component.html',
  styleUrl: './tool-panel.component.css'
})


export default class ToolPanelComponent {

   // Variable para almacenar la herramienta selecciona
  selectedTool: ToolModel | null = null; // Inicialmente, no hay ninguna herramienta seleccionada, por lo que se establece en null.

  // Función que se ejecuta cuando se selecciona una herramienta desde el ToolBoxComponent.
  // Recibe como parámetro un objeto de tipo ToolModel, que es la herramienta seleccionada.
  onToolSelected(tool: ToolModel) {
    this.selectedTool = tool;// Actualiza la variable selectedTool con la herramienta seleccionada.
  }
    


}
