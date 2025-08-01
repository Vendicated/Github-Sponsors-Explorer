export class GlobalRune<T> {
    value: ReturnType<typeof $state<T>>;

    constructor(initialValue?: T) {
        this.value = $state<T>(initialValue as T);
    }
}
