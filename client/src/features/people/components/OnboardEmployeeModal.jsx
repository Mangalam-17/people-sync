import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOnboardEmployeeMutation } from './peopleApi';
import { useGetDepartmentsQuery } from '@/features/organization/organizationApi';
import { useGetDesignationsQuery } from '@/features/organization/organizationApi';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  departmentId: z.string().optional(),
  designationId: z.string().optional(),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN']).default('FULL_TIME'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  baseSalary: z.number().min(0).default(0),
});

export const OnboardEmployeeModal = ({ open, onClose }) => {
  const [onboardEmployee, { isLoading }] = useOnboardEmployeeMutation();
  const { data: deptData, isLoading: isLoadingDepts } = useGetDepartmentsQuery({ limit: 100 });
  const { data: desigData, isLoading: isLoadingDesigs } = useGetDesignationsQuery({ limit: 100 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      departmentId: '',
      designationId: '',
      employmentType: 'FULL_TIME',
      joiningDate: new Date().toISOString().split('T')[0],
      baseSalary: 0,
    },
  });

  const onSubmit = async (data) => {
    try {
      // Format payload
      const payload = {
        ...data,
        joiningDate: new Date(data.joiningDate).toISOString(),
        departmentId: data.departmentId || undefined,
        designationId: data.designationId || undefined,
      };

      await onboardEmployee(payload).unwrap();
      toast.success('Employee onboarded! An invite email has been sent.');
      reset();
      onClose();
    } catch (error) {
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Department</Label>
            <select
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-50"
              {...register('departmentId')}
              disabled={isLoadingDepts}
            >
              <option value="">Select Department...</option>
              {deptData?.data?.departments?.map((dept) => (
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
              disabled={isLoadingDesigs}
            >
              <option value="">Select Designation...</option>
              {desigData?.data?.designations?.map((desig) => (
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

        <div className="space-y-2">
          <Label>Base Salary (Annual)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input 
              type="number" 
              className="pl-8" 
              {...register('baseSalary', { valueAsNumber: true })} 
            />
          </div>
          {errors.baseSalary && <p className="text-xs text-destructive">{errors.baseSalary.message}</p>}
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
