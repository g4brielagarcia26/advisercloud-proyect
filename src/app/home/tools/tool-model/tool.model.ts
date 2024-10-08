// herramienta.model.ts

//Es una plantilla para las herramientas que usaremos
export interface ToolModel {
    id: number;
    name: string;
    description: string;
    price: number
    //image: string; // Ruta a la imagen de la herramienta
    // Agrega más propiedades según tus necesidades
}