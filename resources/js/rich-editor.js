import Quill from "quill"
import _ from "lodash"

export default () => ({
    quill: null,
    _value: '',
    _debouncedSync: null,
    init() {
        this.quill = new Quill(this.$refs.quill, {
            theme: 'snow',
            placeholder: 'Compose an epic...',
        })

        this._debouncedSync = _.debounce(() => {
            this._value = this.quill.root.innerHTML;
        }, 500);

        this.quill.on('text-change', () => {
            this._debouncedSync();
        })
    },
    get value() {
        return this._value;
    },
    set value(newVal) {
        this.quill.root.innerHTML = newVal;
    }
})
