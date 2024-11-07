// herramienta.model.ts

//Es una plantilla para las herramientas que usaremos
export interface ToolModel {
    category: string;
    description: string;
    detail: string;
    id: string;
    images: Array<string>
    isFavorite: boolean;
    logo: string;
    name: string;
    price: number;
    properties: Array<string>;
    subcategory: string;
    video: string;
}
