package ch.planner.plannersvc.controller.converter;

import ch.planner.plannersvc.dto.CompanyDto;
import ch.planner.plannersvc.model.Company;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class CompanyConverter {

  public static CompanyDto toDto(Company company) {
    if (company == null) {
      return null;
    }
    return new CompanyDto()
            .id(company.getId())
            .name(company.getName())
            .logo(company.getLogo());
  }
}
