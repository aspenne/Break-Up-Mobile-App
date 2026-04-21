export type HomeStackParamList = {
  HomeMain: undefined;
};

export type MemoriesStackParamList = {
  MemoriesMain: undefined;
  FaceSelection: { editMode?: boolean } | undefined;
  PhotoSwipe: undefined;
  CleanupComplete: { deletedCount: number; keptCount: number };
  MemoryDetail: { memoryId: number };
  DeletionProgress: undefined;
};

export type ChatStackParamList = {
  ChatRooms: undefined;
  ChatRoom: { roomId: number };
  DirectMessage: { peerId: number };
};

export type BlogStackParamList = {
  BlogList: undefined;
  BlogArticle: { articleId: number };
  BlogFavorites: undefined;
};

export type JournalStackParamList = {
  JournalMain: undefined;
  JournalComposeEmotion: undefined;
  JournalComposePrompt: undefined;
  JournalComposeContent: undefined;
  JournalEntryDetail: { entryId: number };
  JournalEntryEdit: { entryId: number };
};

export type TabParamList = {
  HomeTab: undefined;
  MemoriesTab: undefined;
  ChatTab: undefined;
  BlogTab: undefined;
  JournalTab: undefined;
};
