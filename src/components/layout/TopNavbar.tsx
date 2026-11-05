import React, { useState } from 'react';
import {
  Menu,
  Search,
  HelpCircle,
  Bell,
  ChevronDown,
  User,
  Shield,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';

interface TopNavbarProps {
  activeTab: string;
  onNavigate?: (tab: string) => void;
  onOpenMobile?: () => void;
  onSearchFocus?: () => void;
  onShowToast?: (text: string, type?: 'success' | 'error') => void;
  onSignOut?: () => void;
}

const TAB_BREADCRUMBS: Record<string, { section: string; module: string; page: string }> = {
  home: { section: 'Overview', module: 'Enterprise Operations', page: 'Operations Hub' },
  'design-asset': { section: 'Design & Engineering', module: 'Design Tokens', page: 'Design Asset Library' },
  telemetry: { section: 'Operations', module: 'Telemetry Gateway', page: 'Real-Time Sensor Console' },
  sales: { section: 'Sales', module: 'Export Division', page: 'Sales Operations Overview' },
  purchase: { section: 'Purchase', module: 'Procurement', page: 'Raw Harvest & Vendor Deliveries' },
  preprocessing: { section: 'Pre Processing', module: 'Line Operations', page: 'Grading & Chemical Screens' },
  qc: { section: 'Quality Control (QC)', module: 'Lab & Assurance', page: 'Lot Traceability & TCBS Matrix' },
  production: { section: 'Production', module: 'Cryogenic Blast Lines', page: 'IQF Master Packing Logs' },
  coldstore: { section: 'Coldstore', module: 'Terminal Logistics', page: 'Pallet Racking & Reefer Dispatch' },
  inventory: { section: 'Inventory', module: 'General Store', page: 'Indent Page (GS)' },
  reports: { section: 'Reports', module: 'Analytics & BI', page: 'Reports Intelligence Hub' },
  settings: { section: 'System', module: 'Administration', page: 'Master Gateway Settings' },
  help: { section: 'Support', module: 'Knowledge Base', page: 'Documentation & Helpdesk' },
  notifications: { section: 'System', module: 'Alerts', page: 'Notification Center' },
  ponds: { section: 'Operations', module: 'Ponds & Sectors', page: 'Biomass & Water Metrics' },
  diagnostics: { section: 'Operations', module: 'Diagnostics', page: 'TCBS Pathogen Culture' },
  feeding: { section: 'Operations', module: 'Feeding Operations', page: 'FCR & Biomass Logs' },
  analytics: { section: 'Reports', module: 'Analytics', page: 'Telemetry Trend Charts' },
  docs: { section: 'Support', module: 'API Docs', page: 'Design System & API Specs' },
  support: { section: 'Support', module: 'Helpdesk', page: 'Customer Success & Tickets' },
};

export const BreadcrumbsBar: React.FC<{
  activeTab: string;
  activeSubMenu?: string;
  onNavigate?: (tab: string) => void;
}> = ({ activeTab, activeSubMenu, onNavigate }) => {
  if (activeTab === 'home') return null;
  const breadcrumb = TAB_BREADCRUMBS[activeTab] || {
    section: 'Enterprise',
    module: 'Operations',
    page: activeTab.toUpperCase(),
  };

  const isBuyers = activeTab === 'sales' && activeSubMenu === 'Buyers';

  return (
    <div className="flex items-center gap-2 px-3 md:px-4 text-xs select-none overflow-x-auto no-scrollbar -mt-1 mb-1">
      <span
        onClick={() => onNavigate?.('home')}
        className="text-content-muted hover:text-content-main cursor-pointer font-medium transition-colors"
      >
        Devi Fisheries
      </span>
      <span className="text-content-tertiary">/</span>
      <span
        onClick={() => onNavigate?.(activeTab)}
        className="text-content-muted hover:text-content-main cursor-pointer font-medium transition-colors"
      >
        {breadcrumb.section}
      </span>
      <span className="text-content-tertiary">/</span>
      {isBuyers ? (
        <>
          <span className="text-content-muted font-medium">Buyers</span>
          <span className="text-content-tertiary">/</span>
          <span className="text-content-main font-bold tracking-tight">
            Buyer List
          </span>
        </>
      ) : (
        <span className="text-content-main font-bold tracking-tight">
          {breadcrumb.page}
        </span>
      )}
    </div>
  );
};

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  onNavigate,
  onOpenMobile,
  onSearchFocus,
  onShowToast,
  onSignOut,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-full h-[64px] bg-white rounded-2xl border border-border-subtle shadow-xs px-4 md:px-5 flex items-center justify-between gap-4 select-none">
        {/* Left: Mobile Drawer Trigger + Omnibar Command Search (First in visual flow) */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          {onOpenMobile && (
            <button
              type="button"
              onClick={onOpenMobile}
              aria-label="Open Navigation Menu"
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-content-main hover:bg-black/5 active:scale-95 transition-colors cursor-pointer border border-border-subtle shrink-0"
            >
              <Menu className="w-4 h-4 stroke-[2.2]" />
            </button>
          )}

          <div className="relative w-full flex items-center group">
            <Search className="w-4 h-4 text-content-muted absolute left-3.5 pointer-events-none transition-colors group-focus-within:text-[#00a7bc] stroke-[2.2]" />
            <input
              type="text"
              placeholder="Search ERP records..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onFocus={onSearchFocus}
              className="w-full h-10 pl-10 pr-10 bg-[#F8FAFC] focus:bg-white rounded-full border border-border-subtle text-xs font-medium text-content-main placeholder:text-content-tertiary outline-none transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#94A3B8] focus:border-[#00a7bc] focus:shadow-[0_0_0_3px_rgba(0,167,188,0.12)]"
            />
            <span className="absolute right-3.5 text-[10px] font-semibold text-content-tertiary select-none pointer-events-none">
              ⌘K
            </span>
          </div>
        </div>

        {/* Right: Actions Cluster (Help SOP, Notifications, User Profile) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Help SOP Button - Tier 1 Minimalist Pill */}
          <Tooltip content="Documentation & SOPs" side="bottom">
            <button
              type="button"
              onClick={() => onNavigate?.('help')}
              className="w-9 h-9 rounded-full flex items-center justify-center text-content-muted hover:text-content-main bg-white border border-border-subtle hover:border-[#94A3B8] transition-all cursor-pointer shadow-2xs"
            >
              <HelpCircle className="w-4 h-4 stroke-[1.8]" />
            </button>
          </Tooltip>

          {/* Notifications Button with Red Unread Dot - Tier 1 Minimalist Pill */}
          <Tooltip content="Notification Center (3 Unread)" side="bottom">
            <button
              type="button"
              onClick={() => onNavigate?.('notifications')}
              className="w-9 h-9 rounded-full flex items-center justify-center text-content-muted hover:text-content-main bg-white border border-border-subtle hover:border-[#94A3B8] transition-all relative cursor-pointer shadow-2xs"
            >
              <Bell className="w-4 h-4 stroke-[1.8]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border border-white shadow-[0_0_4px_#f43f5e] animate-pulse" />
            </button>
          </Tooltip>

          {/* User Profile Pill with Popover */}
          <Popover.Root open={profileOpen} onOpenChange={setProfileOpen}>
            <Popover.Trigger asChild>
              <button
                type="button"
                className={cn(
                  'flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-white border border-transparent transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer outline-none active:scale-[0.99]',
                  'hover:bg-slate-50 hover:border-border-subtle',
                  profileOpen && 'bg-slate-50 border-border-subtle'
                )}
              >
                {/* Clean Single-Source Avatar */}
                <div className="w-9 h-9 rounded-full overflow-hidden bg-[#101828] text-white shrink-0 border border-border-subtle flex items-center justify-center">
                  {!imgError ? (
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
                      alt="Dr. Y.S. Prasad"
                      className="w-full h-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <span className="text-xs font-bold text-white">YP</span>
                  )}
                </div>

                <div className="flex flex-col text-left leading-tight hidden lg:flex">
                  <span className="text-xs font-bold text-content-main tracking-tight">
                    Dr. Y.S. Prasad
                  </span>
                  <span className="text-[10px] font-medium text-content-muted">
                    Super Admin
                  </span>
                </div>

                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 text-content-muted transition-transform duration-200 stroke-[2.2]',
                    profileOpen && 'rotate-180 text-content-main'
                  )}
                />
              </button>
            </Popover.Trigger>

            <Popover.Portal>
              <Popover.Content
                className="z-50 min-w-[200px] bg-white border border-border-subtle rounded-[16px] p-2 shadow-floating outline-none duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:duration-150 data-[state=closed]:ease-in animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 will-change-[transform,opacity]"
                align="end"
                sideOffset={8}
              >
                <div className="px-3 py-2 border-b border-border-subtle mb-1">
                  <span className="text-xs font-bold text-content-main block">Dr. Y.S. Prasad</span>
                  <span className="text-[10px] font-medium text-content-muted block">ysprasad@devifisheries.com</span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate?.('settings');
                      setProfileOpen(false);
                    }}
                    className="w-full px-3 py-1.5 rounded-[10px] text-xs font-semibold text-content-main flex items-center gap-2 hover:bg-surface-subtle transition-colors cursor-pointer text-left"
                  >
                    <User className="w-3.5 h-3.5 text-content-muted" />
                    <span>Admin Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onNavigate?.('settings');
                      setProfileOpen(false);
                    }}
                    className="w-full px-3 py-1.5 rounded-[10px] text-xs font-semibold text-content-main flex items-center gap-2 hover:bg-surface-subtle transition-colors cursor-pointer text-left"
                  >
                    <Shield className="w-3.5 h-3.5 text-content-muted" />
                    <span>Master Permissions</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onShowToast?.('Signed out successfully.');
                      setProfileOpen(false);
                      onSignOut?.();
                    }}
                    className="w-full px-3 py-1.5 rounded-[10px] text-xs font-semibold text-rose-600 flex items-center gap-2 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
    </div>
  );
};
