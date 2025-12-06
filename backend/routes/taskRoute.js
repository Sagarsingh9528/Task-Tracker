import express from 'express'
import { createTask, getTasks, getTask, deleteTask, updateTask } from '../controllers/taskController.js'
import isAuth from '../middleware/auth.js'

const taskRouter = express.Router();

taskRouter.get("/", isAuth, getTasks);
taskRouter.get("/:id", isAuth, getTask);
taskRouter.post("/", isAuth, createTask);
taskRouter.put("/:id", isAuth, updateTask);
taskRouter.delete("/:id", isAuth, deleteTask);

export default taskRouter;