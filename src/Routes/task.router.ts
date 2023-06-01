import { Router } from "express";
import {
    AddTask,
    GetUserTasks,
    DeleteTask,
    GetUserTasksByDate,
    EditTask,
    GetUserTaskById,
    GetUserNextTask,
    GetNotifiedTasks,
} from "../Controllers/task.controller";

const taskRouter = Router();

taskRouter.post("/task", AddTask);
taskRouter.delete("/task/:id", DeleteTask);
taskRouter.get("/tasks", GetUserTasks);
taskRouter.post("/tasks/nextTask", GetUserNextTask);
taskRouter.post("/tasks/date", GetUserTasksByDate);
taskRouter.put("/tasks/:id", EditTask);
taskRouter.get("/task/:id", GetUserTaskById);
// taskRouter.get("/task/notified", GetNotifiedTasks);

export default taskRouter;
