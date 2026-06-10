import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Building2, MapPin, Award, Calendar, DollarSign, Clock } from 'lucide-react';
import { useGetEmployeeByIdQuery } from '@/features/people/peopleApi';
import { Badge } from '@/components/ui/badge';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetEmployeeByIdQuery(id);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse font-medium">Loading profile...</div>;
  }

  if (error || !data?.data?.employee) {
    return <div className="p-8 text-center text-destructive font-bold">Failed to load profile.</div>;
  }

  const employee = data.data.employee;
  const user = employee.userId;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/dashboard/people')}
        className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Directory
      </button>

      {/* Profile Header Card */}
      <div className="app-window bg-card border border-border p-8 relative overflow-hidden">
        {/* Decorative Background Blob */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Huge Avatar */}
          <div className="h-32 w-32 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary font-bold text-4xl shadow-organic border border-primary/20 shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="h-full w-full rounded-[2rem] object-cover" />
            ) : (
              `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                  {user?.firstName} {user?.lastName}
                </h1>
                <Badge variant={employee.status === 'ACTIVE' ? 'success' : 'secondary'} className="px-3 py-1 text-xs">
                  {employee.status}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
                <Award className="h-5 w-5 text-indigo-500" />
                {employee.designationId?.title || 'No Designation'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3">
              <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="h-4 w-4" />
                {user?.email}
              </span>
              <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Building2 className="h-4 w-4" />
                {employee.departmentId?.name || 'Unassigned'}
              </span>
              <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4" />
                {employee.employmentType?.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Work Information */}
        <div className="lg:col-span-2 organic-card">
          <h3 className="text-lg font-bold text-foreground mb-6">Work Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-card border border-border">
              <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Department</p>
              <p className="text-sm font-bold text-foreground">{employee.departmentId?.name || '—'}</p>
            </div>
            
            <div className="p-4 rounded-2xl bg-card border border-border">
              <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Team</p>
              <p className="text-sm font-bold text-foreground">{employee.teamId?.name || '—'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border">
              <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Joining Date</p>
              <p className="text-sm font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-500" />
                {new Date(employee.joiningDate).toLocaleDateString()}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border">
              <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Base Salary</p>
              <p className="text-sm font-bold text-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                {employee.baseSalary ? `${employee.currency} ${employee.baseSalary.toLocaleString()}` : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="organic-card">
          <h3 className="text-lg font-bold text-foreground mb-6">Emergency Contact</h3>
          
          {employee.emergencyContact ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-card border border-border">
                <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Contact Name</p>
                <p className="text-sm font-bold text-foreground">{employee.emergencyContact.name}</p>
                <Badge variant="secondary" className="mt-2">{employee.emergencyContact.relationship}</Badge>
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border">
                <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Phone Number</p>
                <p className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4 text-purple-500" />
                  {employee.emergencyContact.phone}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-card rounded-2xl border border-border border-dashed">
              <Phone className="h-8 w-8 text-muted-foreground mb-3 opacity-50" />
              <p className="text-sm font-bold text-foreground">No Contact Listed</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Please ask the employee to update.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default EmployeeProfile;
