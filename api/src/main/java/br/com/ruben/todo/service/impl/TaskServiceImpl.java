package br.com.ruben.todo.service.impl;

import br.com.ruben.todo.dto.TaskDTO;
import br.com.ruben.todo.entity.Task;
import br.com.ruben.todo.enums.Status;
import br.com.ruben.todo.mapper.TaskMapper;
import br.com.ruben.todo.repository.TaskRepository;
import br.com.ruben.todo.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskMapper mapper;

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public Task saveTask(TaskDTO dto) {
        Task task = mapper.toTask(dto);
        return taskRepository.save(task);
    }

    @Override
    public void deleteTaskById(Long id) {
        validId(id);
        taskRepository.deleteById(id);
    }

    @Override
    public Task getTaskById(Long id) {
        return validId(id);
    }

    @Override
    public List<Task> getAllTodo() {
        return taskRepository.findAllByStatus(Status.PENDENTE);
    }

    @Override
    public Task updateTask(TaskDTO dto, Long id) {
        Task task = validId(id);
        mapper.updateTaskDto(task, dto);
        return taskRepository.save(task);
    }

    @Override
    public Task updateStatus(String status, Long id) {
        Task task = validId(id);
        TaskDTO dto = new TaskDTO(null,null,null, status);
        mapper.updateTaskDto(task, dto);
        return taskRepository.save(task);
    }

    private Task validId(Long id){
        Optional<Task> op = taskRepository.findById(id);

        if(op.isEmpty()){
            throw new IllegalArgumentException("Task nao encontrada com o id" +id);
        }

        return op.get();
    }

}
