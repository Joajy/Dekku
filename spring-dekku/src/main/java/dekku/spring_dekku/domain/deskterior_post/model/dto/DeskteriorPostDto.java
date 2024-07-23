package dekku.spring_dekku.domain.deskterior_post.model.dto;

import lombok.Builder;
import lombok.Getter;

import java.sql.Timestamp;

@Getter
@Builder
public class DeskteriorPostDto {
    private Long id;
    private String title;
    private String thumbnailUrl;
    private String content;
    private Timestamp createdAt;
    private Timestamp modifiedAt;
    private Long deskteriorImageId;
    private Long userId;
}
