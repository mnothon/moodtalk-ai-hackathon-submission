import {Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import {AssistantMessageProperties} from "../../generated";
import {getCurrentTimeStampAsString} from "../shared/utils";
import {Store} from "@ngrx/store";
import {AppState} from "../shared/state/app.state";
import {sendBotMessage} from "../shared/state/data/data.actions";
import {selectIsWaitingForMessageResponse, selectMessages} from "../shared/state/data/data.selectors";

export enum Sender {
    USER = 'user',
    BOT = 'bot'
}

export interface MessagesRequest {
    startDate: Date;
    endDate: Date;
}

@Component({
    selector: 'app-chat-assistant',
    templateUrl: './chat-assistant.component.html',
    styleUrls: ['./chat-assistant.component.scss']
})
export class ChatAssistantComponent implements AfterViewChecked {
    isOpen = false;
    userInput = '';
    $messages = this.store.selectSignal(selectMessages);
    $isLoading = this.store.selectSignal(selectIsWaitingForMessageResponse);

    @ViewChild('messageContainer') private messageContainer!: ElementRef;
    @ViewChild('messageInput') private messageInput!: ElementRef;

    constructor(private store: Store<AppState>) {}

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            setTimeout(() => this.messageInput.nativeElement.focus());
        }
    }

    sendMessage() {
        if (!this.userInput.trim()) return;

        const assistantMessage: AssistantMessageProperties = {
            message: this.userInput,
            sender: Sender.USER,
            timestamp: getCurrentTimeStampAsString()
        };

        this.store.dispatch(sendBotMessage({message: assistantMessage}))
        this.userInput = '';

        setTimeout(() => this.messageInput.nativeElement.focus());
    }

    private scrollToBottom(): void {
        try {
            this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
        } catch(err) { }
    }
}