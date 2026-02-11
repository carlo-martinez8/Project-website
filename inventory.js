/**
 * Inventory Manager - Demonstrates:
 * DOM manipulation, Events & state handling, Fetch API (mock),
 * Error handling, localStorage, CRUD, Persistent state
 */

const STORAGE_KEY = 'inventory_items';

// ---- State ----
let state = {
    items: [],
    editingId: null
};

// ---- Mock API (simulates REST with delays) ----
const mockApi = {
    baseUrl: 'https://api.example.com/inventory',

    async fetch(url, options = {}) {
        await new Promise(resolve => setTimeout(resolve, 150));
        const method = options.method || 'GET';
        const body = options.body ? JSON.parse(options.body) : null;

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            let items = stored ? JSON.parse(stored) : [];

            if (method === 'GET') {
                return { ok: true, data: items };
            }
            if (method === 'POST') {
                const newItem = { id: crypto.randomUUID(), ...body };
                items.push(newItem);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
                return { ok: true, data: newItem };
            }
            if (method === 'PUT') {
                const idx = items.findIndex(i => i.id === body.id);
                if (idx === -1) throw new Error('Item not found');
                items[idx] = { ...items[idx], ...body };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
                return { ok: true, data: items[idx] };
            }
            if (method === 'DELETE') {
                const id = url.split('/').pop();
                items = items.filter(i => i.id !== id);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
                return { ok: true };
            }
        } catch (err) {
            return { ok: false, error: err.message };
        }
    },

    async getAll() {
        const res = await this.fetch(this.baseUrl);
        if (!res.ok) throw new Error(res.error || 'Failed to fetch');
        return res.data;
    },

    async create(item) {
        const res = await this.fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
        if (!res.ok) throw new Error(res.error || 'Failed to create');
        return res.data;
    },

    async update(item) {
        const res = await this.fetch(`${this.baseUrl}/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
        if (!res.ok) throw new Error(res.error || 'Failed to update');
        return res.data;
    },

    async delete(id) {
        const res = await this.fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(res.error || 'Failed to delete');
    }
};

// ---- Error handling ----
function showMessage(text, isError = false) {
    const el = document.getElementById('message');
    if (!el) return;
    el.textContent = text;
    el.className = `message ${isError ? 'message-error' : 'message-success'}`;
    el.setAttribute('role', 'alert');
    setTimeout(() => {
        el.textContent = '';
        el.className = 'message';
    }, 3000);
}

// ---- DOM manipulation ----
function renderList() {
    const list = document.getElementById('inventory-list');
    if (!list) return;

    list.innerHTML = '';
    state.items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'inventory-item';
        li.setAttribute('data-id', item.id);
        li.innerHTML = `
            <span class="item-info">
                <strong>${escapeHtml(item.name)}</strong>
                <span class="item-qty">Qty: ${escapeHtml(String(item.quantity))}</span>
            </span>
            <div class="item-actions">
                <button type="button" class="btn btn-sm btn-edit" data-action="edit" aria-label="Edit ${escapeHtml(item.name)}">Edit</button>
                <button type="button" class="btn btn-sm btn-delete" data-action="delete" aria-label="Delete ${escapeHtml(item.name)}">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateFormForEdit(item) {
    const nameInput = document.getElementById('item-name');
    const qtyInput = document.getElementById('item-quantity');
    const editId = document.getElementById('edit-id');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    if (!nameInput || !qtyInput || !editId) return;

    editId.value = item ? item.id : '';
    nameInput.value = item ? item.name : '';
    qtyInput.value = item ? item.quantity : 1;
    submitBtn.textContent = item ? 'Update Item' : 'Add Item';
    cancelBtn.style.display = item ? 'inline-block' : 'none';
}

// ---- State sync with localStorage (persistent state) ----
function syncState() {
    const stored = localStorage.getItem(STORAGE_KEY);
    state.items = stored ? JSON.parse(stored) : [];
}

// ---- CRUD handlers ----
async function loadItems() {
    try {
        state.items = await mockApi.getAll();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
        renderList();
    } catch (err) {
        showMessage(err.message || 'Failed to load items', true);
    }
}

async function handleSubmit(event) {
    event.preventDefault();
    const nameInput = document.getElementById('item-name');
    const qtyInput = document.getElementById('item-quantity');
    const editId = document.getElementById('edit-id');

    if (!nameInput || !qtyInput) return;

    const name = nameInput.value.trim();
    const quantity = Math.max(0, parseInt(qtyInput.value, 10) || 0);

    if (!name) {
        showMessage('Please enter an item name.', true);
        return;
    }

    try {
        if (state.editingId) {
            const updated = await mockApi.update({
                id: state.editingId,
                name,
                quantity
            });
            state.items = state.items.map(i => (i.id === updated.id ? updated : i));
            state.editingId = null;
            updateFormForEdit(null);
            showMessage('Item updated.');
        } else {
            const created = await mockApi.create({ name, quantity });
            state.items.push(created);
            showMessage('Item added.');
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
        renderList();
    } catch (err) {
        showMessage(err.message || 'Operation failed', true);
    }
}

async function handleEdit(id) {
    const item = state.items.find(i => i.id === id);
    if (!item) return;
    state.editingId = id;
    updateFormForEdit(item);
}

async function handleDelete(id) {
    if (!confirm('Delete this item?')) return;
    try {
        await mockApi.delete(id);
        state.items = state.items.filter(i => i.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
        if (state.editingId === id) {
            state.editingId = null;
            updateFormForEdit(null);
        }
        renderList();
        showMessage('Item deleted.');
    } catch (err) {
        showMessage(err.message || 'Delete failed', true);
    }
}

// ---- Events ----
function bindEvents() {
    const form = document.getElementById('inventory-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const list = document.getElementById('inventory-list');

    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            state.editingId = null;
            updateFormForEdit(null);
        });
    }

    if (list) {
        list.addEventListener('click', (event) => {
            const btn = event.target.closest('[data-action]');
            if (!btn) return;
            const li = btn.closest('.inventory-item');
            if (!li) return;
            const id = li.getAttribute('data-id');
            if (btn.dataset.action === 'edit') handleEdit(id);
            if (btn.dataset.action === 'delete') handleDelete(id);
        });
    }
}

// ---- Init ----
function initInventory() {
    syncState();
    renderList();
    updateFormForEdit(null);
    bindEvents();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInventory);
} else {
    initInventory();
}
