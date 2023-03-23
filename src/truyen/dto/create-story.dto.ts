export class CreateStoryDto {
    readonly title: string;
    readonly author: string;
    readonly description: string[];
    readonly poster: string;
    readonly categoryList: string[];
    readonly status: string;
}