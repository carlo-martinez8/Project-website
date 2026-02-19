import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Space, message } from 'antd';
import PageHeader from '../components/common/PageHeader';
import FormCard from '../components/common/FormCard';
import InventoryTable from '../components/inventory/InventoryTable';
import { inventoryApi } from '../api/inventoryApi';

function InventoryPage() {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await inventoryApi.getAll();
      setItems(data);
    } catch (err) {
      message.error(err.message || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await inventoryApi.update({ id: editingId, ...values });
        message.success('Item updated.');
      } else {
        await inventoryApi.create(values);
        message.success('Item added.');
      }
      setEditingId(null);
      form.resetFields();
      loadItems();
    } catch (err) {
      message.error(err.message || 'Operation failed');
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({ name: record.name, quantity: record.quantity });
  };

  const handleDelete = async (id) => {
    try {
      await inventoryApi.delete(id);
      if (editingId === id) {
        setEditingId(null);
        form.resetFields();
      }
      setItems((prev) => prev.filter((i) => i.id !== id));
      message.success('Item deleted.');
    } catch (err) {
      message.error(err.message || 'Delete failed');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    form.resetFields();
  };

  return (
    <>
      <PageHeader
        title="Carlo's Inventory"
        description="Add, edit, and remove items."
      />
      <FormCard title={editingId ? 'Edit Item' : 'Add Item'}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ quantity: 1 }}
        >
          <Form.Item
            name="name"
            label="Item Name"
            rules={[{ required: true, message: 'Please enter item name' }]}
          >
            <Input placeholder="e.g. Laptop" />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {editingId ? 'Update Item' : 'Add Item'}
            </Button>
            {editingId && (
              <Button onClick={handleCancel}>Cancel</Button>
            )}
          </Space>
        </Form>
      </FormCard>
      <FormCard title="Inventory List">
        <InventoryTable
          dataSource={items}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </FormCard>
    </>
  );
}

export default InventoryPage;
