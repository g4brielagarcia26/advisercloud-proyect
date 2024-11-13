import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ToolService } from '../../../home/tools/tool-service/tool-service';
import { ToolModel } from '../../../home/tools/tool-model/tool.model';
import { toast } from 'ngx-sonner';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export default class CreateComponent {

  @Output() closeModal = new EventEmitter<void>();

  // Estructuras temporales para almacenar archivos seleccionados
  selectedImages: File[] = [];
  selectedLogo: File | null = null;

  // Inicializar el FormGroup con todos los controles
  createToolForm = new FormGroup({
    name: new FormControl('', Validators.required),
    detail: new FormControl(''),
    description: new FormControl(''),
    properties: new FormArray([]), // FormArray para propiedades
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    subcategory: new FormControl('', Validators.required),
    video: new FormControl('', Validators.pattern('https?://.*')),
    images: new FormControl<string[]>([]), // Control para almacenar las imágenes
    logo: new FormControl('') // Control para almacenar el logo
  });

  propertyInput = new FormControl('');

  constructor(
    private toolService: ToolService
  ) {}

  // Getter para acceder al FormArray `properties`
  get properties() {
    return this.createToolForm.get('properties') as FormArray;
  }

  // Agregar una característica al presionar Enter
  addProperty(event: Event): void {
    event.preventDefault();
    const value = this.propertyInput.value?.trim() || '';
    if (value && this.properties.length < 6) {
      this.properties.push(new FormControl(value));
      this.propertyInput.reset();
    }
  }

  // Eliminar una característica por índice
  removeProperty(index: number): void {
    this.properties.removeAt(index);
  }

  // Emitir el vento de cierre del modal
  close() {
    this.closeModal.emit();
  }

  // Validaciones para las imágenes y los logos
  onFileSelected(event: Event, field: string) {

    const input = event.target as HTMLInputElement;
    
    // (!input.files) Valida que la propiedad files existe.
    // (fileSelected.length === 0) Valida que hay archivos dentro del objeto files. 
    if (!input.files || input.files.length === 0) {
      toast.error("No has seleccionado ningun archivo.");
      return;
    }

    const fileSelected: FileList = input.files;

    if (field === 'logos') {

      const file = fileSelected[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
      // Validar tipo de archivo para el logo
      if (fileExtension !== 'svg' && fileExtension !== 'png') {
        toast.error('El logo debe ser un archivo con extensión SVG o PNG.');
        input.value = ''; // Limpia el campo de archivo
        return;
      }

      // Almacena el archivo en la variable temporal
      this.selectedLogo = file;

    } else if (field === 'images') {

      // Validación: máximo 3 imágenes
      if (fileSelected.length > 3) {
        toast.error('Solo se pueden subir un máximo de tres imágenes.');
        input.value = ''; // Limpia el campo de archivo
        return;
      }

    const validFiles: File[] = [];

    for (let i = 0; i < fileSelected.length; i++) {
      const file = fileSelected[i];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      // Validar tipo de archivo para las imágenes
      if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
        validFiles.push(file);
      } else {
        toast.error(`El archivo ${file.name} no tiene un formato válido (solo JPG, JPEG o PNG).`);
      }
    }

    // Almacena solo los archivos válidos en la variable temporal
    if (validFiles.length > 0) {
      this.selectedImages = validFiles;
    } else {
      this.selectedImages = []; // Limpia la lista si ninguna imagen es válida
    }
  }
}

  // Función para subir archivos al Firebase Storage.
  /*
  * Llama al método `uploadFile` del servicio `ToolService` para subir el archivo al Storage.
  * Una vez subido, actualiza el formulario (`createToolForm`) con la URL del archivo:
  * - Si es un logo actualiza el campo `logo`.
  * - Si es una imagen agrega la URL al array de imágenes del campo `images`.
  */
  uploadFile(file: File, filePath: string, field: string) {

    // Llama al servicio para subir el archivo
    this.toolService.uploadFile(file, filePath).subscribe(
      (url: string) => {
        console.log(`${field} subido con éxito. URL: `, url);

        if (field === 'logos') {
          // Actualiza el campo `logo` del formulario con la URL del archivo subido
          this.createToolForm.patchValue({
            logo: url,
          });
        } else if (field === 'images') {
          // Obtiene las imágenes existentes en el formulario y agrega la nueva URL
          const currentImages = this.createToolForm.get('images')?.value || [];
          this.createToolForm.patchValue({
            images: [...currentImages, url],
          });
        }
      },
      (error) => {
        // Maneja errores de subida mostrando un mensaje al usuario
        console.log(error);
        toast.error(`Error al subir el archivo: ${field}`);
      }
    );
  }

  saveTool(): void {

    // Verifica si el formulario es válido
    if (this.createToolForm.invalid) {
      toast.error("Por favor, completa todos los campos requeridos.");
      return;
    }

    // Subir los archivos seleccionados al Storage
    const uploadFinalFile: Observable<string>[] = [];

    // Subir el logo si está seleccionado
    if (this.selectedLogo) {
      const logoPath = `logos/${this.selectedLogo.name}`;
      uploadFinalFile.push(this.toolService.uploadFile(this.selectedLogo, logoPath));
    }

    // Subir las imágenes si están seleccionadas
    this.selectedImages.forEach((image) => {
      const imagePath = `images/tools/${image.name}`;
      uploadFinalFile.push(this.toolService.uploadFile(image, imagePath));
    });

    // Esperar a que se suban todos los archivos antes de guardar la herramienta
    forkJoin(uploadFinalFile).subscribe({
      next: (urls) => {
        // Asignar las URLs de los archivos subidos al formulario
        const logoUrl = this.selectedLogo ? urls.shift() : '';
        const imageUrls = urls; // Resto de las URLs son imágenes

        this.createToolForm.patchValue({
          logo: logoUrl,
          images: imageUrls,
        });

        // Construir y guardar la herramienta
        const newTool = this.buildTool();

        // Llamar al servicio para guardar la herramienta
        this.toolService.addTool(newTool).subscribe({
          next: () => {
            toast.success("Herramienta creada con éxito.");
            this.createToolForm.reset(); // Reinicia el formulario
            this.close(); // Cierra el modal 
          },
          error: () => {
            toast.error("Hubo un error al guardar la herramienta.");
          },
        });
      },
      error: () => {
        toast.error("Error al subir los archivos.");
      },
    });
  }

  // Construye un objeto ToolModel a partir de los datos del formulario.
  buildTool(): ToolModel {
    return {
      id: '', // Firebase asignará un ID automáticamente
      name: this.createToolForm.get('name')?.value || '',
      detail: this.createToolForm.get('detail')?.value || '',
      description: this.createToolForm.get('description')?.value || '',
      properties: this.properties.value || [],
      price: this.createToolForm.get('price')?.value || 0,
      subcategory: this.createToolForm.get('subcategory')?.value || '',
      video: this.createToolForm.get('video')?.value || '',
      images: this.createToolForm.get('images')?.value || [],
      logo: this.createToolForm.get('logo')?.value || '',
      isFavorite: false,
      category: '',
    };
  }
}