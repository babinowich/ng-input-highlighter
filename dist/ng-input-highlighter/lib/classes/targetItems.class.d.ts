import { MenuItem } from './menuItem.class';
export declare class TargetItem {
    text: string;
    css: string;
    menu?: MenuItem;
    type?: string;
    confidence?: number;
    location?: [number, number];
    constructor(_text: string, _css: string, _menu?: MenuItem, _type?: string, _confidence?: number, _location?: [number, number]);
}
