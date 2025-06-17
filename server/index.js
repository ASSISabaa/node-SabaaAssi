const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');
const errorHandler = require('./errorHandler');
const validateTask = require('./validateTask');

const app = express();
const PORT = 3000;
const TASKS_FILE = path.join(__dirname, 'tasks.json');

app.use(cors());
app.use(express.json());
app.use(logger);

app.get('/tasks', async (req, res, next) => {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    const tasks = JSON.parse(data);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

app.post('/tasks', validateTask, async (req, res, next) => {
  try {
    const newTask = {
      id: uuidv4(),
      title: req.body.title.trim(),
      description: req.body.description ? req.body.description.trim() : '',
      status: req.body.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const tasks = await readTasks();
    tasks.push(newTask);
    await writeTasks(tasks);
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
});

async function readTasks() {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeTasks(tasks) {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

app.use(errorHandler);
