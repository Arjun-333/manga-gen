export interface ForumComment {
  id: string;
  post_id: string;
  content: string;
  author: string;
  created_at: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  likes: number;
  comments: ForumComment[];
  attached_project_id?: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  author: string;
  attached_project_id?: string;
}

export interface CreateCommentRequest {
  content: string;
  author: string;
}

export interface ReferenceSheetRequest {
  character_name: string;
  character_description: string;
  art_style: string;
  features: string[];
}
