export type Category = 'work' | 'life';

export interface LinkItem {
    id: string;
    title: string;
    url: string;
    category: Category;
    createdAt: number;
}
