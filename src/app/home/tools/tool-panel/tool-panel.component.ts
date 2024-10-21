import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolModel } from '../tool-model/tool.model';
import { Observable, combineLatest } from 'rxjs';
import { ToolService } from '../tool-service/tool-service';
import { ToolDetailComponent } from '../tool-detail/tool-detail.component';
import { map } from 'rxjs/operators';
import { SearchService } from '../../shared-components/search/search.service';

@Component({
  selector: 'app-tool-panel',
  standalone: true,
  imports: [CommonModule, ToolDetailComponent],
  templateUrl: './tool-panel.component.html',
  styleUrl: './tool-panel.component.css'
})
export default class ToolPanelComponent {

  // Usamos el operador '!' para indicar que estas propiedades serán inicializadas en la función.
  tools!: Observable<ToolModel[]>;
  filteredTools!: Observable<ToolModel[]>;

  // Herramienta actualmente seleccionada, inicializada como null.
  selectedTool: ToolModel | null = null;

  // Control para la visibilidad del modal.
  showModal = false;

  constructor(
    private toolService: ToolService, 
    private searchService: SearchService
  ) {
    this.initializeTools();
    this.initializeFilteredTools();
  }

   // Inicializa el observable 'tools' con los datos obtenidos del servicio ToolService
  private initializeTools() {
    this.tools = this.toolService.getTools().pipe(
      map(tools => tools.map(tool => {
        if (tool.logo) {
          this.toolService.getDownloadUrl(tool.logo).subscribe(url => {
            tool.logo = url;
          });
        }
        return tool;
      }))
    );
  }

  // Configura el observable 'filteredTools' para filtrar las herramientas según el término de búsqueda
  private initializeFilteredTools() {
    this.filteredTools = combineLatest([
      this.tools, 
      this.searchService.currentSearchTerm
    ]).pipe(
      map(([tools, searchTerm]) => {
        // Si el término de búsqueda está vacío, se muestra la lista completa de herramientas
        if (!searchTerm.trim()) {
          return tools;
        }
        // Si hay un término de búsqueda, se aplica el filtro
        return tools.filter(tool => 
          tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tool.detail.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );
  }

  // Maneja la selección de una herramienta y abre el modal
  onToolSelected(tool: ToolModel) {
    this.selectedTool = tool;
    this.openModal();
  }

  // Muestra el modal
  openModal() {
    this.showModal = true;
  }

  // Oculta el modal y limpia la herramienta seleccionada
  closeModal() {
    this.showModal = false;
    this.selectedTool = null;
  }
}