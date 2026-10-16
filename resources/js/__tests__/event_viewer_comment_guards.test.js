// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('quill', () => ({
    default: class FakeQuill {
        constructor(element) {
            this.root = element;
            this.handlers = {};
        }
        on(name, handler) {
            this.handlers[name] = handler;
        }
    },
}));

const { default: eventViewerFactory } = await import('../calendar-events-viewer.js');

/**
 * Leaving the viewer (close / edit / clone) must ask before discarding an
 * unposted comment or an in-progress comment edit — and must not ask, or act
 * twice, when there is nothing to lose.
 */
function makeViewer() {
    document.body.innerHTML = `<div id="comment-editor-0"><div></div></div>`;

    return Object.assign(eventViewerFactory(), {
        open: true,
        id: 3,
        epoch: 0,
        db_id: 99,
        user_can_comment: true,
        can_comment_on_event: true,
        comments: [{ index: 0, id: 7, content: '<p>Original comment</p>', editing: false }],
        $store: { calendar: { apiurl: '/api' } },
        $dispatch: vi.fn(),
    });
}

const closeEvent = () => ({ target: document.body });
const confirmed = () => Promise.resolve({ dismiss: undefined });
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('event viewer unsaved comment guards', () => {
    beforeEach(() => {
        window.swal = { isVisible: () => false, fire: vi.fn(confirmed) };
        globalThis.axios = { patch: vi.fn(() => Promise.resolve({ data: { success: true } })) };
    });

    it('clones straight away, once, when there is no draft', async () => {
        const viewer = makeViewer();

        viewer.confirm_clone();
        await flush();

        expect(window.swal.fire).not.toHaveBeenCalled();
        expect(viewer.$dispatch).toHaveBeenCalledTimes(1);
        expect(viewer.$dispatch).toHaveBeenCalledWith('event-editor-modal-clone-event', { event_id: 3, epoch: 0 });
    });

    it('asks before cloning over a draft comment, then clones once', async () => {
        const viewer = makeViewer();
        viewer.new_comment_content = '<p>Draft</p>';

        viewer.confirm_clone();
        await flush();

        expect(window.swal.fire).toHaveBeenCalledTimes(1);
        expect(viewer.$dispatch).toHaveBeenCalledTimes(1);
    });

    it('asks before editing the event over a draft comment', async () => {
        const viewer = makeViewer();
        viewer.new_comment_content = '<p>Draft</p>';

        viewer.confirm_edit();
        await flush();

        expect(window.swal.fire).toHaveBeenCalledTimes(1);
    });

    it('asks before closing over a changed, unsubmitted comment edit', async () => {
        const viewer = makeViewer();
        viewer.start_edit_comment(viewer.comments[0]);
        viewer.event_editor.root.innerHTML = '<p>Changed comment</p>';
        viewer.event_editor.handlers['text-change']();

        viewer.confirm_close(closeEvent());
        await flush();

        expect(window.swal.fire).toHaveBeenCalledTimes(1);
    });

    it('closes without asking when a comment edit has no changes', () => {
        const viewer = makeViewer();
        viewer.start_edit_comment(viewer.comments[0]);

        viewer.confirm_close(closeEvent());

        expect(window.swal.fire).not.toHaveBeenCalled();
        expect(viewer.open).toBe(false);
    });

    it('submitting an untouched edit saves the comment instead of offering to delete it', async () => {
        const viewer = makeViewer();
        viewer.start_edit_comment(viewer.comments[0]);

        viewer.submit_edit_comment(viewer.comments[0]);
        await flush();

        expect(window.swal.fire).not.toHaveBeenCalled();
        expect(globalThis.axios.patch).toHaveBeenCalledWith('/api/eventcomment/7', { content: '<p>Original comment</p>' });
    });

    it('cancelling an edit forgets its content', () => {
        const viewer = makeViewer();
        viewer.start_edit_comment(viewer.comments[0]);

        viewer.cancel_edit_comment();

        expect(viewer.editing_comment_content).toBe('');
    });
});
