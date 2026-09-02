import React, { useState, useEffect } from 'react';
import { SidebarDock } from './components/SidebarDock.tsx';
import { TopNavbar } from './components/TopNavbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { NotificationsCard } from './components/NotificationsCard.tsx';
import { AssignmentsCard } from './components/AssignmentsCard.tsx';
import { CalendarCard } from './components/CalendarCard.tsx';
import { TodayTasksCard } from './components/TodayTasksCard.tsx';
import { GoPremiumCard } from './components/GoPremiumCard.tsx';
import { AnalyticsAndMeeting } from './components/AnalyticsAndMeeting.tsx';
import { ClientDirectory } from './components/clients/ClientDirectory.tsx';
import { ClientDetail } from './components/clients/ClientDetail.tsx';
import { OrdersView } from './components/OrdersView.tsx';
import { TareasView } from './components/views/TareasView.tsx';
import { AlertasView } from './components/views/AlertasView.tsx';
import { ReportesView } from './components/views/ReportesView.tsx';
import { ConfiguracionView } from './components/views/ConfiguracionView.tsx';
import { INITIAL_CLIENTS } from './data/mockClients.ts';
import { Client } from './types/client.ts';

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('app-clients-data-v7');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CLIENTS;
      }
    }
    return INITIAL_CLIENTS;
  });
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('app-theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Scroll to top automatically when navigating between sections or selecting clients
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    const mainEl = document.getElementById('main-content');
    if (mainEl) {
      mainEl.scrollTop = 0;
      if (mainEl.scrollTo) mainEl.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [activeNav, selectedClientId]);

  // Persist clients data
  useEffect(() => {
    localStorage.setItem('app-clients-data-v7', JSON.stringify(clients));
  }, [clients]);

  // Handlers for clients
  const handleUpdateClient = (updatedClient: Client) => {
    setClients((prev) =>
      prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
    );
  };

  const handleAddClient = (newClient: Client) => {
    setClients((prev) => [newClient, ...prev]);
    setSelectedClientId(newClient.id);
  };

  const handleSelectNav = (navId: string) => {
    setActiveNav(navId);
    // Ensure clicking 'Clientes' opens the directory, not the last viewed client
    setSelectedClientId(null);
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId) || null;

  const isClientsView = activeNav === 'user' || activeNav === 'clientes';

  return (
    <div className={`min-h-screen w-full font-sans antialiased relative overflow-x-hidden flex flex-col md:flex-row ${
      theme === 'dark' ? 'bg-[#090909] text-neutral-100 dark' : 'bg-[#E6EBEF] text-neutral-900'
    }`}>
      {/* System Background Image & Ambient Overlay - Hardware-accelerated static surface */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{ transform: 'translateZ(0)', contain: 'strict' }}
      >
        {/* Main Background Image */}
        <img 
          src="https://i.imgur.com/JS3DI9s.jpeg" 
          alt="System Background" 
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Backdrop tint overlay for ideal contrast and theme harmony - High-performance solid alpha without blur lag */}
        <div 
          className={`absolute inset-0 transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-black/60' 
              : 'bg-[#E6EBEF]/60'
          }`} 
        />

        {/* Subtle Apple / Gemini Dotted Canvas Grid */}
        <div className="absolute inset-0 bg-dot-grid opacity-30 dark:opacity-20 mix-blend-overlay" />

        {/* Ambient Luminous Nebula Glows (Hardware-isolated) */}
        <div 
          className="absolute -top-[10%] right-[5%] w-[550px] h-[550px] rounded-full blur-[90px] opacity-25 dark:opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #2575FC 0%, #2169C4 60%, transparent 80%)', transform: 'translateZ(0)' }}
        />
        <div 
          className="absolute top-[35%] -left-[10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-20 dark:opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3D4B5C 0%, #0A192F 60%, transparent 80%)', transform: 'translateZ(0)' }}
        />
        <div 
          className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] rounded-full blur-[90px] opacity-20 dark:opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #9EADC2 0%, #2169C4 60%, transparent 80%)', transform: 'translateZ(0)' }}
        />

        {/* Elegant Minimal Connection Node Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="fine-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={theme === 'dark' ? 'rgba(158,173,194,0.06)' : 'rgba(61,75,92,0.06)'} strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fine-grid)" />
          
          {/* Subtle connected nodes in Signal Blue & Union Blue */}
          <circle cx="20%" cy="18%" r="3" fill={theme === 'dark' ? '#2575FC' : '#2169C4'} opacity="0.5" />
          <circle cx="85%" cy="32%" r="3" fill={theme === 'dark' ? '#9EADC2' : '#3D4B5C'} opacity="0.5" />
          <path d="M 200 180 Q 500 100 850 320" stroke={theme === 'dark' ? 'rgba(37,117,252,0.2)' : 'rgba(33,105,196,0.18)'} strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
        </svg>
      </div>

      {/* Left Floating Double-Curve Wave Sidebar Navigation */}
      <SidebarDock 
        activeTab={activeNav} 
        onSelectTab={handleSelectNav} 
      />

      {/* Main Workspace Area */}
      <main 
        id="main-content" 
        className="relative z-10 flex-1 flex flex-col min-w-0 p-3 sm:p-5 lg:p-6 max-w-[1600px] mx-auto w-full"
      >
        {/* Top Navbar */}
        <TopNavbar 
          activeSection={activeNav}
          onSelectSection={handleSelectNav}
          onAddNewBoard={() => {
            setActiveNav('clientes');
            setSelectedClientId(null);
          }}
        />

        {/* Main Content Sections - Instant Switching without animation lag */}
        {activeNav === 'tareas' ? (
          <div key="tareas-view">
            <TareasView />
          </div>
        ) : activeNav === 'alertas' ? (
          <div key="alertas-view">
            <AlertasView />
          </div>
        ) : activeNav === 'reportes' ? (
          <div key="reportes-view">
            <ReportesView />
          </div>
        ) : activeNav === 'configuracion' ? (
          <div key="configuracion-view">
            <ConfiguracionView theme={theme} onThemeChange={setTheme} />
          </div>
        ) : activeNav === 'orders' || activeNav === 'integrations' ? (
          <div key="orders-view">
            <OrdersView
              onOpenNewClientModal={() => {
                setActiveNav('clientes');
                setSelectedClientId(null);
              }}
            />
          </div>
        ) : isClientsView ? (
          <div key={selectedClientId ? `client-detail-${selectedClientId}` : 'client-directory'}>
            {selectedClient ? (
              <ClientDetail
                client={selectedClient}
                allClients={clients}
                onBack={() => setSelectedClientId(null)}
                onUpdateClient={handleUpdateClient}
                onSelectClientById={(id) => setSelectedClientId(id)}
              />
            ) : (
              <ClientDirectory
                clients={clients}
                onSelectClient={(id) => setSelectedClientId(id)}
                onAddClient={handleAddClient}
              />
            )}
          </div>
        ) : (
          <div key="dashboard-view" className="space-y-5">
            {/* Hero Section */}
            <HeroSection />

            {/* Middle Row: Notifications, Assignments, May 2021 Calendar */}
            <section 
              id="middle-cards-section" 
              aria-label="Overview Cards"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <NotificationsCard />
              <AssignmentsCard />
              <CalendarCard />
            </section>

            {/* Bottom Row: Today Tasks, Go Premium, Analytics & Board Meeting */}
            <section 
              id="bottom-cards-section"
              aria-label="Tasks and Analytics"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 items-stretch"
            >
              {/* Today Tasks Table */}
              <div className="xl:col-span-5 flex flex-col">
                <TodayTasksCard />
              </div>

              {/* Go Premium Card */}
              <div className="xl:col-span-3 flex flex-col">
                <GoPremiumCard />
              </div>

              {/* Stats & Board Meeting */}
              <div className="xl:col-span-4 flex flex-col">
                <AnalyticsAndMeeting />
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
