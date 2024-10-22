// herramienta.model.ts

//Es una plantilla para las herramientas que usaremos
export interface ToolModel {
    category: string;
    description: string;
    detail: string;
    developedBy: string;
    // images: Array<string>
    logo: string;
    id: string;
    name: string;
    price: number;
    properties: Array<string>;
    subcategory: string;
    video: string;
}
