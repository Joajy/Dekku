package dekku.spring_dekku.domain.member.controller;

import dekku.spring_dekku.domain.member.model.dto.MemberUpdateDto;
import dekku.spring_dekku.domain.member.service.oauth2.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "사용자 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class MemberController {

	private final MemberService memberService;
//
//	@GetMapping
//	public List<Member> getAllMembers() {
//		return memberService.getAllMembers();
//	}
//
//	@GetMapping("/{id}")
//	public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
//
//		return memberService.getMemberById(id)
//				.map(ResponseEntity::ok)
//				.orElseGet(() -> ResponseEntity.notFound().build());
//	}

	@Operation(summary = "회원정보 수정")
	@ApiResponses({
			@ApiResponse(
					responseCode = "200",
					description = "회원정보 수정 완료"
			),
			@ApiResponse(
					responseCode = "404",
					description = "정보를 수정하려는 계정이 없는 경우"
			),
			@ApiResponse(
					responseCode = "401",
					description = "만료된 토큰으로 계정 수정을 하려는 경우"
			)
	})
	@PatchMapping("/update")
	public ResponseEntity<Void> update(@RequestHeader(value="Access") String token, @RequestBody MemberUpdateDto requestDto) throws Exception {
		memberService.updateMember(requestDto, token);

        return ResponseEntity.status(HttpStatus.OK).build();
	}

	@Operation(summary = "회원 탈퇴")
	@ApiResponses({
			@ApiResponse(
					responseCode = "200",
					description = "댓글 삭제 성공"
			),
			@ApiResponse(
					responseCode = "404",
					description = "삭제하려는 계정이 없는 경우"
			),
			@ApiResponse(
					responseCode = "401",
					description = "만료된 토큰으로 계정 삭제를 신청한 경우"
			)
	})
	@DeleteMapping("/delete")
	public ResponseEntity<?> delete(@RequestHeader(value="access") String token) {
		memberService.deleteMember(token);

		ResponseCookie responseCookie = ResponseCookie.from("refresh-token", null)
				.maxAge(0)
				.path("/")
				.build();

		return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.SET_COOKIE, responseCookie.toString())
				.build();
	}
}
