import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarOff,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
} from 'lucide-react';
import {
  useGetLeaveRequestsQuery,
  useGetLeaveBalanceQuery,
  useCancelLeaveMutation,
} from '@/features/leaves/leavesApi';
import { useAuth } from '@/hooks/useAuth';
import ApplyLeaveModal from '@/features/leaves/components/ApplyLeaveModal';
import DataTable from '@/components/DataTable';
import toast from 'react-hot-toast';

const LeavesPage = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  // Super Admin should not have access to "My Leaves"
  if (isSuperAdmin) {
    return (
      <div className="space-y-4 animate-fade-in pb-6">
        <div className="organic-card !p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Super Admin Access</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                As a Super Admin, you don't need to request leaves. You can view and manage all leave requests through the <strong>Leave Approvals</strong> section.
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/dashboard/leave-approvals'}
              className="mt-2 h-9 px-6 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:scale-105 transition-transform shadow-organic-inner"
            >
              Go to Leave Approvals
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const { data: leaveRequests, isLoading: requestsLoading } = useGetLeaveRequestsQuery({});
  const { data: leaveBalance, isLoading: balanceLoading } = useGetLeaveBalanceQuery({});
  const [cancelLeave] = useCancelLeaveMutation();

  const handleCancelLeave = async (leaveId) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) {
      return;
    }

    try {
      await cancelLeave(leaveId).unwrap();
      toast.success('Leave cancelled successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to cancel leave');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', text: 'Pending' },
      approved: { color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', text: 'Approved' },
      rejected: { color: 'bg-red-500/10 text-red-600 border-red-500/20', text: 'Rejected' },
      cancelled: { color: 'bg-gray-500/10 text-gray-600 border-gray-500/20', text: 'Cancelled' },
    };

    const badge = badges[status] || badges.pending;

    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const getLeaveTypeLabel = (type) => {
    const labels = {
      sick: 'Sick Leave',
      casual: 'Casual Leave',
      earned: 'Earned Leave',
      unpaid: 'Unpaid Leave',
      maternity: 'Maternity Leave',
      paternity: 'Paternity Leave',
      bereavement: 'Bereavement Leave',
      compensatory: 'Compensatory Leave',
    };
    return labels[type] || type;
  };

  const leaveBalanceData = leaveBalance?.data?.leaveTypes || {};

  return (
    <div className="space-y-4 animate-fade-in pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Leaves
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Manage leave requests and view your leave balance
          </p>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="h-9 px-4 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-organic-inner w-fit"
        >
          <Plus className="h-3.5 w-3.5" />
          Apply Leave
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(leaveBalanceData).slice(0, 4).map(([type, balance]) => (
          <motion.div
            key={type}
            className="organic-card !p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {type}
              </span>
              <CalendarOff className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-foreground">
                {balance.total - balance.used - balance.pending}
              </span>
              <span className="text-[10px] text-muted-foreground">
                / {balance.total}
              </span>
            </div>
            <div className="mt-1 text-[9px] text-muted-foreground">
              Used: {balance.used} | Pending: {balance.pending}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Leave Requests Table */}
      <motion.div
        className="organic-card !p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-sm font-bold text-foreground mb-3">My Leave Requests</h3>

        {requestsLoading ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            Loading...
          </div>
        ) : !leaveRequests?.data?.length ? (
          <div className="text-center py-8">
            <CalendarOff className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-bold text-foreground mb-1">No leave requests</p>
            <p className="text-xs text-muted-foreground">
              Click "Apply Leave" to submit a request
            </p>
          </div>
        ) : (
          <DataTable
            columns={[
              {
                header: 'Leave Type',
                accessor: 'leaveType',
                cell: (row) => (
                  <span className="text-xs font-medium">
                    {getLeaveTypeLabel(row.leaveType)}
                  </span>
                ),
              },
              {
                header: 'From - To',
                accessor: 'startDate',
                cell: (row) => (
                  <span className="text-xs text-muted-foreground">
                    {new Date(row.startDate).toLocaleDateString()} - {new Date(row.endDate).toLocaleDateString()}
                  </span>
                ),
              },
              {
                header: 'Days',
                accessor: 'numberOfDays',
                cell: (row) => (
                  <span className="text-xs font-bold">{row.numberOfDays}</span>
                ),
              },
              {
                header: 'Status',
                accessor: 'status',
                cell: (row) => getStatusBadge(row.status),
              },
              {
                header: 'Reason',
                accessor: 'reason',
                cell: (row) => (
                  <span className="text-xs text-muted-foreground truncate max-w-[200px] block">
                    {row.reason}
                  </span>
                ),
              },
              {
                header: 'Actions',
                accessor: '_id',
                cell: (row) => (
                  row.status === 'pending' && (
                    <button
                      onClick={() => handleCancelLeave(row._id)}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Cancel
                    </button>
                  )
                ),
              },
            ]}
            data={leaveRequests.data}
          />
        )}
      </motion.div>

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        leaveBalance={leaveBalanceData}
      />
    </div>
  );
};

export default LeavesPage;
