export function debounce<T extends Function>(func : T, timeout : number) {
    let postponed_call : number = null;
    return function (...args : Array<any>) {
        let ctx = this;
        if (postponed_call) {
            window.clearTimeout(postponed_call);
        }
        postponed_call = window.setTimeout(() => func.apply(ctx, args), timeout);
    }
}
