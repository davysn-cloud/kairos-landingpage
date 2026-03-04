import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Package, Clock, CheckCircle, Truck, Eye, ChevronDown,
  ArrowLeft, Settings, BarChart3, Palette, Search, Filter,
} from "lucide-react";
import { Link } from "wouter";
import { GraficaNavbar } from "@/components/grafica/grafica-navbar";
import { Footer } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/grafica/price-engine";
import { apiRequest } from "@/lib/queryClient";
import type { Order } from "@shared/schema";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

type Tab = "orders" | "stats";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Aguardando", color: "text-yellow-600", bg: "bg-yellow-500/10" },
  confirmed: { label: "Confirmado", color: "text-blue-600", bg: "bg-blue-500/10" },
  production: { label: "Em produção", color: "text-purple-600", bg: "bg-purple-500/10" },
  shipped: { label: "Enviado", color: "text-indigo-600", bg: "bg-indigo-500/10" },
  delivered: { label: "Entregue", color: "text-green-600", bg: "bg-green-500/10" },
  cancelled: { label: "Cancelado", color: "text-red-600", bg: "bg-red-500/10" },
};

const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["production", "cancelled"],
  production: ["shipped"],
  shipped: ["delivered"],
};

export default function GraficaAdmin() {
  const [tab, setTab] = useState<Tab>("orders");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/grafica/admin/orders"],
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/grafica/orders/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/grafica/admin/orders"] });
    },
  });

  const filteredOrders = (orders ?? [])
    .filter((o) => statusFilter === "all" || o.status === statusFilter)
    .filter((o) => {
      if (!search) return true;
      return o.id.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const orderStats = {
    total: orders?.length ?? 0,
    pending: orders?.filter((o) => o.status === "pending").length ?? 0,
    production: orders?.filter((o) => o.status === "production").length ?? 0,
    revenue: orders?.reduce((sum, o) => sum + parseFloat(o.total), 0) ?? 0,
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <GraficaNavbar breadcrumbs={[{ label: "Admin" }]} />

      <div className="container mx-auto px-6 pt-8 pb-24">
        <Link href="/grafica">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao catálogo
          </div>
        </Link>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-display font-bold tracking-tight">Painel Admin</h1>
          </div>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Pedidos", value: orderStats.total, icon: Package },
            { label: "Aguardando", value: orderStats.pending, icon: Clock },
            { label: "Em Produção", value: orderStats.production, icon: Palette },
            { label: "Faturamento", value: formatCurrency(orderStats.revenue), icon: BarChart3 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="p-4 rounded-xl border border-border/50 bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <p className="text-2xl font-bold font-mono">{value}</p>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {([
            { key: "orders" as Tab, label: "Pedidos", icon: Package },
            { key: "stats" as Tab, label: "Estatísticas", icon: BarChart3 },
          ]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px",
                tab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === "orders" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por ID do pedido..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:border-primary outline-none transition-colors"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: "all", label: "Todos" },
                  { key: "pending", label: "Aguardando" },
                  { key: "confirmed", label: "Confirmados" },
                  { key: "production", label: "Produção" },
                  { key: "shipped", label: "Enviados" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setStatusFilter(key)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors",
                      statusFilter === key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders list */}
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nenhum pedido encontrado</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                const isExpanded = expandedOrder === order.id;
                const nextStatuses = STATUS_TRANSITIONS[order.status] ?? [];

                return (
                  <motion.div
                    key={order.id}
                    layout
                    className="rounded-xl border border-border/50 bg-card overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-muted/30 flex items-center justify-center">
                          <Package className="w-4 h-4 text-primary/40" />
                        </div>
                        <div>
                          <p className="font-medium text-sm font-mono">#{order.id.slice(0, 8)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                              day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", status.bg, status.color)}>
                          {status.label}
                        </span>
                        <span className="font-mono font-bold text-sm hidden sm:inline">
                          {formatCurrency(parseFloat(order.total))}
                        </span>
                        <ChevronDown className={cn(
                          "w-4 h-4 text-muted-foreground transition-transform",
                          isExpanded && "rotate-180",
                        )} />
                      </div>
                    </button>

                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border/50 p-4 space-y-4"
                      >
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Subtotal</p>
                            <p className="font-mono">{formatCurrency(parseFloat(order.subtotal))}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Frete</p>
                            <p className="font-mono">{formatCurrency(parseFloat(order.shippingCost))}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Total</p>
                            <p className="font-mono font-bold">{formatCurrency(parseFloat(order.total))}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Pagamento</p>
                            <p className="font-medium capitalize">{order.paymentMethod ?? "—"}</p>
                          </div>
                        </div>

                        {nextStatuses.length > 0 && (
                          <div className="flex gap-2 pt-2 border-t border-border/30">
                            <span className="text-xs text-muted-foreground self-center mr-2">Alterar status:</span>
                            {nextStatuses.map((s) => {
                              const sConfig = STATUS_CONFIG[s] ?? STATUS_CONFIG.pending;
                              return (
                                <button
                                  key={s}
                                  onClick={() => updateStatus.mutate({ id: order.id, status: s })}
                                  disabled={updateStatus.isPending}
                                  className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors",
                                    "border-border hover:border-primary/50",
                                    sConfig.color,
                                  )}
                                >
                                  {sConfig.label}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        <Link href={`/grafica/pedido/${order.id}`}>
                          <button className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                            <Eye className="w-3.5 h-3.5" />
                            Ver detalhes completos
                          </button>
                        </Link>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {tab === "stats" && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="text-center py-16"
          >
            <BarChart3 className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground">
              Relatórios e estatísticas detalhadas serão exibidos aqui
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Integração com analytics em desenvolvimento
            </p>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
