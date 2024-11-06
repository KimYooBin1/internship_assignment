const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const projectsFilePath = path.join(__dirname, '../data/projects.json');
const tasksFilePath = path.join(__dirname, '../data/tasks.json');

// TODO : application 실행시 id값 수정
let nextProjectId = 1;
let nextTaskId = 1;

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
  const newProject = { id: String(nextProjectId++), title, description, tasks: [] };
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
  res.json({ ...project, tasks: projectTasks });
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
  const newTask = {pjId: req.params.projectId, id: nextTaskId++, title, description, priority, dueDate, status:"not-started"}
  tasks.push(newTask);
  saveData(tasksFilePath, tasks);

  const findProject = projects.find((p) => p.id === req.params.projectId);
  if (!findProject) {
    return res.status(404).json({ error: 'Project not found' });
  }
  findProject.tasks.push(newTask);

  saveData(projectsFilePath, projects)

  res.json(newTask)
})

module.exports = router;