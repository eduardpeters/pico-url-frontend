export interface ResultDetailsInterface {
    isError: boolean;
    message: string;
    originalUrl?: string;
    picoUrl?: string;
}

export interface UrlEntry {
    _id: string;
    userId: string;
    originalUrl: string;
    shortUrl: string;
    visits: number;
    date: string;
}