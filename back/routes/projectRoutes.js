const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const projectsFilePath = path.join(__dirname, '../data/projects.json');
const tasksFilePath = path.join(__dirname, '../data/tasks.json');

let initProjectId = 1;
let initTaskId = 1;

// Project Id auto increment
function nextProjectId(currentId){
  const projects = loadData(projectsFilePath);
  while(true){
    if(projects.some((p) => p.id === currentId)) {
      currentId++;
      continue;
    };
    break;
  }
  return currentId;
}
// Task Id auto increment
function nextTaskId(currentId){
  const tasks = loadData(tasksFilePath);
  while(true){
    if(tasks.some((p) => p.id === currentId)) {
      currentId++;
    };
    break;
  }
  return currentId;
}

// 데이터 로드 함수
function loadData(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// 데이터 저장 함수
function saveData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// 프로젝트 생성
router.post('/', (req, res) => {
  const { title, description } = req.body;
  const projects = loadData(projectsFilePath);
  const newProject = { id: nextProjectId(initProjectId), title, description, tasks: [] };
  projects.push(newProject);
  saveData(projectsFilePath, projects);
  res.status(201).json(newProject);
});

// 프로젝트 목록 조회
router.get('/', (req, res) => {
  const projects = loadData(projectsFilePath);
  res.json(projects);
});

// 프로젝트 상세 조회
router.get('/:projectId', (req, res) => {
  const projects = loadData(projectsFilePath);
  const tasks = loadData(tasksFilePath);
  const project = projects.find((p) => p.id === req.params.projectId);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const projectTasks = tasks.filter((t) => t.pjId === project.id);
  const TaskIds = projectTasks.map((t) => t.id);
  res.json({ ...project, tasks: TaskIds });
});

// 프로젝트 삭제
router.delete('/:projectId', (req, res) => {
  const projects = loadData(projectsFilePath);
  const tasks = loadData(tasksFilePath);
  const projectIndex = projects.findIndex((p) => p.id === req.params.projectId);

  if (projectIndex === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const hasTasks = tasks.some((t) => t.pjId === projects[projectIndex].id);
  if (hasTasks) {
    return res.status(400).json({ error: 'Cannot delete project with tasks' });
  }

  projects.splice(projectIndex, 1);
  saveData(projectsFilePath, projects);
  res.json({ message: 'Project deleted successfully' });
});

router.post('/:projectId/tasks', (req, res) => {
  const {title, description, priority, dueDate} = req.body;
  const projects = loadData(projectsFilePath);
  const tasks = loadData(tasksFilePath);
  const newTask = {pjId: req.params.projectId, id: nextTaskId(initTaskId), title, description, priority, dueDate, status:"not-started"}
  tasks.push(newTask);
  saveData(tasksFilePath, tasks);

  const findProject = projects.find((p) => p.id === req.params.projectId);
  if (!findProject) {
    return res.status(404).json({ error: 'Project not found' });
  }
  findProject.tasks.push(newTask.id);

  saveData(projectsFilePath, projects)

  res.json(newTask)
})

router.get("/:projectId/tasks", (req, res) => {
  const project = loadData(projectsFilePath).find((p) => p.id === req.params.projectId);
  if(!project){
    return res.status(404).json({ error: 'Project not found' });
  }
  const tasks = loadData(tasksFilePath).filter((t) => t.pjId === req.params.projectId);
  res.json(tasks);
})

router.put('/:projectId/tasks/:tasksId', (req, res) => {
  const {title, priority, dueDate, status} = req.body;
  const tasks = loadData(tasksFilePath);
  const taskIndex = tasks.findIndex((t) => String(t.id) === req.params.tasksId && t.pjId === req.params.projectId);
  if(taskIndex == -1){
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks[taskIndex] = {...tasks[taskIndex], title, priority, dueDate, status};
  saveData(tasksFilePath, tasks);
  res.json(tasks[taskIndex]);
})

router.delete('/:projectId/tasks/:taskId', (req, res) => {
  const tasks = loadData(tasksFilePath);
  const projects = loadData(projectsFilePath);
  const taskIndex = tasks.findIndex((t) => String(t.id) === req.params.taskId && t.pjId === req.params.projectId);
  if(taskIndex == -1){
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks.splice(taskIndex, 1);
  saveData(tasksFilePath, tasks);

  const project = projects.find((p) => String(p.id) === req.params.projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  project.tasks = project.tasks.filter((id) => String(id) !== req.params.taskId);
  saveData(projectsFilePath, projects);

  res.json({ message: 'Task deleted successfully' });
})

module.exports = router;