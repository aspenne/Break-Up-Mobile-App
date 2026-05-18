export interface User {
  id: number;
  email: string;
  pseudo: string;
  avatarEmoji: string;
  breakupDate: string | null;
  createdAt: string;
  updatedAt: string | null;
  roles?: string[];
}
