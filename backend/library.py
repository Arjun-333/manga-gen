import json
import os
import uuid
from datetime import datetime
from typing import List, Dict, Optional
from models import Project, ProjectSummary, ScriptResponse, Panel, CharacterProfile

PROJECTS_FILE = "projects.json"

class ProjectManager:
    def __init__(self):
        self.file_path = PROJECTS_FILE
        self._ensure_file()

    def _ensure_file(self):
        if not os.path.exists(self.file_path):
            with open(self.file_path, 'w') as f:
                json.dump({}, f)

    def _load_data(self) -> Dict[str, dict]:
        try:
            with open(self.file_path, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {}

    def _save_data(self, data: Dict[str, dict]):
        with open(self.file_path, 'w') as f:
            json.dump(data, f, indent=2)

    def save_project(self, project: Project) -> str:
        data = self._load_data()
        
        # If new project, generate ID
        if not project.id:
            project.id = str(uuid.uuid4())
            project.created_at = datetime.now().isoformat()
        
        project.updated_at = datetime.now().isoformat()
        
        # Convert Pydantic to dict
        data[project.id] = project.model_dump()
        self._save_data(data)
        return project.id

    def get_project(self, project_id: str) -> Optional[Project]:
        data = self._load_data()
        project_dict = data.get(project_id)
        if not project_dict:
            return None
        return Project(**project_dict)

    def get_all_projects(self) -> List[ProjectSummary]:
        data = self._load_data()
        summaries = []
        for pid, pdata in data.items():
            # Get thumbnail (first generated image or None)
            thumbnail = None
            if pdata.get("images"):
                # Get first value from dict
                thumbnail = next(iter(pdata["images"].values()), None)
            
            # Defensive check for title
            title = "Untitled Story"
            if "script" in pdata and "title" in pdata["script"]:
                 title = pdata["script"]["title"]
            elif "title" in pdata:
                 title = pdata["title"]

            summaries.append(ProjectSummary(
                id=pid,
                title=title,
                updated_at=pdata.get("updated_at", datetime.now().isoformat()),
                thumbnail_url=thumbnail,
                panel_count=len(pdata.get("images", {}))
            ))
        
        # Sort by updated_at desc
        summaries.sort(key=lambda x: x.updated_at, reverse=True)
        return summaries

    def delete_project(self, project_id: str) -> bool:
        data = self._load_data()
        if project_id in data:
            del data[project_id]
            self._save_data(data)
            return True
        return False
