package dekku.spring_dekku.domain.deskterior_post.controller;

import dekku.spring_dekku.domain.deskterior_post.model.dto.request.CreateDeskteriorPostRequestDto;
import dekku.spring_dekku.domain.deskterior_post.model.dto.response.CreateDeskteriorPostResponseDto;
import dekku.spring_dekku.domain.deskterior_post.model.dto.response.FindByIdDeskteriorPostResponseDto;
import dekku.spring_dekku.domain.deskterior_post.model.dto.response.FindDeskteriorPostResponseDto;
import dekku.spring_dekku.domain.deskterior_post.model.dto.response.UpdateDeskteriorPostRequestDto;
import dekku.spring_dekku.domain.deskterior_post.model.entity.DeskteriorPost;
import dekku.spring_dekku.domain.deskterior_post.service.DeskteriorPostService;
import dekku.spring_dekku.global.model.dto.Success;
import dekku.spring_dekku.global.util.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "데스크테리어 게시판 관련 API")
@RestController
@RequestMapping("/api/deskterior-post")
@RequiredArgsConstructor
public class DeskteriorPostController {

    private final DeskteriorPostService deskteriorPostService;

    @Operation(summary = "게시글 저장")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "게시글 저장 성공"
//                    content = @Content(schema = @Schema(implementation = CreateDeskteriorPostResponseDto.class))
            )
    })
    @PostMapping("")
//    public ResponseEntity createDeskteriorPost(@RequestBody @Valid CreateDeskteriorPostRequestDto request)
public ResponseEntity createDeskteriorPost(@RequestBody @Valid CreateDeskteriorPostRequestDto request) {

        System.out.println("post");

        CreateDeskteriorPostResponseDto response = deskteriorPostService.addDeskteriorPost("tkdgn407", request);

        return ResponseUtil.created(
                Success.builder()
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "모든 게시글 조회")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "요청 완료",
                    content = @Content(schema = @Schema(implementation = FindDeskteriorPostResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "모든 게시글 조회 요청 실패"
            )
            ,
            @ApiResponse(
                    responseCode = "404",
                    description = "존재하지 않는 계정"
            )
    })
//    @Parameter(name = "phoneNumber", description = "찾고 싶은 계정", example = "01012345678")
    @GetMapping("")
    public ResponseEntity findAllDeskteriorPost(
//            @RequestParam @Pattern(regexp = "^010\\d{8}$", message = "올바른 형식이 아닙니다.") String phoneNumber
    ) {

        return ResponseUtil.ok(
                Success.builder()
                        .data(deskteriorPostService.findAll())
                        .build());

    }

    @Operation(summary = "단일 게시글 조회")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "요청 완료",
                    content = @Content(schema = @Schema(implementation = FindByIdDeskteriorPostResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "단일 게시글 조회 요청 실패"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "존재하지 않는 계정"
            )
    })
    @GetMapping("/{postId}")
    public ResponseEntity findDeskteriorPost(@PathVariable Long postId) {
        FindByIdDeskteriorPostResponseDto response = deskteriorPostService.findById(postId);

        return ResponseUtil.ok(
                Success.builder()
                        .data(response)
                        .build());
    }

    // 게시글 수정
    @Operation(summary = "게시글 수정")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "게시글 수정 성공",
                    content = @Content(schema = @Schema(implementation = FindDeskteriorPostResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "게시글 수정 요청 실패"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "존재하지 않는 게시글"
            )
    })

    @PutMapping("/{postId}")
    public ResponseEntity updateDeskteriorPost(@PathVariable Long postId, @RequestBody @Valid UpdateDeskteriorPostRequestDto request) {
        DeskteriorPost updatedDeskteriorPost = deskteriorPostService.updateDeskteriorPost(postId, request);
        return ResponseUtil.ok(
                Success.builder()
                        .data(updatedDeskteriorPost)
                        .build());
    }


    @Operation(summary = "게시글 삭제")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "게시글 삭제 성공"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "게시글 삭제 요청 실패"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "존재하지 않는 게시글"
            )
    })

    @DeleteMapping("/{postId}")
    public ResponseEntity deleteDeskteriorPost(@PathVariable Long postId) {
        deskteriorPostService.deleteDeskteriorPost(postId);
        return ResponseUtil.ok(
                Success.builder()
                        .build()
        );
    }
}