declare namespace Lyam {
    interface HitParams {
        referrer?: string;
        title?: string;
        url?: string;
        ut?: string;
    }

    interface HitExtParams {
        counterId: string;
        browserInfo?: BrowserInfo;
        pageParams: HitParams;
        requestParams?: QueryParams;
        params?: Params;
    }

    interface QueryParams {
        [key: string]: string | boolean | number | undefined | null;
    }

    interface Params {
        [key: string]: unknown;
    }

    type BrowserInfoValue = boolean | string | number;

    interface BrowserInfo {
        [key: string]: BrowserInfoValue;
    }

    interface HitParams {
        referrer?: string;
        title?: string;
        url?: string;
    }

    interface HitExtParams {
        counterId: string;
        browserInfo?: BrowserInfo;
        pageParams: HitParams;
        requestParams?: QueryParams;
        params?: Params;
    }
}

declare module 'lyam' {
    export function extLink(counterId: string, link: string, title?: string): void;
    export function file(counterId: string, file: string, title?: string): void;
    export function hit(counterId: string, hitParams?: Lyam.HitParams, userVars?: Lyam.Params): void;
    export function hitExt(params: Lyam.HitExtParams): void;
    export function notBounce(counterId: string): void;
    export function reachGoal(counterId: string, name?: string, params?: Lyam.Params): void;
    export function params(counterId: string, data: Lyam.Params): void;
    export function userParams(counterId: string, data: Lyam.Params): void;
}
