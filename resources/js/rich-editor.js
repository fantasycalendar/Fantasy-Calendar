import Quill from "quill"

export default () => ({
    quill: null,
    _value: '',
    init() {
        this.quill = new Quill(this.$refs.quill, {
            theme: 'snow',
            placeholder: 'Compose an epic...',
        })

        this.quill.on('text-change', () => {
            this._value = this.quill.root.innerHTML;
        })
    },
    get value() {
        return this._value;
    },
    set value(newVal) {
        this.quill.root.innerHTML = newVal;
    }
})
