import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Users2,
  ChevronDown,
  ChevronRight,
  User,
  Loader2,
  Network,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useGetOrgChartQuery } from '@/features/org/orgApi';

const OrgChartNode = ({ node, level = 0, isLast = false }) => {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = (node.children?.length > 0) || (node.teams?.length > 0);

  return (
    <div className="relative">
      {/* Connector line from parent */}
      {level > 0 && (
        <div className="absolute top-0 -left-6 w-6 h-5 border-l-2 border-b-2 border-border rounded-bl-lg" />
      )}

      {/* Node card */}
      <motion.div
        className="relative mb-1"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: level * 0.05 }}
      >
        <button
          onClick={() => hasChildren && setExpanded(!expanded)}
          className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl border transition-all text-left group ${
            node.type === 'team'
              ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10'
              : 'border-border bg-card hover:bg-accent/50 hover:border-muted-foreground/20'
          }`}
        >
          {/* Expand/Collapse icon */}
          {hasChildren && (
            <div className="flex-shrink-0">
              {expanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>
          )}
          {!hasChildren && <div className="w-3.5 flex-shrink-0" />}

          {/* Icon */}
          <div
            className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              node.type === 'team'
                ? 'bg-emerald-500/10'
                : 'bg-blue-500/10'
            }`}
          >
            {node.type === 'team' ? (
              <Users2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <Building2 className="h-4 w-4 text-blue-500" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground truncate">{node.name}</p>
              {node.code && (
                <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {node.code}
                </span>
              )}
            </div>
            {node.headId && (
              <div className="flex items-center gap-1 mt-0.5">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {node.headId.firstName} {node.headId.lastName}
                </span>
              </div>
            )}
            {node.leadId && (
              <div className="flex items-center gap-1 mt-0.5">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {node.leadId.firstName} {node.leadId.lastName}
                </span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {node.children?.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {node.children.length} dept{node.children.length !== 1 ? 's' : ''}
              </span>
            )}
            {node.teams?.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {node.teams.length} team{node.teams.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </button>
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            className="pl-6 relative"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Vertical connector line */}
            {(node.children?.length > 0 || node.teams?.length > 0) && (
              <div className="absolute left-0 top-0 bottom-4 w-0 border-l-2 border-border" />
            )}

            {/* Sub-departments */}
            {node.children?.map((child, i) => (
              <OrgChartNode
                key={child._id}
                node={child}
                level={level + 1}
                isLast={i === node.children.length - 1 && node.teams?.length === 0}
              />
            ))}

            {/* Teams */}
            {node.teams?.map((team, i) => (
              <OrgChartNode
                key={team._id}
                node={team}
                level={level + 1}
                isLast={i === node.teams.length - 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const OrgChartPage = () => {
  const { data, isLoading } = useGetOrgChartQuery();
  const chart = data?.data || [];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Org Chart</h1>
          <p className="text-sm text-muted-foreground mt-1">Interactive view of your organization structure</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-blue-500/20 border border-blue-500/30" />
              Department
            </span>
            <span className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-emerald-500/20 border border-emerald-500/30" />
              Team
            </span>
          </div>
        </div>
      </motion.div>

      {/* Chart */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
        </div>
      )}

      {!isLoading && chart.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center py-20 rounded-xl border border-border bg-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center mb-4">
            <Network className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">No org structure yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Start by creating departments and teams to see your organization chart
          </p>
        </motion.div>
      )}

      {!isLoading && chart.length > 0 && (
        <motion.div
          className="rounded-xl border border-border bg-card p-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {chart.map((node, i) => (
            <OrgChartNode key={node._id} node={node} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default OrgChartPage;
