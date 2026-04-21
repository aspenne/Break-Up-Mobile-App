export type DeletionStage = 'identified' | 'hidden' | 'archived' | 'deleted';

export interface Memory {
  id: number;
  userId: number;
  uri: string;
  thumbnailUri: string | null;
  dateTaken: string | null;
  stage: DeletionStage;
  addedAt: string;
  createdAt: string;
  updatedAt: string | null;
}
