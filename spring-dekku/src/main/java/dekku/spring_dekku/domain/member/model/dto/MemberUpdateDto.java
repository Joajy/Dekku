package dekku.spring_dekku.domain.member.model.dto;

import lombok.Builder;

@Builder
public record MemberUpdateDto(
        String nickname,
        Integer ageRange,
        String introduction,
        String gender,
        String imageUrl) {
}
