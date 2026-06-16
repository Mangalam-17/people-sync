import { useState } from 'react';
import { X, CalendarOff } from 'lucide-react';
import Modal from '@/components/ui/modal';
import { useApplyLeaveMutation } from '../leavesApi';
import toast from 'react-hot-toast';

const ApplyLeaveModal = ({ isOpen, onClose, leaveBalance }) => {
  const [applyLeave, { isLoading }] = useApplyLeaveMutation();

  const [formData, setFormData] = useState({
    leaveType: 'casual',
    startDate: '',
    endDate: '',
    isHalfDay: false,
    halfDaySession: 'morning',
    reason: '',
    contactPhone: '',
    contactEmail: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.isHalfDay ? formData.startDate : formData.endDate,
        isHalfDay: formData.isHalfDay,
        halfDaySession: formData.isHalfDay ? formData.halfDaySession : undefined,
        reason: formData.reason,
        contactDuringLeave: {
          phone: formData.contactPhone,
          email: formData.contactEmail,
        },
      };

      await applyLeave(payload).unwrap();
      toast.success('Leave application submitted successfully!');
      onClose();
      
      // Reset form
      setFormData({
        leaveType: 'casual',
        startDate: '',
        endDate: '',
        isHalfDay: false,
        halfDaySession: 'morning',
        reason: '',
        contactPhone: '',
        contactEmail: '',
      });
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to submit leave application');
    }
  };

  const getAvailableBalance = (type) => {
    if (!leaveBalance[type]) return 0;
    const balance = leaveBalance[type];
    return balance.total - balance.used - balance.pending;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Apply for Leave">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Leave Type */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            Leave Type
          </label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="casual">Casual Leave ({getAvailableBalance('casual')} available)</option>
            <option value="sick">Sick Leave ({getAvailableBalance('sick')} available)</option>
            <option value="earned">Earned Leave ({getAvailableBalance('earned')} available)</option>
            <option value="unpaid">Unpaid Leave</option>
            <option value="maternity">Maternity Leave ({getAvailableBalance('maternity')} available)</option>
            <option value="paternity">Paternity Leave ({getAvailableBalance('paternity')} available)</option>
            <option value="bereavement">Bereavement Leave ({getAvailableBalance('bereavement')} available)</option>
            <option value="compensatory">Compensatory Leave ({getAvailableBalance('compensatory')} available)</option>
          </select>
        </div>

        {/* Half Day Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isHalfDay"
            name="isHalfDay"
            checked={formData.isHalfDay}
            onChange={handleChange}
            className="rounded border-border"
          />
          <label htmlFor="isHalfDay" className="text-xs font-medium text-foreground">
            Half Day Leave
          </label>
        </div>

        {formData.isHalfDay && (
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Session
            </label>
            <select
              name="halfDaySession"
              value={formData.halfDaySession}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="morning">Morning (First Half)</option>
              <option value="afternoon">Afternoon (Second Half)</option>
            </select>
          </div>
        )}

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {!formData.isHalfDay && (
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
        </div>

        {/* Reason */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            Reason
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Please provide a reason for your leave..."
            className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* Contact During Leave */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Contact Phone
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Contact Email
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-9 px-4 rounded-full bg-accent text-foreground text-xs font-bold hover:bg-accent/80 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 h-9 px-4 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ApplyLeaveModal;
