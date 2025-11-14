import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Drawer } from './components/Drawer';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Categories } from './components/Categories';
import { Accounts } from './components/Accounts';
import { Notes } from './components/Notes';
import { initializeSampleData, setGuestMode, isGuestMode } from './lib/storage';

type Page = 'dashboard' | 'transactions' | 'categories' | 'accounts' | 'notes';

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [showWelcome, setShowWelcome] = useState(!isGuestMode() && !localStorage.getItem('welcomed'));

  useEffect(() => {
    initializeSampleData();
  }, []);

  const handleStartGuest = () => {
    setGuestMode(true);
    localStorage.setItem('welcomed', 'true');
    setShowWelcome(false);
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Dashboard';
      case 'transactions': return 'Transactions';
      case 'categories': return 'Categories';
      case 'accounts': return 'Accounts';
      case 'notes': return 'Notes';
      default: return 'Finance Tracker';
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'transactions': return <Transactions />;
      case 'categories': return <Categories />;
      case 'accounts': return <Accounts />;
      case 'notes': return <Notes />;
      default: return <Dashboard />;
    }
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center">
          <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="mb-2">Welcome to Finance Tracker</h1>
          
          <p className="text-gray-600 mb-8">
            Manage your income, expenses, and financial accounts all in one place. 
            Your data is stored locally on your device.
          </p>

          <button
            onClick={handleStartGuest}
            className="w-full py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors mb-3"
          >
            Continue as Guest
          </button>

          <p className="text-xs text-gray-500">
            All data is stored locally in your browser
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setIsDrawerOpen(true)} title={getPageTitle()} />
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page as Page)}
      />
      <main className="max-w-2xl mx-auto">
        {renderPage()}
      </main>
    </div>
  );
}
