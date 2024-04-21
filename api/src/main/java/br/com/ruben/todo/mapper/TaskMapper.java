package br.com.ruben.todo.mapper;

import br.com.ruben.todo.dto.TaskDTO;
import br.com.ruben.todo.entity.Task;
import br.com.ruben.todo.enums.Priority;
import br.com.ruben.todo.enums.Status;
import org.mapstruct.*;

import java.text.Normalizer;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE )
public interface TaskMapper {

    @Mapping(target = "priority", source = "priority", qualifiedByName = "mapPriority")
    Task toTask(TaskDTO dto);

    @Mapping(target = "priority", source = "priority", qualifiedByName = "mapPriority")
    @Mapping(target = "status", source = "status", qualifiedByName = "mapStatus")
    void updateTaskDto(@MappingTarget Task task,  TaskDTO taskDTO);

    @Named("mapPriority")
    default Priority mapPriority(String priorityDTO) {

        String formatted = formatString(priorityDTO);

        return switch (formatted) {
            case "BAIXA" -> Priority.BAIXA;
            case "MEDIA" -> Priority.MEDIA;
            case "ALTA" -> Priority.ALTA;
            default -> throw new IllegalArgumentException("Verifique o campo Prioridade: [ baixa, média, alta]");
        };
    }

    @Named("mapStatus")
    default Status mapStatus(String statusDTO) {

        String formatted = formatString(statusDTO);

        return switch (formatted) {
            case "CONCLUIDA" -> Status.CONCLUIDA;
            case "PENDENTE" -> Status.PENDENTE;
            default -> throw new IllegalArgumentException("Verifique Status [CONCLUIDA,PENDENTE]");
        };
    }


    private String formatString(String unformattedString){
        return Normalizer.normalize(unformattedString, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "")
                .toUpperCase();
    }
}
