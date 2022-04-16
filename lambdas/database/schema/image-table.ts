import { Generated, Insertable, Selectable } from 'kysely';

export interface ImageTable {
  id: Generated<string>;
  filename: string;
  mimeType: string;
  processed: boolean;
  url?: string;
  thumbnailsJson?: string;
  createdAt: Generated<string>;
}

export type ImageRow = Selectable<ImageTable>;
export type InsertableImageRow = Insertable<ImageTable>;
