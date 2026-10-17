// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * The rich editor exposes `value` through x-modelable, which entangles it with
 * the parent's model (e.g. working_event.description). `value` must always
 * reflect what is in the editor: a stale value either drops the user's latest
 * keystrokes on save, or gets pushed back over the parent's model.
 */

const quills = [];

vi.mock('quill', () => ({
    default: class FakeQuill {
        constructor() {
            this.root = { innerHTML: '' };
            this.handlers = {};
            quills.push(this);
        }
        on(name, handler) {
            this.handlers[name] = handler;
        }
        type(html) {
            this.root.innerHTML = html;
            this.handlers['text-change']?.();
        }
    },
}));

const { default: richEditorFactory } = await import('../rich-editor.js');

function makeEditor() {
    const editor = Object.assign(richEditorFactory(), { $refs: { quill: {} } });
    editor.init();
    return { editor, quill: quills[quills.length - 1] };
}

describe('rich editor value', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    it('reflects typed content immediately, not after a debounce', () => {
        const { editor, quill } = makeEditor();

        quill.type('<p>Final words</p>');

        expect(editor.value).toBe('<p>Final words</p>');
    });

    it('reflects a value set from the parent model immediately', () => {
        const { editor, quill } = makeEditor();

        editor.value = '<p>Existing description</p>';

        expect(quill.root.innerHTML).toBe('<p>Existing description</p>');
        expect(editor.value).toBe('<p>Existing description</p>');
    });

    it('does not revert to an earlier value later on', () => {
        const { editor, quill } = makeEditor();

        quill.type('<p>First</p>');
        editor.value = '<p>Second</p>';
        vi.advanceTimersByTime(1000);

        expect(editor.value).toBe('<p>Second</p>');
    });
});
