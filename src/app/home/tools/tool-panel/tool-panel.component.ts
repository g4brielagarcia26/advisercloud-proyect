import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolModel } from '../tool-model/tool.model';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { ToolService } from '../tool-service/tool-service';
import { ToolDetailComponent } from '../tool-detail/tool-detail.component';
import { map } from 'rxjs/operators';
import { SearchService } from '../../shared-components/search/search.service';
import { FiltersComponent } from '../../shared-components/filters/filters.component';
import { AuthStateService } from '../../../shared/data-access/auth-state.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tool-panel',
  standalone: true,
  imports: [CommonModule, ToolDetailComponent, FiltersComponent, RouterLink],
  templateUrl: './tool-panel.component.html',
  styleUrl: './tool-panel.component.css'
})
export default class ToolPanelComponent {

  // Observable que contiene una lista de herramientas.
  // El operador '!' indica que esta propiedad será inicializada más adelante.
  tools!: Observable<ToolModel[]>;

  // Observable que contiene una lista filtrada de herramientas según un término de búsqueda.
  filteredTools!: Observable<ToolModel[]>;

  // Observable para el estado de autenticación
  isAuthenticated$!: Observable<boolean>; 

  // Almacena la herramienta actualmente seleccionada. Inicialmente, es null.
  selectedTool: ToolModel | null = null;

  // Controla si el modal está visible o no. Inicialmente, es false (oculto).
  showModal = false;

   // Variable para almacenar si el usuario es administrador o no
   isAdmin: boolean = false; 

   // Flag para la estrella
   isStarClicked = false;

  // BehaviorSubject para gestionar el filtro seleccionado por los botones.
  private selectedFilter = new BehaviorSubject<string>('Todo');

  // BehaviorSubject para gestionar el filtro de subcategorías
  private selectedSubcategories = new BehaviorSubject<string[]>([]);

  constructor(
    // Servicio para manejar datos relacionados con las herramientas
    private toolService: ToolService,
    // Servicio para manejar la búsqueda de herramientas
    private searchService: SearchService,
    // Servicio para manejar el estado de usuario
    private authStateService: AuthStateService
  ) {
    // Inicializa los observables 'tools' y 'filteredTools' al crear la instancia del componente
    this.initializeTools();
    this.initializeFilteredTools();
    // Se transforma el estado de usuario en un booleano
    this.isAuthenticated$ = this.authStateService.authState$.pipe(
      map(user => !!user) // Devuelve true si hay un usuario autenticado
    );
  }

  ngOnInit(): void {
    // Llama a verifyAdminRole para verificar si el usuario es administrador
    this.authStateService.verifyAdminRole().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
      // console.log("isAdmin:" + this.isAdmin);
    });
  }

  // Configura el observable 'tools' para obtener la lista de herramientas del servicio ToolService.
  // Mapea cada herramienta para actualizar su logo si existe.
  private initializeTools() {
    this.tools = this.toolService.getTools().pipe(
      map(tools => tools.map(tool => {
        if (tool.logo) {
          // Si la herramienta tiene un logo, se obtiene su URL de descarga y se actualiza
          this.toolService.getDownloadUrl(tool.logo).subscribe(url => {
            tool.logo = url;
          });
        }
        // Devuelve la herramienta con el logo actualizado (si es aplicable)
        return tool;
      }))
    );
  }

  private initializeFilteredTools() {

    // Combina el observable de herramientas, el término de búsqueda y el filtro seleccionado.
    // Esto asegura que cada vez que cambie cualquiera de estos, el listado de herramientas se actualizará automáticamente.
    this.filteredTools = combineLatest([
      this.tools, // Observable que emite el listado de herramientas.
      this.searchService.currentSearchTerm, // Observable que emite el término de búsqueda ingresado por el usuario.
      this.selectedFilter, // Observable que emite el filtro seleccionado (ej. "Populares", "Gratis", "Pago").
      this.selectedSubcategories
    ]).pipe(
      // Se aplica una transformación a los valores combinados mediante un operador 'map'.
      map(([tools, searchTerm, filter, subcategories]) => {
        let filtered = tools; // Se inicializa con el listado completo de herramientas.

        // Normalizar el término de búsqueda
        // Se elimina cualquier acento o diacrítico del término ingresado
        const normalizedTerm = this.normalizeText(searchTerm.trim());

        // Filtrar por término de búsqueda.
        // Si el término de búsqueda normalizado no está vacío, se filtra el listado de herramientas
        // para mostrar solo aquellas cuyo nombre o detalle incluyan el término ingresado (sin importar mayúsculas/minúsculas o acentos).
        // Filtrar por término de búsqueda
        if (normalizedTerm) {
          filtered = filtered.filter(tool =>
            this.normalizeText(tool.name).toLowerCase().includes(normalizedTerm) ||
            this.normalizeText(tool.detail).toLowerCase().includes(normalizedTerm)
          );
        }

        // Filtrar por categoría seleccionada (Populares, Gratis, Pago) o mostrar Todo.
        switch (filter) {
          case 'Populares':
            // Filtra las herramientas que pertenecen a la categoría "populares".
            filtered = filtered.filter(tool => tool.category === 'populares');
            break;
          case 'Gratis':
            // Filtra las herramientas cuyo precio es 0 (gratuitas).
            filtered = filtered.filter(tool => tool.price === 0);
            break;
          case 'Pago':
            // Filtra las herramientas cuyo precio es mayor a 0 (de pago).
            filtered = filtered.filter(tool => tool.price > 0);
            break;
          default:
            // Si el filtro es "Todo", no se aplica ningún filtro adicional, mostrando todas las herramientas.
            break;
        }

        // Filtrado por subcategorías seleccionadas
        if (subcategories.length > 0) {
          filtered = filtered.filter(tool =>
            subcategories.includes(tool.subcategory)
          );
        }

        // Retorna el listado de herramientas filtradas según los criterios aplicados.
        return filtered;
      })
    );
  }

  // Función para eliminar acentos
  normalizeText(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  clickStar() {
    return this.isStarClicked = !this.isStarClicked;
  }

  // Método para actualizar el filtro de subcategorías
  onSubcategoryFilterChange(subcategories: string[]) {
    this.selectedSubcategories.next(subcategories);
  }

  // Método que se llamará cuando se cambie el filtro en FiltersComponent.
  onFilterChange(filter: string) {
    this.selectedFilter.next(filter); // Actualiza el filtro seleccionado
  }

  // Maneja la acción de seleccionar una herramienta.
  // Actualiza la herramienta seleccionada y muestra el modal.
  onToolSelected(tool: ToolModel) {
    this.selectedTool = tool; // Establece la herramienta seleccionada
    this.openModal(); // Abre el modal
  }

  // Muestra el modal estableciendo la propiedad showModal en true
  openModal() {
    this.showModal = true;
  }

  // Oculta el modal y reinicia la herramienta seleccionada
  closeModal() {
    this.showModal = false; // Oculta el modal
    this.selectedTool = null; // Restablece la herramienta seleccionada a null
  }
}