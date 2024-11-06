const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const projectsFilePath = path.join(__dirname, '../data/projects.json');
const tasksFilePath = path.join(__dirname, '../data/tasks.json');

// TODO : application 실행시 id값 수정
let nextProjectId = 1;

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

module.exports = router;