import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, User } from 'lucide-react';
import {
  useGetPendingLeavesQuery,
  useReviewLeaveMutation,
} from '@/features/leaves/leavesApi';
import DataTable from '@/components/DataTable';
import toast from 'react-hot-toast';

const LeaveApprovalsPage = () => {
  const { data: pendingLeaves, isLoading } = useGetPendingLeavesQuery({});
  const [reviewLeave] = useReviewLeaveMutation();
  const [reviewingId, setReviewingId] = useState(null);

  const handleReview = async (leaveId, decision) => {
    const reviewNotes = decision === 'rejected'
      ? prompt('Please provide a reason for rejection:')
      : '';

    if (decision === 'rejected' && !reviewNotes) {
      return; // User cancelled
    }

    try {
      setReviewingId(leaveId);
      await reviewLeave({ id: leaveId, decision, reviewNotes }).unwrap();
      toast.success(`Leave ${decision} successfully`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to review leave');
    } finally {
      setReviewingId(null);
    }
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

  return (
    <div className="space-y-4 animate-fade-in pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Leave Approvals
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          Review and approve pending leave requests
        </p>
      </div>

      {/* Pending Count Card */}
      <motion.div
        className="organic-card !p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <Clock className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Pending Approvals
            </p>
            <p className="text-2xl font-bold text-foreground">
              {pendingLeaves?.data?.length || 0}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Pending Leaves Table */}
      <motion.div
        className="organic-card !p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-sm font-bold text-foreground mb-3">Pending Requests</h3>

        {isLoading ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            Loading...
          </div>
        ) : !pendingLeaves?.data?.length ? (
          <div className="text-center py-8">
            <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-foreground mb-1">All caught up!</p>
            <p className="text-xs text-muted-foreground">
              No pending leave requests to review
            </p>
          </div>
        ) : (
          <DataTable
            columns={[
              {
                header: 'Employee',
                accessor: 'employee',
                cell: (row) => (
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {row.employee?.firstName} {row.employee?.lastName}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {row.employee?.email}
                      </p>
                    </div>
                  </div>
                ),
              },
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
                header: 'Duration',
                accessor: 'startDate',
                cell: (row) => (
                  <div>
                    <p className="text-xs text-foreground">
                      {new Date(row.startDate).toLocaleDateString()} - {new Date(row.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {row.numberOfDays} {row.numberOfDays === 1 ? 'day' : 'days'}
                      {row.isHalfDay && ' (Half Day)'}
                    </p>
                  </div>
                ),
              },
              {
                header: 'Reason',
                accessor: 'reason',
                cell: (row) => (
                  <span className="text-xs text-muted-foreground truncate max-w-[250px] block">
                    {row.reason}
                  </span>
                ),
              },
              {
                header: 'Applied On',
                accessor: 'appliedDate',
                cell: (row) => (
                  <span className="text-xs text-muted-foreground">
                    {new Date(row.appliedDate).toLocaleDateString()}
                  </span>
                ),
              },
              {
                header: 'Actions',
                accessor: '_id',
                cell: (row) => (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReview(row._id, 'approved')}
                      disabled={reviewingId === row._id}
                      className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReview(row._id, 'rejected')}
                      disabled={reviewingId === row._id}
                      className="px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-[10px] font-bold border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      <XCircle className="h-3 w-3" />
                      Reject
                    </button>
                  </div>
                ),
              },
            ]}
            data={pendingLeaves.data}
          />
        )}
      </motion.div>
    </div>
  );
};

export default LeaveApprovalsPage;
