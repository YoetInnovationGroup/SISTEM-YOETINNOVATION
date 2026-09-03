import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  X, 
  ArrowRight,
  Sparkles,
  ShoppingBag,
  CreditCard,
  FileCheck
} from 'lucide-react';
import { DarkFolderEmptyState } from './DarkFolderEmptyState.tsx';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll.ts';

interface OrderItem {
  id: string;
  orderNumber: string;
  clientName: string;
  serviceTitle: string;
  amount: string;
  paymentStatus: 'Paid' | 'Pending' | 'In Progress';
  fulfillmentStatus: 'Completed' | 'Processing' | 'Draft';
  createdAt: string;
}

export const OrdersView: React.FC<{ onOpenNewClientModal?: () => void }> = () => {
  const [orders, setOrders] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem('app-orders-list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return []; // Starts empty to showcase the exact design from user image!
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  useLockBodyScroll(isCreateModalOpen);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);
  const [orderForm, setOrderForm] = useState({
    clientName: '',
    serviceTitle: 'Constitución de Sociedad',
    amount: '$1,500',
    paymentStatus: 'In Progress' as 'Paid' | 'Pending' | 'In Progress',
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.clientName.trim()) return;

    const newOrder: OrderItem = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: orderForm.clientName.trim(),
      serviceTitle: orderForm.serviceTitle,
      amount: orderForm.amount.startsWith('$') ? orderForm.amount : `$${orderForm.amount}`,
      paymentStatus: orderForm.paymentStatus,
      fulfillmentStatus: 'Processing',
      createdAt: new Date().toLocaleDateString('es-CR'),
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('app-orders-list', JSON.stringify(updated));
    setIsCreateModalOpen(false);
    setOrderForm({
      clientName: '',
      serviceTitle: 'Constitución de Sociedad',
      amount: '$1,500',
      paymentStatus: 'In Progress',
    });
  };

  const handleClearOrders = () => {
    setOrders([]);
    localStorage.removeItem('app-orders-list');
  };

  return (
    <div className="space-y-6 pb-16 w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/40 text-[#2575FC] dark:text-[#60A5FA] text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#2575FC] dark:text-[#60A5FA]" />
              <span>Gestión de Órdenes & Fulfillment</span>
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">•</span>
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              {orders.length} órdenes registradas
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Órdenes & Seguimiento de Trámites
          </h1>
          <p className="text-[13.5px] text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
            Control integral de cumplimiento de pedidos, recaudación de honorarios y avance de expedientes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {orders.length > 0 && (
            <button
              type="button"
              onClick={handleClearOrders}
              className="px-3.5 py-2 text-xs font-semibold text-neutral-500 hover:text-rose-600 dark:text-neutral-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              Vaciar para ver estado inicial
            </button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2575FC] to-[#2169C4] hover:from-[#1E60B5] hover:to-[#0A192F] text-white rounded-2xl text-xs font-semibold shadow-sm shadow-blue-500/20 hover:shadow-blue-500/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nueva Orden</span>
          </motion.button>
        </div>
      </div>

      {/* Main View Area: Exact User Image Empty State when empty */}
      {orders.length === 0 ? (
        <div className="w-full">
          <DarkFolderEmptyState
            title="Expect to see your orders appear here soon!"
            subtitle="Here is where you'll manage order fulfillment, payment collection, and order progress tracking."
            buttonText="Create New"
            onCreateNew={() => setIsCreateModalOpen(true)}
          />
        </div>
      ) : (
        /* Orders List */
        <div className="apple-card rounded-3xl border border-black/[0.05] dark:border-white/[0.08] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/[0.02] dark:bg-white/[0.03] text-neutral-500 dark:text-neutral-400 font-semibold border-b border-black/[0.05] dark:border-white/[0.06]">
                <tr>
                  <th className="py-3.5 px-5">Número de Orden</th>
                  <th className="py-3.5 px-4">Cliente / Solicitante</th>
                  <th className="py-3.5 px-4">Trámite / Servicio</th>
                  <th className="py-3.5 px-4">Honorarios</th>
                  <th className="py-3.5 px-4">Estado de Pago</th>
                  <th className="py-3.5 px-4">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {ord.orderNumber}
                    </td>
                    <td className="py-4 px-4 font-semibold text-neutral-800 dark:text-neutral-200">
                      {ord.clientName}
                    </td>
                    <td className="py-4 px-4 text-neutral-600 dark:text-neutral-300">
                      {ord.serviceTitle}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#2575FC] dark:text-[#60A5FA]">
                      {ord.amount}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                        ord.paymentStatus === 'Paid'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2575FC] dark:text-[#60A5FA] text-[11px] font-semibold">
                        <Clock className="w-3 h-3" />
                        <span>{ord.fulfillmentStatus}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="fixed inset-0 bg-black/60"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="relative w-full max-w-md bg-white dark:bg-[#141417] border border-black/[0.08] dark:border-white/[0.1] rounded-3xl shadow-2xl z-10 my-auto overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-[#2575FC] dark:text-[#60A5FA] flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
                      Crear Nueva Orden
                    </h3>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Gestión de cobro y cumplimiento de trámite
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Nombre del Cliente / Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Inversiones Los Robles S.A."
                    value={orderForm.clientName}
                    onChange={(e) => setOrderForm({ ...orderForm, clientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-xs text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#2575FC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Servicio Notarial
                  </label>
                  <select
                    value={orderForm.serviceTitle}
                    onChange={(e) => setOrderForm({ ...orderForm, serviceTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-xs text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#2575FC] font-medium outline-none"
                  >
                    <option value="Constitución de Sociedad">Constitución de Sociedad</option>
                    <option value="Poder">Poder</option>
                    <option value="Fideicomiso">Fideicomiso</option>
                    <option value="Testamentos">Testamentos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Monto de Honorario ($)
                  </label>
                  <input
                    type="text"
                    value={orderForm.amount}
                    onChange={(e) => setOrderForm({ ...orderForm, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-[#2A2A32] bg-neutral-50 dark:bg-[#1C1C21] text-xs text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#2575FC]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-[#26262B]">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-[#202026] rounded-xl hover:bg-neutral-200 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#2575FC] hover:bg-[#2169C4] rounded-xl shadow-xs cursor-pointer"
                  >
                    Crear Orden
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
