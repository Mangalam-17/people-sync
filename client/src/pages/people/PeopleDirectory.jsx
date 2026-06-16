import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Building2, Award, Calendar, Shield, Edit2, User } from 'lucide-react';
import { useGetEmployeesQuery } from '@/features/people/peopleApi';
import DataTable from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { OnboardEmployeeModal } from '@/features/people/components/OnboardEmployeeModal';
import { EditRoleModal } from '@/features/users/EditRoleModal';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { useSelector } from 'react-redux';

// Role badge colors
const ROLE_COLORS = {
  employee: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  manager: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  hr_admin: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
  super_admin: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

const ROLE_LABELS = {
  employee: 'Employee',
  manager: 'Manager',
  hr_admin: 'HR Admin',
  super_admin: 'Super Admin',
};

const PeopleDirectory = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRoleUser, setEditRoleUser] = useState(null);
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  const { data, isLoading } = useGetEmployeesQuery({ page, limit: 10, search });

  // Check if current user can edit roles
  const canEditRoles = ['super_admin', 'hr_admin'].includes(currentUser?.role);

  const columns = [
    {
      key: 'employee',
      label: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-foreground">
              {row.user?.firstName} {row.user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground font-medium">{row.user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'System Role',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[row.user?.role] || ROLE_COLORS.employee}`}>
            <Shield className="h-3 w-3" />
            {ROLE_LABELS[row.user?.role] || 'Employee'}
          </div>
          {canEditRoles && (
            <button
              onClick={() => setEditRoleUser(row.user)}
              className="p-1.5 rounded-lg hover:bg-accent transition-colors"
              title="Edit role"
            >
              <Edit2 className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
            </button>
          )}
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department & Title',
      render: (row) => (
        <div>
          <p className="font-bold text-foreground flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-indigo-500" />
            {row.designation?.title || 'No Designation'}
          </p>
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
            <Building2 className="h-3.5 w-3.5" />
            {row.department?.name || 'Unassigned'}
          </p>
        </div>
      ),
    },
    {
      key: 'employment',
      label: 'Employment',
      render: (row) => (
        <div>
          <Badge variant={row.employmentType === 'FULL_TIME' ? 'success' : 'secondary'}>
            {row.employmentType?.replace('_', ' ')}
          </Badge>
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Joined {new Date(row.joiningDate).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge
          variant={
            row.status === 'ACTIVE'
              ? 'success'
              : row.status === 'ON_LEAVE'
              ? 'warning'
              : 'destructive'
          }
        >
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            People Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            Manage your entire workforce and organization members.
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-organic-inner"
        >
          <Plus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      {/* Directory Table */}
      <div className="organic-card !p-0 overflow-hidden">
        <DataTable
          columns={columns}
          data={data?.data?.employees || []}
          isLoading={isLoading}
          pagination={data?.data?.pagination}
          onPageChange={setPage}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search employees by name or email..."
        />
      </div>

      <OnboardEmployeeModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <EditRoleModal 
        open={!!editRoleUser} 
        onClose={() => setEditRoleUser(null)} 
        user={editRoleUser}
      />
    </div>
  );
};

export default PeopleDirectory;
