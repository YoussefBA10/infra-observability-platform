import { LayoutDashboard, Code2, Server, X, MessageSquare, ShieldCheck, BarChart2, History } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Executive Dashboard', icon: LayoutDashboard },
    { path: '/pipeline', label: 'Pipeline Overview', icon: Code2 },
    { path: '/quality', label: 'Code Quality', icon: BarChart2 },
    { path: '/security', label: 'Security Center', icon: ShieldCheck },
    { path: '/history', label: 'Historical Trends', icon: History },
    { path: '/infrastructure', label: 'Infrastructure', icon: Server },
    { path: '/chat', label: 'DevOps Assistant', icon: MessageSquare },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-20"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Navigation</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <nav className="px-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    onClose?.();
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
                  ? 'bg-blue-900/30 text-blue-400 border-l-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;