import { Users } from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

const DepartmentBreakdown = ({ data = [], totalEmployees = 0 }) => {
  return (
    <div>
      <h3 className="text-sm font-bold text-foreground mb-3">Department Breakdown</h3>
      
      {data && data.length > 0 ? (
        <div className="space-y-2">
          {data.slice(0, 5).map((dept, index) => {
            const percentage = totalEmployees > 0
              ? ((dept.count / totalEmployees) * 100).toFixed(0)
              : 0;
            
            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{dept.name}</span>
                  <span className="font-bold text-muted-foreground">{dept.count}</span>
                </div>
                <div className="h-1.5 bg-accent rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 bg-card rounded-xl border border-border border-dashed">
          <Users className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
          <p className="text-xs text-muted-foreground font-medium text-center">
            No department data
          </p>
        </div>
      )}
    </div>
  );
};

export default DepartmentBreakdown;
