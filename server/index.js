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
