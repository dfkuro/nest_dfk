import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get.tasks.filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  /**
   * Returns all the tasks available
   * @returns {array} - Array of tasks
   */
  getAllTasks(): Task[] {
    return this.tasks;
  }

  /**
   * Search a task by status, title or description
   * @param {GetTaskFilterDto} filterDto
   * @returns {array} Tasks
   */
  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }

    return tasks;
  }

  /**
   * Returns the task needed
   * @param {string} id - Id for the task to return
   * @returns {Task} Task object
   */
  getTaskById(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }

    return found;
  }

  /**
   * This function create a task for the project
   * @param {CreateTaskDTO} Check DTO for Task object
   * @returns {Task} The object created for the task
   */
  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description: `${description} and this is added.`,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  /**
   * Remove a Task
   * @param {string} id - Id for the task to remove
   * @returns {Task} Task object
   */
  deleteTaskById(id: string): void {
    const found = this.getTaskById(id);
    this.tasks.filter((task) => task.id !== found.id);
  }

  /**
   * Update info for the task
   * @param {string} id Task identifier
   * @param {TaskStatus} status
   * @returns
   */
  updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
