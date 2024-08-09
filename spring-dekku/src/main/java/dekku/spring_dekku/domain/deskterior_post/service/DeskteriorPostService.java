package dekku.spring_dekku.domain.deskterior_post.service;

import dekku.spring_dekku.domain.deskterior_post.model.dto.request.CreateDeskteriorPostRequestDto;
import dekku.spring_dekku.domain.deskterior_post.model.dto.response.CreateDeskteriorPostResponseDto;
import dekku.spring_dekku.domain.deskterior_post.model.dto.response.FindByIdDeskteriorPostResponseDto;
import dekku.spring_dekku.domain.deskterior_post.model.dto.response.FindDeskteriorPostResponseDto;
import dekku.spring_dekku.domain.deskterior_post.model.dto.response.UpdateDeskteriorPostRequestDto;
import dekku.spring_dekku.domain.deskterior_post.model.entity.DeskteriorPost;

import java.util.List;

public interface DeskteriorPostService {

    CreateDeskteriorPostResponseDto addDeskteriorPost(String email, CreateDeskteriorPostRequestDto requestDto);

    List<FindDeskteriorPostResponseDto> findAll();

    FindByIdDeskteriorPostResponseDto findById(Long id);

    DeskteriorPost updateDeskteriorPost(Long id, UpdateDeskteriorPostRequestDto requestDto);

    void deleteDeskteriorPost(Long id);
}
