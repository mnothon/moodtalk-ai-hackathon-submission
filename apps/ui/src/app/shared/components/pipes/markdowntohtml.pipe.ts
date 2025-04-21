import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from "marked";


@Pipe({
    name: 'markdownToHtml',
    standalone: true
})
export class MarkdownToHtmlPipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) {}

    transform(value: string | null | undefined): SafeHtml {
        if (value === null || value === undefined || value === '') {
            return '';
        }

        try {
            const html = marked.parse(value) as string;
            const safeHtml = this.sanitizer.bypassSecurityTrustHtml(html);

            return safeHtml;
        } catch (error) {
            console.error('Error parsing markdown:', error);
            return this.sanitizer.sanitize(1, value) || '';
        }
    }
}