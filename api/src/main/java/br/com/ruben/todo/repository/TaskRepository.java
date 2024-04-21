package br.com.ruben.todo.repository;

import br.com.ruben.todo.entity.Task;
import br.com.ruben.todo.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByStatus(Status status);
}
