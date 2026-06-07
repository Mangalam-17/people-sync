import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users2, Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import {
  useGetTeamsQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} from '@/features/org/orgApi';
import { useGetAllDepartmentsQuery } from '@/features/org/orgApi';
import DataTable from '@/components/DataTable';
import Modal from '@/components/ui/modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const teamSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  departmentId: z.string().min(1, 'Department is required'),
  description: z.string().max(500).optional().or(z.literal('')),
});

const TeamsPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filterDept, setFilterDept] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const queryParams = { page, limit: 20, search };
  if (filterDept) queryParams.departmentId = filterDept;

  const { data: listData, isLoading } = useGetTeamsQuery(queryParams);
  const { data: deptData } = useGetAllDepartmentsQuery();
  const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation();
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation();
  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation();

  const teams = listData?.data || [];
  const pagination = listData?.pagination;
  const departments = deptData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(teamSchema) });

  const openCreate = () => {
    setEditing(null);
    reset({ name: '', departmentId: '', description: '' });
    setModalOpen(true);
  };

  const openEdit = (team) => {
    setEditing(team);
    reset({
      name: team.name,
      departmentId: team.departmentId?._id || '',
      description: team.description || '',
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    const payload = { ...data };
    if (!payload.description) payload.description = null;

    try {
      if (editing) {
        await updateTeam({ id: editing._id, ...payload }).unwrap();
        toast.success('Team updated');
      } else {
        await createTeam(payload).unwrap();
        toast.success('Team created');
      }
      setModalOpen(false);
      reset();
    } catch (err) {
      toast.error(err?.data?.error?.message || 'Something went wrong');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTeam(deleteTarget._id).unwrap();
      toast.success('Team deleted');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.data?.error?.message || 'Failed to delete');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Team',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            <Users2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            {row.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{row.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'departmentId',
      label: 'Department',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm text-foreground">{row.departmentId?.name || '—'}</span>
        </div>
      ),
    },
    {
      key: 'leadId',
      label: 'Lead',
      render: (row) =>
        row.leadId ? (
          <span className="text-sm text-foreground">{row.leadId.firstName} {row.leadId.lastName}</span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
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
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Teams</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage teams across departments</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Team
        </Button>
      </motion.div>

      {/* Filter bar */}
      <div className="mb-4">
        <Select
          value={filterDept}
          onChange={(e) => { setFilterDept(e.target.value); setPage(1); }}
          className="w-full max-w-[220px] h-9 text-sm"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </Select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={teams}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search teams..."
        emptyIcon={Users2}
        emptyTitle="No teams yet"
        emptyDescription="Create your first team within a department"
        emptyAction="Add Team"
        onEmptyAction={openCreate}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Team' : 'New Team'}
        description={editing ? 'Update team details' : 'Create a new team within a department'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team-name">Name *</Label>
            <Input id="team-name" placeholder="Frontend" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-dept">Department *</Label>
            <Select id="team-dept" {...register('departmentId')}>
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </Select>
            {errors.departmentId && <p className="text-xs text-destructive">{errors.departmentId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-desc">Description</Label>
            <Textarea
              id="team-desc"
              placeholder="Brief description of this team..."
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
        title="Delete Team"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TeamsPage;
