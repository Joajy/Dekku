package dekku.spring_dekku.domain.member.repository;

import dekku.spring_dekku.domain.member.model.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Member findByEmail(String email);

    Member findByUsername(String username);

    @Modifying
    @Query(value = "UPDATE Member u set u.nickname=:nickname, u.ageRange=:ageRange, u.gender=:gender, u.imageUrl=:imageUrl " +
            "WHERE u.username= :username")
    void update(String username, String nickname, Integer ageRange, String gender, String imageUrl);

    @Modifying
    @Query(value = "UPDATE Member m set m.name=:name, m.email=:email, m.imageUrl=:imageUrl " +
            "WHERE m.username= :username")
    void renewMemberInfo(String username, String name, String email, String imageUrl);

//    @Modifying
//    @Transactional
//    @Query("UPDATE Member m SET m.token = :token WHERE m.email = :email")
//    void updateTokenByEmail(@Param("email") String email, @Param("token") String token);
}



//public interface MemberRepository {
//
//	Boolean insertMember(MemberSignUpReqDto req);
//	Member selectByEmailAndPassword(LoginReqDto req);
//	Member selectByIdAndEmail(LogoutReqDto req);
//	Member selectByEmail(String email);
//	Member selectByNickName(String nickName);
//}
