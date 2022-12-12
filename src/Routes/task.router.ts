import { Router } from "express";
import {
    AddTask,
    GetUserTasks,
    DeleteTask,
} from "../Controllers/task.controller";

const taskRouter = Router();

taskRouter.post("/task", AddTask);
taskRouter.delete("/task/:id", DeleteTask);
taskRouter.get("/tasks", GetUserTasks);

export default taskRouter;
