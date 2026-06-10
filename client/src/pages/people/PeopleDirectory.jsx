import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Building2, Award, Calendar } from 'lucide-react';
import { useGetEmployeesQuery } from '@/features/people/peopleApi';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { OnboardEmployeeModal } from '@/features/people/components/OnboardEmployeeModal';

const PeopleDirectory = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading } = useGetEmployeesQuery({ page, limit: 10, search });

  const columns = [
    {
      header: 'Employee',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
            {row.user?.avatar ? (
              <img src={row.user.avatar} alt="avatar" className="h-full w-full rounded-full object-cover" />
            ) : (
              `${row.user?.firstName?.[0] || ''}${row.user?.lastName?.[0] || ''}`
            )}
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
      header: 'Role & Department',
      accessor: (row) => (
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
      header: 'Employment',
      accessor: (row) => (
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
      header: 'Status',
      accessor: (row) => (
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
          onSearch={setSearch}
          searchPlaceholder="Search employees by name or email..."
          onRowClick={(row) => navigate(`/dashboard/people/${row._id}`)}
        />
      </div>

      <OnboardEmployeeModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default PeopleDirectory;
