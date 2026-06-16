import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Plus, Pencil, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import {
  useGetDesignationsQuery,
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
  useGetAllDepartmentsQuery,
} from '@/features/org/orgApi';
import DataTable from '@/components/DataTable';
import Modal from '@/components/ui/modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const designationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  departmentId: z.string().min(1, 'Department is required'),
  level: z.string().transform((v) => (v ? parseInt(v, 10) : 0)).pipe(z.number().min(0).max(20)),
  description: z.string().max(500).optional().or(z.literal('')),
});

const DesignationsPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: listData, isLoading } = useGetDesignationsQuery({ page, limit: 20, search });
  const { data: deptData, isLoading: isLoadingDepts } = useGetAllDepartmentsQuery();
  
  const [createDesignation, { isLoading: isCreating }] = useCreateDesignationMutation();
  const [updateDesignation, { isLoading: isUpdating }] = useUpdateDesignationMutation();
  const [deleteDesignation, { isLoading: isDeleting }] = useDeleteDesignationMutation();

  const designations = listData?.data || [];
  const pagination = listData?.pagination;
  const departments = deptData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(designationSchema) });

  const openCreate = () => {
    setEditing(null);
    reset({ title: '', departmentId: '', level: '0', description: '' });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    reset({
      title: item.title,
      departmentId: item.departmentId?._id || item.departmentId || '',
      level: String(item.level ?? 0),
      description: item.description || '',
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    const payload = { ...data };
    if (!payload.description) payload.description = null;

    try {
      if (editing) {
        await updateDesignation({ id: editing._id, ...payload }).unwrap();
        toast.success('Designation updated');
      } else {
        await createDesignation(payload).unwrap();
        toast.success('Designation created');
      }
      setModalOpen(false);
      reset();
    } catch (err) {
      toast.error(err?.data?.error?.message || 'Something went wrong');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDesignation(deleteTarget._id).unwrap();
      toast.success('Designation deleted');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.data?.error?.message || 'Failed to delete');
    }
  };

  const levelColors = [
    'bg-slate-500/10 text-slate-500',
    'bg-blue-500/10 text-blue-500',
    'bg-cyan-500/10 text-cyan-500',
    'bg-emerald-500/10 text-emerald-500',
    'bg-amber-500/10 text-amber-500',
    'bg-orange-500/10 text-orange-500',
    'bg-rose-500/10 text-rose-500',
    'bg-purple-500/10 text-purple-500',
    'bg-indigo-500/10 text-indigo-500',
  ];

  const columns = [
    {
      key: 'title',
      label: 'Designation',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
            <Award className="h-4 w-4 text-purple-500" />
          </div>
          <div>
            <p className="font-medium text-foreground">{row.title}</p>
            {row.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 max-w-[250px]">{row.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      render: (row) => (
        <span className="text-sm font-medium text-foreground">
          {row.departmentId?.name || 'Unknown'}
        </span>
      ),
    },
    {
      key: 'level',
      label: 'Level',
      width: '100px',
      render: (row) => (
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${levelColors[row.level % levelColors.length]}`}>
          Level {row.level}
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
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Designations</h1>
          <p className="text-sm text-muted-foreground mt-1">Define job titles by department</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Designation
        </Button>
      </motion.div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={designations}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search designations..."
        emptyIcon={Award}
        emptyTitle="No designations yet"
        emptyDescription="Create designations like 'Software Engineer' in Engineering."
        emptyAction="Add Designation"
        onEmptyAction={openCreate}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Designation' : 'New Designation'}
        description={editing ? 'Update designation details' : 'Add a new job title / designation'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="desig-dept">Department *</Label>
            <select
              id="desig-dept"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-50"
              {...register('departmentId')}
              disabled={isLoadingDepts}
            >
              <option value="">Select Department...</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.departmentId && <p className="text-xs text-destructive">{errors.departmentId.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="desig-title">Title *</Label>
              <Input id="desig-title" placeholder="Software Engineer" {...register('title')} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="desig-level">Level</Label>
              <Input id="desig-level" type="number" min="0" max="20" placeholder="0" {...register('level')} />
              {errors.level && <p className="text-xs text-destructive">{errors.level.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desig-desc">Description</Label>
            <Textarea
              id="desig-desc"
              placeholder="Brief description of this designation..."
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
        title="Delete Designation"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DesignationsPage;
