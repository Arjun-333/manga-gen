import json
import os
import uuid
from datetime import datetime
from typing import List, Optional, Dict
from models import ForumPost, ForumComment, CreatePostRequest

FORUM_FILE = "forum.json"

class ForumManager:
    def __init__(self):
        self.file_path = FORUM_FILE
        self._ensure_file()

    def _ensure_file(self):
        if not os.path.exists(self.file_path):
            with open(self.file_path, 'w') as f:
                json.dump({"posts": {}}, f)

    def _load_data(self) -> dict:
        try:
            with open(self.file_path, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
             return {"posts": {}}

    def _save_data(self, data: dict):
        with open(self.file_path, 'w') as f:
            json.dump(data, f, indent=2)

    def create_post(self, request: CreatePostRequest) -> ForumPost:
        data = self._load_data()
        
        post_id = str(uuid.uuid4())
        new_post = ForumPost(
            id=post_id,
            title=request.title,
            content=request.content,
            author=request.author,
            created_at=datetime.now().isoformat(),
            attached_project_id=request.attached_project_id,
            comments=[],
            likes=0
        )
        
        data["posts"][post_id] = new_post.model_dump()
        self._save_data(data)
        return new_post

    def get_posts(self) -> List[ForumPost]:
        data = self._load_data()
        posts = []
        for pdata in data["posts"].values():
            posts.append(ForumPost(**pdata))
        
        # Sort by newest first
        posts.sort(key=lambda x: x.created_at, reverse=True)
        return posts

    def get_post(self, post_id: str) -> Optional[ForumPost]:
        data = self._load_data()
        pdata = data["posts"].get(post_id)
        if pdata:
            return ForumPost(**pdata)
        return None

    def add_comment(self, post_id: str, content: str, author: str) -> Optional[ForumComment]:
        data = self._load_data()
        if post_id not in data["posts"]:
            return None
            
        comment_id = str(uuid.uuid4())
        comment = ForumComment(
            id=comment_id,
            post_id=post_id,
            content=content,
            author=author,
            created_at=datetime.now().isoformat()
        )
        
        # Initialize comments list if checking old data
        if "comments" not in data["posts"][post_id]:
             data["posts"][post_id]["comments"] = []
             
        data["posts"][post_id]["comments"].append(comment.model_dump())
        self._save_data(data)
        return comment
