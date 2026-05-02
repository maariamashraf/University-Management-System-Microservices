package UnitSystem.demo.DataAccessLayer.Dto.Message;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageRequest {

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotNull(message = "Sender ID is required")
    private Long senderId;

    @NotBlank(message = "Message content cannot be empty")
    private String content;
}
