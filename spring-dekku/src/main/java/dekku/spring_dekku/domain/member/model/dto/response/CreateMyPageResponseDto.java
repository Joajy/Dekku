package dekku.spring_dekku.domain.member.model.dto.response;

import java.util.List;

import dekku.spring_dekku.domain.deskterior_post.model.dto.response.FindDeskteriorPostResponseDto;
import dekku.spring_dekku.domain.deskterior_post.model.entity.DeskteriorPost;

public record CreateMyPageResponseDto (
        String nickname,
        String image_url,
        String introduction,
        int followingCount,
        int followerCount,
        List<FindDeskteriorPostResponseDto> deskteriorPosts,
        List<FindDeskteriorPostResponseDto> likedPosts
) {}
