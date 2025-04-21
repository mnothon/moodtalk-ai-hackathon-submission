package ch.planner.plannersvc.controller;

import ch.planner.plannersvc.api.ChatApi;

import ch.planner.plannersvc.auth.IsUser;
import ch.planner.plannersvc.auth.SessionState;
import ch.planner.plannersvc.auth.WithSessionState;
import ch.planner.plannersvc.dto.AssistantMessageDto;
import ch.planner.plannersvc.dto.AssistantMessageProperties;
import ch.planner.plannersvc.service.AssistantService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

@Slf4j
@RestController
@WithSessionState
@AllArgsConstructor
public class AssistantController implements ChatApi {
    private final SessionState sessionState;
    private final AssistantService assistantService;

    @Override
    @IsUser
    public ResponseEntity<AssistantMessageDto> chat(AssistantMessageProperties assistantMessageProperties) {

        final String response = assistantService.chat(assistantMessageProperties.getMessage());



        final AssistantMessageDto message = new AssistantMessageDto()
                .id(UUID.randomUUID().toString())
                .message(response)
                .timestamp(OffsetDateTime.now(ZoneOffset.UTC));
        return ResponseEntity.ok(message);
    }

}
