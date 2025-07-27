export interface Article {
  id: number;
  title: string;
  summary: string;
  fullContent: string;
  source: string;
  lang: 'en' | 'es';
  imageUrl: string;
  url: string;
}
