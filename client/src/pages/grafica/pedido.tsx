import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Package, Clock, CheckCircle, Truck, MapPin, ArrowLeft,
  Loader2, AlertCircle, RefreshCw,
} from "lucide-react";
import { Link } from "wouter";
import { GraficaNavbar } from "@/components/grafica/grafica-navbar";
import { Footer } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/grafica/price-engine";
import type { OrderWithItems } from "@shared/types";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

interface GraficaPedidoProps {
  id: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Aguardando pagamento", color: "text-yellow-500", icon: Clock },
  confirmed: { label: "Pagamento confirmado", color: "text-blue-500", icon: CheckCircle },
  production: { label: "Em produção", color: "text-purple-500", icon: Package },
  shipped: { label: "Enviado", color: "text-indigo-500", icon: Truck },
  delivered: { label: "Entregue", color: "text-green-500", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "text-red-500", icon: Clock },
};

const PAYMENT_STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendente", color: "text-yellow-500" },
  approved: { label: "Aprovado", color: "text-green-500" },
  rejected: { label: "Recusado", color: "text-red-500" },
};

/**
 * Parse MercadoPago back_url query params.
 * MP redirects with ?mp_status=approved|rejected|pending
 * and also adds collection_id, collection_status, payment_id, etc.
 */
function getMpStatusFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("mp_status") || params.get("collection_status") || null;
}

export default function GraficaPedido({ id }: GraficaPedidoProps) {
  const [mpStatus, setMpStatus] = useState<string | null>(null);

  useEffect(() => {
    setMpStatus(getMpStatusFromUrl());
  }, []);

  // Fetch order with auto-refetch when payment is pending (webhook may update it)
  const { data: order, isLoading, error, refetch } = useQuery<OrderWithItems>({
    queryKey: ["/api/grafica/orders", id],
    refetchInterval: (query) => {
      const data = query.state.data;
      // Auto-poll every 5s while payment is pending (waiting for webhook)
      if (data && data.paymentStatus === "pending") return 5000;
      return false;
    },
  });

  const statusInfo = order ? STATUS_MAP[order.status] ?? STATUS_MAP.pending : STATUS_MAP.pending;
  const StatusIcon = statusInfo.icon;
  const paymentInfo = order ? PAYMENT_STATUS_MAP[order.paymentStatus] ?? PAYMENT_STATUS_MAP.pending : PAYMENT_STATUS_MAP.pending;

  // Show MP redirect banner based on URL params
  const showMpBanner = mpStatus && order?.paymentStatus === "pending";

  return (
    <div className="min-h-screen bg-background font-sans">
      <GraficaNavbar breadcrumbs={[{ label: `Pedido #${id.slice(0, 8)}` }]} />

      <div className="container mx-auto px-6 pt-8 pb-24">
        <Link href="/grafica">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao catálogo
          </div>
        </Link>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        ) : error || !order ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Pedido não encontrado.</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <h1 className="text-3xl font-display font-bold tracking-tight">
                Pedido <span className="font-mono text-primary">#{order.id.slice(0, 8)}</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Realizado em {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit", month: "long", year: "numeric",
                })}
              </p>
            </motion.div>

            {/* MercadoPago redirect banner */}
            {showMpBanner && mpStatus === "approved" && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl border border-green-500/30 bg-green-500/5 p-5 flex items-start gap-3"
              >
                <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                <div>
                  <p className="font-medium text-green-500">Pagamento realizado!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Seu pagamento foi processado pelo Mercado Pago. Aguardando confirmação final...
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Atualizando status automaticamente</span>
                  </div>
                </div>
              </motion.div>
            )}

            {showMpBanner && mpStatus === "pending" && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5 flex items-start gap-3"
              >
                <Clock className="w-6 h-6 text-yellow-500 shrink-0" />
                <div>
                  <p className="font-medium text-yellow-500">Pagamento pendente</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Seu pagamento está sendo processado. Você receberá a confirmação em breve.
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Atualizando status automaticamente</span>
                  </div>
                </div>
              </motion.div>
            )}

            {showMpBanner && mpStatus === "rejected" && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl border border-red-500/30 bg-red-500/5 p-5 flex items-start gap-3"
              >
                <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                <div>
                  <p className="font-medium text-red-500">Pagamento não aprovado</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    O pagamento não foi aprovado. Você pode tentar novamente com outro método de pagamento.
                  </p>
                </div>
              </motion.div>
            )}

            {mpStatus === "error" && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-5 flex items-start gap-3"
              >
                <AlertCircle className="w-6 h-6 text-orange-500 shrink-0" />
                <div>
                  <p className="font-medium text-orange-500">Erro na criação do pagamento</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Houve um erro ao conectar com o Mercado Pago. Entre em contato conosco para finalizar o pagamento.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Status */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="rounded-xl border border-border/50 p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIcon className={cn("w-6 h-6", statusInfo.color)} />
                  <div>
                    <p className={cn("font-medium", statusInfo.color)}>{statusInfo.label}</p>
                    <p className="text-xs text-muted-foreground">
                      Pagamento: <span className={paymentInfo.color}>{paymentInfo.label}</span>
                      {order.paymentMethod && ` (${order.paymentMethod})`}
                    </p>
                  </div>
                </div>
                {order.paymentStatus === "pending" && (
                  <button
                    onClick={() => refetch()}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    title="Atualizar status"
                  >
                    <RefreshCw className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>

              {order.shippingTrackingCode && (
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Rastreio:</span>
                  <span className="font-mono font-medium">{order.shippingTrackingCode}</span>
                </div>
              )}
            </motion.div>

            {/* Items */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              className="rounded-xl border border-border/50 p-5 space-y-4"
            >
              <h2 className="font-display font-bold">Itens do Pedido</h2>
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3 border-b border-border/30 last:border-0">
                  <div className="w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-primary/20">
                      {item.productName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity.toLocaleString("pt-BR")} un. x {formatCurrency(parseFloat(item.unitPrice))}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-sm">
                    {formatCurrency(parseFloat(item.subtotal))}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Totals */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-2"
            >
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">{formatCurrency(parseFloat(order.subtotal))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span className="font-mono">{formatCurrency(parseFloat(order.shippingCost))}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between">
                <span className="font-display font-bold">Total</span>
                <span className="text-xl font-bold text-primary font-mono">
                  {formatCurrency(parseFloat(order.total))}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
