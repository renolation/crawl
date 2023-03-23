export class CreateStoryDto {
    readonly title: string;
    readonly author: number;
    readonly description: string[];
    readonly poster: string;
    readonly categoryList: string[];
    readonly status: string;
}