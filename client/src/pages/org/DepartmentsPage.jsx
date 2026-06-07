import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, Pencil, Trash2, Users2, MoreHorizontal } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import {
  useGetDepartmentsQuery,
  useGetAllDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} from '@/features/org/orgApi';
import DataTable from '@/components/DataTable';
import Modal from '@/components/ui/modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const departmentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  code: z.string().max(20).optional().or(z.literal('')),
  description: z.string().max(500).optional().or(z.literal('')),
  parentId: z.string().optional().or(z.literal('')),
});

const DepartmentsPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: listData, isLoading } = useGetDepartmentsQuery({ page, limit: 20, search });
  const { data: allDeptData } = useGetAllDepartmentsQuery();
  const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();
  const [deleteDepartment, { isLoading: isDeleting }] = useDeleteDepartmentMutation();

  const departments = listData?.data || [];
  const pagination = listData?.pagination;
  const allDepartments = allDeptData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(departmentSchema) });

  const openCreate = () => {
    setEditing(null);
    reset({ name: '', code: '', description: '', parentId: '' });
    setModalOpen(true);
  };

  const openEdit = (dept) => {
    setEditing(dept);
    reset({
      name: dept.name,
      code: dept.code || '',
      description: dept.description || '',
      parentId: dept.parentId || '',
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    // Clean up empty strings
    const payload = { ...data };
    if (!payload.code) delete payload.code;
    if (!payload.description) payload.description = null;
    if (!payload.parentId) payload.parentId = null;

    try {
      if (editing) {
        await updateDepartment({ id: editing._id, ...payload }).unwrap();
        toast.success('Department updated');
      } else {
        await createDepartment(payload).unwrap();
        toast.success('Department created');
      }
      setModalOpen(false);
      reset();
    } catch (err) {
      toast.error(err?.data?.error?.message || 'Something went wrong');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDepartment(deleteTarget._id).unwrap();
      toast.success('Department deleted');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.data?.error?.message || 'Failed to delete');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Department',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            {row.code && <p className="text-xs text-muted-foreground">{row.code}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'headId',
      label: 'Head',
      render: (row) =>
        row.headId ? (
          <span className="text-sm text-foreground">{row.headId.firstName} {row.headId.lastName}</span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (row) => (
        <span className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
          {row.description || '—'}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      width: '100px',
      render: (row) => (
        <Badge variant={row.isActive ? 'success' : 'secondary'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      width: '80px',
      render: (row) => (
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Departments</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your organization&apos;s department structure</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Department
        </Button>
      </motion.div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={departments}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search departments..."
        emptyIcon={Building2}
        emptyTitle="No departments yet"
        emptyDescription="Create your first department to organize your workforce"
        emptyAction="Add Department"
        onEmptyAction={openCreate}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Department' : 'New Department'}
        description={editing ? 'Update department details' : 'Add a new department to your organization'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dept-name">Name *</Label>
              <Input id="dept-name" placeholder="Engineering" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dept-code">Code</Label>
              <Input id="dept-code" placeholder="ENG" {...register('code')} />
              {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dept-parent">Parent Department</Label>
            <Select id="dept-parent" {...register('parentId')}>
              <option value="">None (Top Level)</option>
              {allDepartments
                .filter((d) => d._id !== editing?._id)
                .map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dept-desc">Description</Label>
            <Textarea
              id="dept-desc"
              placeholder="Brief description of this department..."
              {...register('description')}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 'Saving...' : editing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Department"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DepartmentsPage;
