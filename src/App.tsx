import React, { useState, useEffect } from 'react';
import { Toast, ToastMessage } from '@/components/ui/Toast';
import { TooltipProvider } from '@/components/ui/Tooltip';
import { Sidebar } from '@/components/layout/Sidebar';
import { DesignSystemView } from '@/components/docs/DesignSystemView';
import { SalesDashboardView } from '@/components/sales/SalesDashboardView';
import { BuyersManagementView } from '@/components/sales/buyers/BuyersManagementView';
import { HomeDashboardView } from '@/components/home/HomeDashboardView';
import { TopNavbar, BreadcrumbsBar } from '@/components/layout/TopNavbar';
import { LoginView } from '@/components/auth/LoginView';

const VALID_TABS = [
  'home',
  'design-asset',
  'telemetry',
  'sales',
  'purchase',
  'preprocessing',
  'qc',
  'production',
  'coldstore',
  'inventory',
  'reports',
  'settings',
  'help',
  'notifications',
  'ponds',
  'diagnostics',
  'feeding',
  'analytics',
  'docs',
  'support',
];

const getTabFromHash = (): string => {
  if (typeof window === 'undefined') return 'home';
  const clean = window.location.hash.replace('#', '').trim().toLowerCase();
  return VALID_TABS.includes(clean) ? clean : 'home';
};

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(getTabFromHash);
  const [salesSubMenu, setSalesSubMenu] = useState<string>('DashBoard');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString();
    setToast({ id, text, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3200);
  };

  // Zero-cache URL Hash listener for persistent navigation without localStorage
  useEffect(() => {
    const handleHashChange = () => {
      const target = getTabFromHash();
      setActiveTab((prev) => (prev === target ? prev : target));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Keyboard ergonomics: ⌘K or / to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[placeholder*="Filter ponds"]'
        );
        searchInput?.focus();
        showToast('Search focused via ⌘K');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (window.location.hash.replace('#', '') !== tab) {
      window.location.hash = tab;
    }
    const labels: Record<string, string> = {
      telemetry: 'Telemetry Console',
      sales: 'Sales Operations Hub',
      purchase: 'Purchase & Procurement Hub',
      preprocessing: 'Pre Processing Staging',
      qc: 'Quality Control (QC) & Lab',
      production: 'Production Operations Hub',
      coldstore: 'Coldstore Terminal',
      inventory: 'Inventory & Materials Store',
      reports: 'Reports Intelligence Hub',
      settings: 'Master Settings',
      help: 'Documentation & Helpdesk',
      notifications: 'Notification Center',
      ponds: 'Ponds & Sectors',
      diagnostics: 'Water Diagnostics',
      feeding: 'Biomass & Feeding',
      analytics: 'Analytics & Trends',
      docs: 'API & Telemetry Docs',
      support: 'Help & Support',
    };
    showToast(`Navigated to ${labels[tab] || tab}`);
  };

  if (!isAuthenticated) {
    return (
      <TooltipProvider delayDuration={100}>
        <LoginView
          onLogin={() => setIsAuthenticated(true)}
          onShowToast={showToast}
        />
        <Toast toast={toast} />
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div className="min-h-screen bg-canvas flex antialiased selection:bg-brand-accent/15 selection:text-brand-accent relative">
      {/* Aceternity-inspired Subtle Ambient Dot Grid with Radial Vignette */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50" />

      {/* Floating Rounded Collapsible Sidebar (Phase 1-4 Intrinsic Motion) */}
      <Sidebar
        activeTab={activeTab}
        activeSubMenu={activeTab === 'sales' ? salesSubMenu : undefined}
        onSelectTab={handleSelectTab}
        onSelectSubMenu={(menuId, subMenu) => {
          if (menuId === 'sales') {
            setSalesSubMenu(subMenu);
            handleSelectTab('sales');
          }
        }}
        onShowToast={showToast}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Workspace - Pixel-Aligned Flush at y = 0 */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto no-scrollbar pt-0 px-4 pb-8 pl-3 md:pl-4">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-4">
          {/* STICKY TOP OMNIBAR: Floating Utility Card with seamless canvas shielding */}
          <div className="sticky top-0 z-30 pt-3 pb-2 bg-[#F8F9FA]/95 backdrop-blur-md">
            <TopNavbar
              activeTab={activeTab}
              onNavigate={handleSelectTab}
              onOpenMobile={() => setIsMobileNavOpen(true)}
              onSearchFocus={() => {
                const searchInput = document.querySelector<HTMLInputElement>(
                  'input[placeholder*="Filter ponds"], input[placeholder*="Search"]'
                );
                searchInput?.focus();
              }}
              onShowToast={showToast}
              onSignOut={() => setIsAuthenticated(false)}
            />
          </div>

          {/* DYNAMIC BREADCRUMBS: Flows naturally above page content (Hidden on Home) */}
          <BreadcrumbsBar activeTab={activeTab} activeSubMenu={salesSubMenu} onNavigate={handleSelectTab} />

          {/* VIEW ROUTING: Home, Sales Dashboard Overview, Sales Buyers, and Design Asset */}
          <div key={`${activeTab}-${salesSubMenu}`} className="flex flex-col gap-6">
              {activeTab === 'home' && (
                <HomeDashboardView
                  onNavigate={handleSelectTab}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'sales' && salesSubMenu === 'DashBoard' && (
                <SalesDashboardView
                  activeSubMenu={salesSubMenu}
                  onSelectSubMenu={setSalesSubMenu}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'sales' && salesSubMenu === 'Buyers' && (
                <BuyersManagementView onShowToast={showToast} />
              )}

              {activeTab === 'design-asset' && (
                <DesignSystemView />
              )}
          </div>
        </div>
      </main>

      {/* Floating System Toast */}
      <Toast toast={toast} />
    </div>
  </TooltipProvider>
  );
};

export default App;
