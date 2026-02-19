const STORAGE_KEY = 'inventory_items';

const delay = () => new Promise((r) => setTimeout(r, 150));

export const inventoryApi = {
  async getAll() {
    await delay();
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  async create(item) {
    await delay();
    const items = await this.getAll();
    const newItem = { id: crypto.randomUUID(), ...item };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return newItem;
  },

  async update(item) {
    await delay();
    const items = await this.getAll();
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx === -1) throw new Error('Item not found');
    items[idx] = { ...items[idx], ...item };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return items[idx];
  },

  async delete(id) {
    await delay();
    const items = await this.getAll();
    const filtered = items.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },
};
