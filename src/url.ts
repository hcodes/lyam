interface IParams {
    [key: string]: any;
}

export function queryStringify(params: IParams): string {
    return Object.keys(params)
        .filter(function(key) {
            const val = params[key];
            return val !== '' && val !== undefined && val !== null;
        })
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
        .join('&');
}
