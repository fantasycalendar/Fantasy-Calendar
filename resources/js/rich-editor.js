import Quill from "quill"

export default () => ({
    quill: null,
    _value: '',
    init() {
        this.quill = new Quill(this.$refs.quill, {
            theme: 'snow',
            placeholder: 'Compose an epic...',
        })

        // `value` is entangled with the parent's model via x-modelable, so it
        // must always match the editor contents: if it lags, a save drops the
        // latest keystrokes, or the stale value gets synced back over the model.
        this.quill.on('text-change', () => {
            this._value = this.quill.root.innerHTML;
        })
    },
    get value() {
        return this._value;
    },
    set value(newVal) {
        this.quill.root.innerHTML = newVal;
        this._value = newVal;
    }
})
