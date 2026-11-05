import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  SlidersHorizontal,
  Home,
  Palette,
  TrendingUp,
  ShoppingCart,
  Layers,
  ShieldCheck,
  Factory,
  Snowflake,
  Boxes,
  BarChart3,
  Settings,
  LifeBuoy,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Atom,
} from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipProvider } from '@/components/ui/Tooltip';
import { DeviLogo } from '@/components/common/DeviLogo';

interface SubMenuItem {
  title: string;
  badge?: string;
  onClick?: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  badge?: string;
  active?: boolean;
  subItems?: SubMenuItem[];
  onClick?: () => void;
}

interface SidebarProps {
  activeTab?: string;
  activeSubMenu?: string;
  onSelectTab?: (id: string) => void;
  onSelectSubMenu?: (menuId: string, subMenuTitle: string) => void;
  onShowToast?: (text: string, type?: 'success' | 'error') => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab = 'home',
  activeSubMenu,
  onSelectTab,
  onSelectSubMenu,
  onShowToast,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [activeSubMenuTitle, setActiveSubMenuTitle] = useState<string>(activeSubMenu || 'DashBoard');

  useEffect(() => {
    if (activeSubMenu) {
      setActiveSubMenuTitle(activeSubMenu);
    }
  }, [activeSubMenu]);
  const [hoveredRailMenuId, setHoveredRailMenuId] = useState<string | null>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      onShowToast?.(next ? 'Sidebar collapsed (72px icon rail)' : 'Sidebar expanded (260px)');
      return next;
    });
  };

  const toggleSubmenu = (id: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setOpenMenuId(id);
      return;
    }
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  // Hover grace timer handlers for collapsed rail flyouts
  const handleItemMouseEnter = (id: string, hasSubmenu: boolean) => {
    if (!isCollapsed || !hasSubmenu) return;
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setHoveredRailMenuId(id);
  };

  const handleItemMouseLeave = (id: string) => {
    if (!isCollapsed) return;
    leaveTimerRef.current = setTimeout(() => {
      setHoveredRailMenuId((curr) => (curr === id ? null : curr));
    }, 150);
  };

  const handleFlyoutMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  const handleFlyoutMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setHoveredRailMenuId(null);
    }, 150);
  };

  // Phase 4: Keyboard Ergonomics (⌘B toggle, Escape dismiss)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsCollapsed((prev) => {
          const next = !prev;
          onShowToast?.(next ? 'Sidebar collapsed (⌘B)' : 'Sidebar expanded (⌘B)');
          return next;
        });
      }
      if (e.key === 'Escape') {
        setOpenMenuId(null);
        setHoveredRailMenuId(null);
        if (isMobileOpen) {
          onCloseMobile?.();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onShowToast, isMobileOpen, onCloseMobile]);

  // Phase 3: Tablet Breakpoint Auto-Collapse (768px - 1024px)
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 768 && width < 1024) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
      }
    };
  }, []);

  const menuSections: { sectionTitle?: string; items: MenuItem[] }[] = [
    {
      sectionTitle: 'Enterprise Operations',
      items: [
        {
          id: 'home',
          title: 'Home',
          icon: <Home className="w-4 h-4" />,
          active: activeTab === 'home',
          onClick: () => onSelectTab?.('home'),
        },
        {
          id: 'atoms',
          title: 'Atoms',
          icon: <Atom className="w-4 h-4 text-emerald-500 stroke-[2.2]" />,
          badge: 'UI/UX',
          active: activeTab === 'atoms',
          onClick: () => onSelectTab?.('atoms'),
        },
        {
          id: 'sales',
          title: 'Sales',
          icon: <TrendingUp className="w-4 h-4" />,
          active: activeTab === 'sales',
          onClick: () => onSelectTab?.('sales'),
          subItems: [
            { title: 'DashBoard' },
            { title: 'Product' },
            { title: 'Buyers' },
            { title: 'Sales' },
            { title: 'Orders' },
            { title: 'Payments' },
            { title: 'Insurance' },
            { title: 'Reports' },
          ],
        },
        {
          id: 'purchase',
          title: 'Purchase',
          icon: <ShoppingCart className="w-4 h-4" />,
          active: activeTab === 'purchase',
          onClick: () => onSelectTab?.('purchase'),
          subItems: [
            { title: 'Dashboard' },
            { title: 'Operations' },
            { title: 'Transactions & Bills' },
            { title: 'Payments' },
          ],
        },
        {
          id: 'preprocessing',
          title: 'Pre Processing',
          icon: <Layers className="w-4 h-4" />,
          active: activeTab === 'preprocessing',
          onClick: () => onSelectTab?.('preprocessing'),
          subItems: [
            { title: 'Dashboard' },
            { title: 'Operations' },
            { title: 'Chemical Screens' },
          ],
        },
        {
          id: 'qc',
          title: 'Quality Control (QC)',
          icon: <ShieldCheck className="w-4 h-4" />,
          active: activeTab === 'qc',
          onClick: () => onSelectTab?.('qc'),
          subItems: [
            { title: 'Dashboard' },
            { title: 'Lab' },
            { title: 'QC Operations' },
            { title: 'Chemical Screening' },
            { title: 'QC Audits' },
          ],
        },
        {
          id: 'production',
          title: 'Production',
          icon: <Factory className="w-4 h-4" />,
          active: activeTab === 'production',
          onClick: () => onSelectTab?.('production'),
          subItems: [
            { title: 'Dashboard' },
            { title: 'Pre Processing' },
            { title: 'Operations' },
          ],
        },
        {
          id: 'coldstore',
          title: 'Coldstore',
          icon: <Snowflake className="w-4 h-4" />,
          active: activeTab === 'coldstore',
          onClick: () => onSelectTab?.('coldstore'),
          subItems: [
            { title: 'DashBoard' },
            { title: 'Production' },
            { title: 'Stock' },
            { title: 'Orders' },
            { title: 'Store' },
            { title: 'Stock Approvals' },
            { title: 'IBT' },
            { title: 'Shipments' },
          ],
        },
        {
          id: 'inventory',
          title: 'Inventory',
          icon: <Boxes className="w-4 h-4" />,
          active: activeTab === 'inventory',
          onClick: () => onSelectTab?.('inventory'),
          subItems: [
            { title: 'General Store' },
            { title: 'Packing Material' },
            { title: 'Inventory' },
          ],
        },
      ],
    },
    {
      sectionTitle: 'Intelligence & Reports',
      items: [
        {
          id: 'reports',
          title: 'Reports',
          icon: <BarChart3 className="w-4 h-4" />,
          active: activeTab === 'reports',
          onClick: () => onSelectTab?.('reports'),
          subItems: [
            { title: 'Overview (All Reports)' },
            { title: 'Lists' },
            { title: 'Other' },
          ],
        },
        {
          id: 'notifications',
          title: 'Notifications',
          icon: <Bell className="w-4 h-4" />,
          badge: '3',
          active: activeTab === 'notifications',
          onClick: () => onSelectTab?.('notifications'),
        },
      ],
    },
    {
      sectionTitle: 'System & Governance',
      items: [
        {
          id: 'settings',
          title: 'Settings',
          icon: <Settings className="w-4 h-4" />,
          active: activeTab === 'settings',
          onClick: () => onSelectTab?.('settings'),
        },
        {
          id: 'design-asset',
          title: 'Design Asset',
          icon: <Palette className="w-4 h-4" />,
          active: activeTab === 'design-asset',
          onClick: () => onSelectTab?.('design-asset'),
        },
      ],
    },
  ];

  return (
    <TooltipProvider delayDuration={150}>
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 72 : 260,
        }}
        transition={{
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={cn(
          'hidden md:flex sticky top-4 h-[calc(100vh-32px)] bg-[#101828] text-white border border-white/[0.08] rounded-[24px] shadow-[0_12px_30px_rgba(16,24,40,0.18)] flex-col justify-between select-none z-30 shrink-0 my-4 ml-4 px-3 py-4 overflow-hidden'
        )}
      >
        {/* TOP BRAND MASTHEAD */}
        <div className="shrink-0 pb-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between h-10 w-full px-1.5">
            {/* The Devi Fisheries Logo Mark + Brand Title */}
            <div
              onClick={() => {
                if (isCollapsed) toggleCollapse();
                else onSelectTab?.('home');
              }}
              className="flex items-center cursor-pointer group shrink-0"
              title={isCollapsed ? 'Click to expand sidebar' : undefined}
            >
              {/* Devi Fisheries Logo Mark in High-Contrast Elevated White Badge */}
              <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-xs border border-white/20 transition-transform duration-200 group-hover:scale-105 active:scale-95">
                <DeviLogo className="w-7 h-5" />
              </div>

              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col justify-center whitespace-nowrap overflow-hidden ml-2.5"
                  >
                    <span className="text-[14px] font-bold text-white tracking-tight leading-tight group-hover:text-white/80 transition-colors">
                      Devi Fisheries
                    </span>
                    <span className="text-[10px] font-medium text-white/50 leading-tight mt-0.5">
                      Powered by Camaroo
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Collapse Button (Visible when expanded) - High-affordance container per Fitts's Law */}
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.18 }}
                  className="shrink-0"
                >
                  <Tooltip
                    content={{
                      title: 'Collapse Sidebar',
                      description: 'Switch to compact 72px icon rail',
                    }}
                    side="right"
                  >
                    <button
                      type="button"
                      onClick={toggleCollapse}
                      aria-label="Collapse Sidebar"
                      className="w-8 h-8 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 flex items-center justify-center text-[#00a7bc] hover:text-white active:scale-95 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#00a7bc]/50 transition-all duration-150 shadow-xs"
                    >
                      <ChevronLeft className="w-4 h-4 stroke-[2.4]" />
                    </button>
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Expand Button (Centered below logo when collapsed, with zero overlap) */}
          <AnimatePresence initial={false}>
            {isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex justify-center overflow-hidden pt-1"
              >
                <Tooltip
                  content={{
                    title: 'Expand Sidebar',
                    description: 'Restore full 260px navigation pane',
                  }}
                  side="right"
                >
                  <button
                    type="button"
                    onClick={toggleCollapse}
                    aria-label="Expand Sidebar"
                    className="w-8 h-8 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 flex items-center justify-center text-[#00a7bc] hover:text-white active:scale-95 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#00a7bc]/50 transition-all duration-150 shadow-xs"
                  >
                    <ChevronRight className="w-4 h-4 stroke-[2.4]" />
                  </button>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* NAVIGATION SCROLL LIST */}
        <LayoutGroup id="sidebar-active-pill">
          <div className="flex-1 min-h-0 py-2 overflow-y-auto overflow-x-hidden flex flex-col gap-3.5 no-scrollbar">
            {menuSections.map((section, sIdx) => (
              <div key={sIdx} className="flex flex-col gap-1">
                <AnimatePresence initial={false}>
                  {!isCollapsed && section.sectionTitle && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="px-2 text-[10px] font-bold tracking-[0.08em] uppercase text-white/30 mb-1 overflow-hidden whitespace-nowrap"
                    >
                      {section.sectionTitle}
                    </motion.div>
                  )}
                </AnimatePresence>

                {section.items.map((item) => {
                  const hasSubmenu = item.subItems && item.subItems.length > 0;
                  const isSubmenuOpen = openMenuId === item.id;
                  const isActive = item.active;

                  const buttonNode = (
                    <button
                      type="button"
                      onClick={() => {
                        item.onClick?.();
                        if (hasSubmenu && !isCollapsed) {
                          toggleSubmenu(item.id);
                        } else {
                          setOpenMenuId(null);
                        }
                      }}
                      className={cn(
                        'w-full h-10 rounded-full flex items-center px-1.5 transition-colors duration-150 cursor-pointer outline-none select-none relative',
                        isActive
                          ? 'text-white font-bold'
                          : 'text-white/60 hover:text-white hover:bg-white/[0.05] font-medium'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active-tab-indicator"
                          transition={{
                            duration: 0.26,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="absolute inset-0 bg-white/[0.14] border border-white/20 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.3)] backdrop-blur-md pointer-events-none z-0"
                        />
                      )}

                      {/* Centered, stationary icon container - invariant X centroid at 36px */}
                      <div
                        className={cn(
                          'w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors relative z-10',
                          isActive
                            ? 'text-white'
                            : 'text-white/50 group-hover:text-white'
                        )}
                      >
                        {item.icon}
                      </div>

                      {/* Fluid animated label & badge (when expanded) */}
                      <AnimatePresence initial={false}>
                        {!isCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: '100%' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{
                              duration: 0.24,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="flex items-center justify-between flex-1 overflow-hidden whitespace-nowrap ml-1.5 pr-2 relative z-10"
                          >
                            <span
                              className={cn(
                                'text-[13px] truncate text-left',
                                isActive ? 'font-bold text-white' : 'font-medium'
                              )}
                            >
                              {item.title}
                            </span>

                            <div className="flex items-center gap-1.5 ml-2 shrink-0">
                              {item.badge && (
                                <span
                                  className={cn(
                                    'text-[10px] font-bold px-2 py-0.5 rounded-full leading-none',
                                    isActive
                                      ? 'bg-white/20 text-white'
                                      : 'bg-white/10 text-white/70'
                                  )}
                                >
                                  {item.badge}
                                </span>
                              )}
                              {isActive && !item.badge && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00a7bc] shrink-0" />
                              )}

                              {hasSubmenu && (
                                <ChevronDown
                                  className={cn(
                                    'w-3.5 h-3.5 transition-transform duration-200 stroke-[2.2]',
                                    isActive ? 'text-white/80' : 'text-white/30',
                                    isSubmenuOpen && 'rotate-180'
                                  )}
                                />
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  );

                  return (
                    <motion.div
                      layout="position"
                      key={item.id}
                      transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col"
                    >
                      {/* Phase 2: Collapsed Rail Floating Menus with Hover Grace */}
                      {isCollapsed && hasSubmenu ? (
                        <Popover.Root open={hoveredRailMenuId === item.id}>
                          <Popover.Anchor asChild>
                            <div
                              onMouseEnter={() => handleItemMouseEnter(item.id, true)}
                              onMouseLeave={() => handleItemMouseLeave(item.id)}
                            >
                              {buttonNode}
                            </div>
                          </Popover.Anchor>
                          <Popover.Portal>
                            <Popover.Content
                              side="right"
                              align="start"
                              sideOffset={14}
                              onMouseEnter={handleFlyoutMouseEnter}
                              onMouseLeave={handleFlyoutMouseLeave}
                              className="z-[9999] w-60 bg-[#101828]/95 backdrop-blur-xl border border-white/15 rounded-[20px] p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.65)] animate-in fade-in-0 zoom-in-95 data-[side=right]:slide-in-from-left-2 outline-none select-none text-white"
                            >
                              {/* Flyout Header */}
                              <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-white/10 px-2 pt-0.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                                    {item.icon}
                                  </div>
                                  <span className="text-xs font-bold text-white tracking-tight">
                                    {item.title}
                                  </span>
                                </div>
                                {item.badge && (
                                  <span className="px-1.5 py-0.5 rounded-full bg-white/15 text-[9px] font-semibold text-white/90">
                                    {item.badge}
                                  </span>
                                )}
                              </div>

                              {/* Flyout Submenu List */}
                              <div className="flex flex-col gap-0.5">
                                {item.subItems!.map((sub, sIdx) => (
                                  <button
                                    key={sIdx}
                                    type="button"
                                    onClick={() => {
                                      setActiveSubMenuTitle(sub.title);
                                      onSelectSubMenu?.(item.id, sub.title);
                                      sub.onClick?.();
                                      item.onClick?.();
                                      setHoveredRailMenuId(null);
                                    }}
                                    className="w-full h-8 px-2.5 rounded-xl text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 active:scale-[0.98] flex items-center justify-between text-left transition-colors cursor-pointer group"
                                  >
                                    <span className="truncate">{sub.title}</span>
                                    <ChevronRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                                  </button>
                                ))}
                              </div>
                            </Popover.Content>
                          </Popover.Portal>
                        </Popover.Root>
                      ) : isCollapsed && !hasSubmenu ? (
                        <Tooltip
                          content={
                            <div className="flex items-center gap-1.5">
                              <span>{item.title}</span>
                              {item.badge && (
                                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[9px] font-medium text-white">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          }
                          side="right"
                        >
                          <div
                            onMouseEnter={() => handleItemMouseEnter(item.id, false)}
                            onMouseLeave={() => handleItemMouseLeave(item.id)}
                          >
                            {buttonNode}
                          </div>
                        </Tooltip>
                      ) : (
                        buttonNode
                      )}

                      {/* Smooth Accordion Submenu with Vertical Guide Rail & 2x Cyan Bar */}
                      <AnimatePresence initial={false}>
                        {!isCollapsed && hasSubmenu && isSubmenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{
                              duration: 0.26,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="overflow-hidden ml-6 pl-4 flex flex-col gap-1 mt-1.5 mb-1 relative"
                          >
                            {/* Track Rail: 2px wide with rounded ends */}
                            <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-white/20 rounded-full" />

                            {item.subItems!.map((sub, subIdx) => {
                              const isSubActive =
                                item.active &&
                                (activeSubMenuTitle.toLowerCase() === sub.title.toLowerCase() ||
                                  (subIdx === 0 && !activeSubMenuTitle));

                              return (
                                <button
                                  key={subIdx}
                                  type="button"
                                  onClick={() => {
                                    setActiveSubMenuTitle(sub.title);
                                    onSelectSubMenu?.(item.id, sub.title);
                                    sub.onClick?.();
                                    item.onClick?.();
                                  }}
                                  className={cn(
                                    'h-8 px-2.5 rounded-lg text-xs flex items-center justify-between text-left transition-all duration-150 cursor-pointer relative group',
                                    isSubActive
                                      ? 'text-[#00a7bc] font-bold'
                                      : 'text-white/50 hover:text-white font-medium hover:bg-white/[0.04]'
                                  )}
                                >
                                  {/* Active Cyan Highlight Bar: 4px wide (2x width of rail), fully rounded ends, zero glow */}
                                  {isSubActive && (
                                    <motion.div
                                      layoutId={`sidebar-sub-pip-${item.id}`}
                                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                                      className="absolute -left-[17px] top-1 bottom-1 w-[4px] rounded-full bg-[#00a7bc]"
                                    />
                                  )}

                                  <span className="truncate">{sub.title}</span>
                                  {sub.badge && (
                                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-white/10 text-white/70">
                                      {sub.badge}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </LayoutGroup>

        {/* BOTTOM HELP & SUPPORT CARD (Direct trigger, no sub menu) */}
        <div className="shrink-0 pt-2 flex flex-col gap-2">
          <Tooltip
            content={{
              title: 'Help & Support',
              description: 'Documentation & operational SOPs',
            }}
            side="right"
            disabled={!isCollapsed}
          >
            <button
              type="button"
              onClick={() => {
                onSelectTab?.('help');
                onShowToast?.('Opening Help & Support documentation');
              }}
              className={cn(
                'w-full h-11 rounded-[18px] px-1.5 flex items-center bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.98] border border-white/[0.08] transition-all cursor-pointer group text-left outline-none'
              )}
            >
              <div className="relative shrink-0 w-9 h-9 flex items-center justify-center">
                <div className="w-8 h-8 rounded-xl bg-white/[0.08] border border-white/10 text-[#00a7bc] group-hover:text-white group-hover:bg-[#00a7bc] flex items-center justify-center transition-colors">
                  <LifeBuoy className="w-4 h-4 stroke-[2.2]" />
                </div>
              </div>

              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{
                      duration: 0.24,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex flex-col overflow-hidden whitespace-nowrap ml-2"
                  >
                    <span className="text-xs font-bold text-white group-hover:text-[#00a7bc] transition-colors truncate">
                      Help & Support
                    </span>
                    <span className="text-[10px] font-medium text-white/50 truncate">
                      Documentation & SOPs
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </Tooltip>
        </div>
      </motion.aside>

      {/* Phase 3: Mobile Overlay Drawer (< 768px viewport) */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop with Soft Blur */}
            <motion.div
              key="sidebar-mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
            />

            {/* Mobile Slide-Over Drawer */}
            <motion.aside
              key="sidebar-mobile-drawer"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 w-[285px] bg-[#101828] text-white border-r border-white/10 shadow-[0_24px_60px_rgba(16,24,40,0.6)] z-50 flex flex-col justify-between p-4 md:hidden overflow-hidden"
            >
              {/* Masthead Header with Close Button */}
              <div className="shrink-0 pb-3 flex items-center justify-between border-b border-white/10">
                <div
                  onClick={() => {
                    onSelectTab?.('home');
                    onCloseMobile?.();
                  }}
                  className="flex items-center cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-xs border border-white/20">
                    <DeviLogo className="w-7 h-5" />
                  </div>
                  <div className="flex flex-col ml-2.5">
                    <span className="text-[14px] font-bold text-white tracking-tight">
                      Devi Fisheries
                    </span>
                    <span className="text-[10px] font-medium text-white/50">
                      Powered by Camaroo
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onCloseMobile}
                  aria-label="Close Navigation Menu"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 active:scale-90 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4 stroke-[2.2]" />
                </button>
              </div>

              {/* Scrollable Navigation List */}
              <div className="flex-1 min-h-0 py-3 overflow-y-auto no-scrollbar flex flex-col gap-4">
                {menuSections.map((section, sIdx) => (
                  <div key={sIdx} className="flex flex-col gap-1">
                    {section.sectionTitle && (
                      <div className="px-2 text-[10px] font-bold tracking-[0.08em] uppercase text-white/30 mb-1">
                        {section.sectionTitle}
                      </div>
                    )}

                    {section.items.map((item) => {
                      const hasSubmenu = item.subItems && item.subItems.length > 0;
                      const isSubmenuOpen = openMenuId === item.id;
                      const isActive = item.active;

                      return (
                        <div key={item.id} className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => {
                              item.onClick?.();
                              if (hasSubmenu) {
                                toggleSubmenu(item.id);
                              } else {
                                onCloseMobile?.();
                              }
                            }}
                            className={cn(
                              'w-full h-10 rounded-full flex items-center px-2 transition-colors duration-150 cursor-pointer outline-none relative',
                              isActive
                                ? 'bg-white/[0.14] border border-white/20 text-white font-bold shadow-[0_4px_16px_rgba(0,0,0,0.3)] backdrop-blur-md'
                                : 'text-white/60 hover:text-white hover:bg-white/[0.05] font-medium'
                            )}
                          >
                            <div
                              className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                                isActive ? 'text-white' : 'text-white/70'
                              )}
                            >
                              {item.icon}
                            </div>
                            <span
                              className={cn(
                                'text-[13px] ml-2 flex-1 text-left truncate',
                                isActive ? 'font-bold text-white' : 'font-medium'
                              )}
                            >
                              {item.title}
                            </span>
                            <div className="flex items-center gap-1.5 ml-1 shrink-0">
                              {item.badge && (
                                <span
                                  className={cn(
                                    'text-[10px] font-bold px-2 py-0.5 rounded-full',
                                    isActive
                                      ? 'bg-white/20 text-white'
                                      : 'bg-white/15 text-white'
                                  )}
                                >
                                  {item.badge}
                                </span>
                              )}
                              {hasSubmenu && (
                                <ChevronDown
                                  className={cn(
                                    'w-3.5 h-3.5 transition-transform duration-200',
                                    isActive ? 'text-white/80' : 'text-white/40',
                                    isSubmenuOpen && 'rotate-180'
                                  )}
                                />
                              )}
                            </div>
                          </button>

                          {/* Mobile Submenu Accordion with Guide Rail & 2x Cyan Bar */}
                          <AnimatePresence initial={false}>
                            {hasSubmenu && isSubmenuOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden ml-6 pl-4 flex flex-col gap-1 mt-1.5 mb-1 relative"
                              >
                                {/* Track Rail: 2px wide with rounded ends */}
                                <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-white/20 rounded-full" />

                                {item.subItems!.map((sub, subIdx) => {
                                  const isSubActive =
                                    item.active &&
                                    (activeSubMenuTitle.toLowerCase() === sub.title.toLowerCase() ||
                                      (subIdx === 0 && !activeSubMenuTitle));

                                  return (
                                    <button
                                      key={subIdx}
                                      type="button"
                                      onClick={() => {
                                        setActiveSubMenuTitle(sub.title);
                                        onSelectSubMenu?.(item.id, sub.title);
                                        sub.onClick?.();
                                        item.onClick?.();
                                        onCloseMobile?.();
                                      }}
                                      className={cn(
                                        'h-8 px-2.5 rounded-lg text-xs flex items-center justify-between text-left transition-all duration-150 cursor-pointer relative',
                                        isSubActive
                                          ? 'text-[#00a7bc] font-bold'
                                          : 'text-white/60 hover:text-white font-medium hover:bg-white/[0.04]'
                                      )}
                                    >
                                      {/* Active Cyan Highlight Bar: 4px wide (2x width of rail), fully rounded ends, zero glow */}
                                      {isSubActive && (
                                        <div className="absolute -left-[17px] top-1 bottom-1 w-[4px] rounded-full bg-[#00a7bc]" />
                                      )}

                                      <span className="truncate">{sub.title}</span>
                                      {sub.badge && (
                                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-white/10 text-white/70">
                                          {sub.badge}
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Mobile Drawer Footer: Help & Support (Direct trigger, no sub menu) */}
              <div className="shrink-0 pt-3 border-t border-white/10 flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab?.('help');
                    onCloseMobile?.();
                  }}
                  className="flex items-center gap-2.5 w-full text-left cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/[0.08] border border-white/10 text-[#00a7bc] group-hover:text-white group-hover:bg-[#00a7bc] flex items-center justify-center transition-colors">
                    <LifeBuoy className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white leading-tight group-hover:text-[#00a7bc] transition-colors">
                      Help & Support
                    </span>
                    <span className="text-[10px] text-white/50 font-medium">
                      Documentation & SOPs
                    </span>
                  </div>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
};
