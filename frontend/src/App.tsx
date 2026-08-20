import { useState, useEffect, lazy, Suspense } from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { Sidebar, type PageId } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { COBATFloatingPanel } from './components/cobat/COBATFloatingPanel';
import { CopanProvider, useCopan } from './context/CopanContext';

// Lazy-loaded Pages for Code-Splitting and Optimal Bundle Performance
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const CobatPage = lazy(() => import('./pages/CobatPage').then(m => ({ default: m.CobatPage })));
const CustomersPage = lazy(() => import('./pages/CustomersPage').then(m => ({ default: m.CustomersPage })));
const Customer360Page = lazy(() => import('./pages/Customer360Page').then(m => ({ default: m.Customer360Page })));
const PrioritiesPage = lazy(() => import('./pages/PrioritiesPage').then(m => ({ default: m.PrioritiesPage })));
const OpportunitiesPage = lazy(() => import('./pages/OpportunitiesPage').then(m => ({ default: m.OpportunitiesPage })));
const SalesIntelligencePage = lazy(() => import('./pages/SalesIntelligencePage').then(m => ({ default: m.SalesIntelligencePage })));
const MarketIntelligencePage = lazy(() => import('./pages/MarketIntelligencePage').then(m => ({ default: m.MarketIntelligencePage })));
const RisksAlertsPage = lazy(() => import('./pages/RisksAlertsPage').then(m => ({ default: m.RisksAlertsPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

const NAVIGATION_STORAGE_KEY = 'copan_current_page_v1';
const VALID_PAGE_IDS: PageId[] = [
  'dashboard',
  'cobat',
  'customers',
  'customer_360',
  'priorities',
  'opportunities',
  'sales_intel',
  'market_intel',
  'risks_alerts',
  'settings',
];

function getInitialPage(): PageId {
  try {
    const savedPage = localStorage.getItem(NAVIGATION_STORAGE_KEY);
    return VALID_PAGE_IDS.includes(savedPage as PageId)
      ? (savedPage as PageId)
      : 'dashboard';
  } catch {
    return 'dashboard';
  }
}

function AppContent() {
  const {
    selectedCustomerId,
    setSelectedCustomerId,
    isDarkMode,
    setIsDarkMode,
  } = useCopan();

  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isCobatFloatingOpen, setIsCobatFloatingOpen] = useState<boolean>(false);
  const [cobatInitialPrompt, setCobatInitialPrompt] = useState<string | undefined>(undefined);

  useEffect(() => {
    try {
      localStorage.setItem(NAVIGATION_STORAGE_KEY, currentPage);
    } catch {
      // Navigation still works when browser storage is unavailable.
    }
  }, [currentPage]);

  // Sync dark mode class with body element
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('theme-dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.body.classList.remove('theme-dark');
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  const handleOpenCobat = (prompt?: string) => {
    setCobatInitialPrompt(prompt);
    setIsCobatFloatingOpen(true);
  };

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-150 ${isDarkMode ? 'theme-dark text-[#f2eee0]' : 'text-[#182a1d]'}`}>
      {/* 1. SIDEBAR */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          onSelectCustomer={handleSelectCustomer}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenCobat={handleOpenCobat}
        />

        {/* Page Main View with Suspense Chunk Loading */}
        <main className="flex-1 p-4 lg:p-8 max-w-[1600px] w-full mx-auto">
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center min-h-[400px] text-[var(--gold)] gap-3">
                <Loader2 size={32} className="animate-spin text-[var(--gold)]" />
                <span className="text-[13px] font-bold">در حال بارگذاری میز کار COPAN...</span>
              </div>
            }
          >
            {currentPage === 'dashboard' && (
              <DashboardPage
                onNavigate={(page) => setCurrentPage(page)}
                onSelectCustomer={handleSelectCustomer}
                onOpenCobat={handleOpenCobat}
              />
            )}

            {currentPage === 'cobat' && (
              <CobatPage
                onNavigate={(page) => setCurrentPage(page)}
                onSelectCustomer={handleSelectCustomer}
                selectedCustomerId={selectedCustomerId}
              />
            )}

            {currentPage === 'customers' && (
              <CustomersPage
                onNavigate={(page) => setCurrentPage(page)}
                onSelectCustomer={handleSelectCustomer}
                onOpenCobat={handleOpenCobat}
              />
            )}

            {currentPage === 'customer_360' && (
              <Customer360Page
                selectedCustomerId={selectedCustomerId}
                onSelectCustomer={handleSelectCustomer}
                onNavigate={(page) => setCurrentPage(page)}
                onOpenCobat={handleOpenCobat}
              />
            )}

            {currentPage === 'priorities' && (
              <PrioritiesPage
                onNavigate={(page) => setCurrentPage(page)}
                onSelectCustomer={handleSelectCustomer}
                onOpenCobat={handleOpenCobat}
              />
            )}

            {currentPage === 'opportunities' && (
              <OpportunitiesPage
                onNavigate={(page) => setCurrentPage(page)}
                onSelectCustomer={handleSelectCustomer}
                onOpenCobat={handleOpenCobat}
              />
            )}

            {currentPage === 'sales_intel' && (
              <SalesIntelligencePage
                onNavigate={(page) => setCurrentPage(page)}
                onSelectCustomer={handleSelectCustomer}
                onOpenCobat={handleOpenCobat}
              />
            )}

            {currentPage === 'market_intel' && (
              <MarketIntelligencePage
                onNavigate={(page) => setCurrentPage(page)}
                onOpenCobat={handleOpenCobat}
              />
            )}

            {currentPage === 'risks_alerts' && (
              <RisksAlertsPage
                onNavigate={(page) => setCurrentPage(page)}
                onSelectCustomer={handleSelectCustomer}
                onOpenCobat={handleOpenCobat}
              />
            )}

            {currentPage === 'settings' && (
              <SettingsPage />
            )}
          </Suspense>
        </main>
      </div>

      {/* 3. GLOBAL CONTEXTUAL FLOATING COBAT ASSISTANT */}
      <COBATFloatingPanel
        isOpen={isCobatFloatingOpen}
        onClose={() => setIsCobatFloatingOpen(false)}
        currentPage={currentPage}
        selectedCustomerId={selectedCustomerId}
        onNavigateToCustomer={(id) => {
          handleSelectCustomer(id);
          setCurrentPage('customer_360');
        }}
        onNavigateToPage={(p) => setCurrentPage(p)}
        initialPrompt={cobatInitialPrompt}
        onOpenFullWorkspace={() => setCurrentPage('cobat')}
      />

      {/* Floating COBAT Launcher Trigger Button (Bottom-Left in RTL, Prominent, Animated & Icon-Only) */}
      {!isCobatFloatingOpen && currentPage !== 'cobat' && (
        <button
          onClick={() => handleOpenCobat()}
          className="cobat-fab fixed bottom-6 left-6 z-40 w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[var(--text)] text-[var(--bg)] border-2 border-[var(--gold)]/45 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer group shadow-2xl"
          title="دستیار هوشمند تصمیم‌ساز کوبات (COBAT)"
          aria-label="دستیار هوشمند کوبات"
        >
          <div className="relative flex items-center justify-center">
            <Bot size={28} className="text-[var(--gold)] transition-transform group-hover:rotate-12 duration-200" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--gold)] animate-ping opacity-75" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--gold)] border-2 border-[var(--text)]" />
          </div>
        </button>
      )}
    </div>
  );
}

export function App() {
  return (
    <CopanProvider>
      <AppContent />
    </CopanProvider>
  );
}

export default App;
