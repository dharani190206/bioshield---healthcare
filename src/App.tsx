import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LiveSimulatorModal } from './components/common/LiveSimulatorModal';
import { HomeDashboard } from './views/HomeDashboard';
import { WildlifeMonitoring } from './views/WildlifeMonitoring';
import { RiskPrediction } from './views/RiskPrediction';
import { AlertNotificationView } from './views/AlertNotification';
import { DetectionHistoryView } from './views/DetectionHistory';
import { SafeDiversionControlView } from './views/SafeDiversionControl';
import { HardwareIntegrationView } from './views/HardwareIntegration';

const MainContent: React.FC<{ onOpenSimulator: () => void; mobileMenuOpen: boolean; setMobileMenuOpen: (v: boolean) => void }> = ({
  onOpenSimulator,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <HomeDashboard onOpenSimulator={onOpenSimulator} />;
      case 'monitoring':
        return <WildlifeMonitoring onOpenSimulator={onOpenSimulator} />;
      case 'risk':
        return <RiskPrediction onOpenSimulator={onOpenSimulator} />;
      case 'alerts':
        return <AlertNotificationView onOpenSimulator={onOpenSimulator} />;
      case 'history':
        return <DetectionHistoryView onOpenSimulator={onOpenSimulator} />;
      case 'diversion':
        return <SafeDiversionControlView onOpenSimulator={onOpenSimulator} />;
      case 'hardware':
        return <HardwareIntegrationView />;
      default:
        return <HomeDashboard onOpenSimulator={onOpenSimulator} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar
        onOpenSimulator={onOpenSimulator}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export function App() {
  const [simulatorModalOpen, setSimulatorModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <AppProvider>
      <MainContent
        onOpenSimulator={() => setSimulatorModalOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <LiveSimulatorModal
        isOpen={simulatorModalOpen}
        onClose={() => setSimulatorModalOpen(false)}
      />
    </AppProvider>
  );
}

export default App;
