package dekku.spring_dekku.domain.member.model.dto;

public interface OAuth2Response {
    public String getProvider();
    public String getProviderId();
    public String getName();
    public String getEmail();
}
