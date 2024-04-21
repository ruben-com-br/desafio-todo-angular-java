package br.com.ruben.todo.service;

import br.com.ruben.todo.dto.TaskDTO;
import br.com.ruben.todo.entity.Task;
import br.com.ruben.todo.enums.Status;

import java.util.List;

public interface TaskService {

    Task saveTask(TaskDTO task);

    void deleteTaskById(Long id);

    Task updateTask(TaskDTO task, Long id);

    Task updateStatus(String status, Long id);

    List<Task> getAllTasks();

    Task getTaskById(Long id);

    List<Task> getAllTodo();
}
