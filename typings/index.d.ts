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
        userVars?: UserVars;
    }

    interface QueryParams {
        [key: string]: string | boolean | number | undefined | null;
    }

    interface UserVars {
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
        userVars?: UserVars;
    }
}

declare module 'lyam' {
    export function extLink(counterId: string, link: string, title?: string): void;
    export function file(counterId: string, file: string, title?: string): void;
    export function hit(counterId: string, hitParams?: Lyam.HitParams, userVars?: Lyam.UserVars): void;
    export function hitExt(params: Lyam.HitExtParams): void;
    export function notBounce(counterId: string): void;
    export function reachGoal(counterId: string, name?: string, userVars?: Lyam.UserVars): void;
    export function userVars(counterId: string, data: Lyam.UserVars): void;
}
