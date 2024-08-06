package dekku.spring_dekku.domain.follow.model.dto;

import lombok.Builder;

@Builder
public record FollowingDto (Long id, String username, String name, String email, String imageUrl){
}
