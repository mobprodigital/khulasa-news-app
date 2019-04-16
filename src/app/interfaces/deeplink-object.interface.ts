export interface IDeepLinkObject {
    $link: {
        extra: {
            com: string;
        },
        host: string;
        path: string;
        scheme: string;
        url: string;
    };
}
