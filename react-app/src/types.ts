export interface Book {
  id: string;
  title: string;
  author: string;
  year: number | string;
  rating: number;
  available: boolean;
}

export type Status = 'idle' | 'loading' | 'success' | 'empty' | 'error';