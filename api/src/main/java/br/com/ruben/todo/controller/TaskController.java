package br.com.ruben.todo.controller;

import br.com.ruben.todo.dto.TaskDTO;
import br.com.ruben.todo.entity.Task;
import br.com.ruben.todo.enums.Status;
import br.com.ruben.todo.service.impl.TaskServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.hibernate.ObjectNotFoundException;
import org.hibernate.annotations.NotFound;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {

    @Autowired
    private TaskServiceImpl taskService;

    @Operation(summary = "Create new Task")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Create task", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Task.class)) }),
        @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content)
    })
    @PostMapping()
    public  ResponseEntity<Object> saveTask(@RequestBody TaskDTO dto) {
        Task createdTask = taskService.saveTask(dto);
        return new ResponseEntity<Object>(createdTask, HttpStatus.CREATED);
    }

    @Operation(summary = "Delete Task By ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task deleted", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Task.class)) }),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
            @ApiResponse(responseCode = "404", description = "ID not found", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteTask(@PathVariable Long id) {
        taskService.deleteTaskById(id);
        return new ResponseEntity("Task deleted successfully", HttpStatus.OK);
    }

    @Operation(summary = "Update Task By ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task update", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Task.class)) }),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
            @ApiResponse(responseCode = "404", description = "ID not found", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@RequestBody TaskDTO dto, @PathVariable Long id) {
        Task task = taskService.updateTask(dto,id);
        return new ResponseEntity(task, HttpStatus.OK);
    }

    @Operation(summary = "Update Status Task By ID and Status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task status update by ID", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Task.class)) }),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
            @ApiResponse(responseCode = "404", description = "Task with ID not found", content = @Content)
    })
    @PatchMapping("/{id}/{status}")
    public ResponseEntity<Object> updateStatus(@PathVariable Long id, @PathVariable String status) {

        Task task = taskService.updateStatus(status,id);

        return new ResponseEntity(task, HttpStatus.OK);
    }

    @Operation(summary = "List all tasks")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tasks founded", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Task.class)) }),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
    })
    @GetMapping("/getAll")
    public ResponseEntity<List<Object>> getAll() {
        List<Task> list = taskService.getAllTasks();
        return new ResponseEntity(list, HttpStatus.OK);
    }

    @Operation(summary = "Find task py id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task found", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Task.class)) }),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
    })
    @GetMapping("/{id}")
    public ResponseEntity<Object> getById(@PathVariable Long id) {
        Task task = taskService.getTaskById(id);
        return new ResponseEntity(task, HttpStatus.OK);
    }

    @Operation(summary = "List All Tasks with status = 'Pendente'")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List Task Found", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = Task.class)) }),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
    })
    @GetMapping("/getAllToDo")
    public ResponseEntity<List<Object>> getAllToDo() {
        List<Task> list = taskService.getAllTodo();
        return new ResponseEntity(list, HttpStatus.OK);
    }

}
