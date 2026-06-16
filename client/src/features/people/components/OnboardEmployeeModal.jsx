import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Shield, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOnboardEmployeeMutation } from '../peopleApi';
import { useGetDepartmentsQuery, useGetDesignationsQuery } from '@/features/org/orgApi';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { useSelector } from 'react-redux';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['employee', 'manager', 'hr_admin', 'admin', 'super_admin']).default('employee'),
  departmentId: z.string().optional(),
  designationId: z.string().optional(),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN']).default('FULL_TIME'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  baseSalary: z.number().min(0).default(0),
});

// Role configurations
const ROLE_OPTIONS = [
  {
    value: 'employee',
    label: 'Employee',
    description: 'Basic access - can view own profile, request leaves, mark attendance',
    color: 'text-blue-600 dark:text-blue-400',
    requiredRole: 'hr_admin', // Minimum role required to assign this
  },
  {
    value: 'manager',
    label: 'Manager',
    description: 'Can manage team, approve leaves, view team analytics',
    color: 'text-purple-600 dark:text-purple-400',
    requiredRole: 'hr_admin',
  },
  {
    value: 'hr_admin',
    label: 'HR Admin',
    description: 'Human Resources - onboarding, recruitment, payroll, leave management',
    color: 'text-orange-600 dark:text-orange-400',
    requiredRole: 'admin',
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Operations lead - company ops, departments, teams, system config, HR oversight',
    color: 'text-yellow-600 dark:text-yellow-400',
    requiredRole: 'super_admin',
  },
  {
    value: 'super_admin',
    label: 'Super Admin',
    description: 'Tenant owner - complete system access, billing, subscription, full control',
    color: 'text-red-600 dark:text-red-400',
    requiredRole: 'super_admin',
  },
];

export const OnboardEmployeeModal = ({ open, onClose }) => {
  const currentUser = useSelector(selectCurrentUser);
  const [onboardEmployee, { isLoading }] = useOnboardEmployeeMutation();
  const { data: deptData, isLoading: isLoadingDepts } = useGetDepartmentsQuery({ limit: 100 });
  const { data: desigData, isLoading: isLoadingDesigs } = useGetDesignationsQuery({ limit: 100 });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'employee',
      departmentId: '',
      designationId: '',
      employmentType: 'FULL_TIME',
      joiningDate: new Date().toISOString().split('T')[0],
    },
  });

  const selectedDepartmentId = watch('departmentId');
  const selectedRole = watch('role');
  
  const availableDesignations = desigData?.data?.filter(
    (desig) => desig.departmentId === selectedDepartmentId || desig.departmentId?._id === selectedDepartmentId
  ) || [];

  // Filter roles based on current user's permissions
  const availableRoles = ROLE_OPTIONS.filter((roleOption) => {
    if (currentUser.role === 'super_admin') return true; // Super admin can assign any role
    if (currentUser.role === 'admin') {
      return ['employee', 'manager', 'hr_admin'].includes(roleOption.value); // Admin can assign employee, manager, hr_admin
    }
    if (currentUser.role === 'hr_admin') {
      return ['employee', 'manager'].includes(roleOption.value); // HR Admin can assign employee and manager
    }
    return roleOption.value === 'employee'; // Others can only assign employee
  });

  const onSubmit = async (data) => {
    try {
      // Format payload
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        employmentType: data.employmentType,
        joiningDate: new Date(data.joiningDate).toISOString(),
      };

      // Only include departmentId and designationId if they have values
      if (data.departmentId) {
        payload.departmentId = data.departmentId;
      }
      if (data.designationId) {
        payload.designationId = data.designationId;
      }

      console.log('Submitting payload:', payload);

      await onboardEmployee(payload).unwrap();
      toast.success('Employee onboarded! An invite email has been sent.');
      reset();
      onClose();
    } catch (error) {
      console.error('Onboard error:', error);
      toast.error(error?.data?.error?.message || 'Failed to onboard employee');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Onboard New Employee" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input {...register('firstName')} placeholder="John" />
            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input {...register('lastName')} placeholder="Doe" />
            {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Email Address</Label>
          <Input type="email" {...register('email')} placeholder="john.doe@company.com" />
          <p className="text-xs text-muted-foreground">An invite link will be sent to this email.</p>
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        {/* Role Selection */}
        <div className="space-y-3 p-4 rounded-xl bg-accent/30 border border-border">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <Label className="text-sm font-semibold">User Role & Permissions</Label>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {availableRoles.map((roleOption) => {
              const isSelected = selectedRole === roleOption.value;
              
              return (
                <label
                  key={roleOption.value}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50'
                  }`}
                >
                  <input
                    type="radio"
                    {...register('role')}
                    value={roleOption.value}
                    className="mt-1 h-4 w-4 text-primary focus:ring-2 focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${roleOption.color}`}>
                        {roleOption.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {roleOption.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          {selectedRole && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {selectedRole === 'employee' && 'This user will have basic access to their profile, attendance, and leave requests.'}
                {selectedRole === 'manager' && 'This user can manage their team, approve leaves, and view team analytics.'}
                {selectedRole === 'hr_admin' && 'This user will have full HR administrative access including onboarding and payroll.'}
                {selectedRole === 'super_admin' && 'This user will have complete system access including settings and billing.'}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Department</Label>
            <select
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-50"
              {...register('departmentId')}
              disabled={isLoadingDepts}
            >
              <option value="">Select Department...</option>
              {deptData?.data?.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Designation</Label>
            <select
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-50"
              {...register('designationId')}
              disabled={isLoadingDesigs || !selectedDepartmentId}
            >
              <option value="">Select Designation...</option>
              {availableDesignations.map((desig) => (
                <option key={desig._id} value={desig._id}>
                  {desig.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Employment Type</Label>
            <select
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              {...register('employmentType')}
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERN">Intern</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Joining Date</Label>
            <Input type="date" {...register('joiningDate')} />
            {errors.joiningDate && <p className="text-xs text-destructive">{errors.joiningDate.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Onboard Employee'}
          </Button>
        </div>

      </form>
    </Modal>
  );
};
