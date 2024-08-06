package dekku.spring_dekku.domain.member.model.dto;

import lombok.Builder;

@Builder
public record MemberDto(String username, String name, String email, String role, Integer ageRange, String gender) {
}
