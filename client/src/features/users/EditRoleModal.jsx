import { useState } from 'react';
import { Shield, AlertTriangle, Loader2, User } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useUpdateUserRoleMutation } from './usersApi';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';

const ROLE_OPTIONS = [
  {
    value: 'employee',
    label: 'Employee',
    description: 'Basic access - profile, attendance, leave requests',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    borderColor: 'border-blue-300 dark:border-blue-700',
  },
  {
    value: 'manager',
    label: 'Manager',
    description: 'Team management, leave approvals, team analytics',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    borderColor: 'border-purple-300 dark:border-purple-700',
  },
  {
    value: 'hr_admin',
    label: 'HR Admin',
    description: 'Human Resources - onboarding, payroll, leave management',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    borderColor: 'border-orange-300 dark:border-orange-700',
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Operations lead - company ops, departments, system config',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-300 dark:border-yellow-700',
  },
  {
    value: 'super_admin',
    label: 'Super Admin',
    description: 'Tenant owner - complete system access, billing, full control',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    borderColor: 'border-red-300 dark:border-red-700',
  },
];

export const EditRoleModal = ({ open, onClose, user }) => {
  const currentUser = useSelector(selectCurrentUser);
  const [selectedRole, setSelectedRole] = useState(user?.role || 'employee');
  const [updateUserRole, { isLoading }] = useUpdateUserRoleMutation();

  // Filter available roles based on current user's permissions
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedRole === user.role) {
      toast.error('No changes made');
      return;
    }

    try {
      await updateUserRole({
        userId: user._id,
        role: selectedRole,
      }).unwrap();
      
      toast.success(`Role updated to ${ROLE_OPTIONS.find(r => r.value === selectedRole)?.label}`);
      onClose();
    } catch (error) {
      console.error('Update role error:', error);
      toast.error(error?.data?.error?.message || 'Failed to update role');
    }
  };

  if (!user) return null;

  const currentRoleOption = ROLE_OPTIONS.find(r => r.value === user.role);

  return (
    <Modal open={open} onClose={onClose} title="Edit User Role" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* User Info */}
        <div className="p-4 rounded-xl bg-accent/30 border border-border">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-foreground">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Current Role */}
        <div>
          <Label className="text-sm text-muted-foreground mb-2 block">Current Role</Label>
          <div className={`p-3 rounded-lg border ${currentRoleOption?.borderColor} ${currentRoleOption?.bgColor}`}>
            <div className="flex items-center gap-2">
              <Shield className={`h-4 w-4 ${currentRoleOption?.color}`} />
              <span className={`font-bold ${currentRoleOption?.color}`}>
                {currentRoleOption?.label}
              </span>
            </div>
          </div>
        </div>

        {/* New Role Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Select New Role
          </Label>
          
          <div className="space-y-2">
            {availableRoles.map((roleOption) => {
              const isSelected = selectedRole === roleOption.value;
              
              return (
                <label
                  key={roleOption.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? `${roleOption.borderColor} ${roleOption.bgColor}`
                      : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50'
                  }`}
                >
                  <input
                    type="radio"
                    value={roleOption.value}
                    checked={isSelected}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="mt-1 h-4 w-4 text-primary focus:ring-2 focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isSelected ? roleOption.color : 'text-foreground'}`}>
                        {roleOption.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {roleOption.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Warning for role change */}
        {selectedRole !== user.role && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Role Change Warning</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                Changing this user's role will immediately update their permissions. They may need to log out and log back in for all changes to take effect.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || selectedRole === user.role}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              'Update Role'
            )}
          </Button>
        </div>

      </form>
    </Modal>
  );
};
