import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Ticket } from "lucide-react";
import { getAdminQueryFn, adminApiRequest } from "@/lib/admin-api";

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: string;
  minOrderAmount: string;
  maxUses: number | null;
  currentUses: number;
  validFrom: string;
  validTo: string;
  active: boolean;
  createdAt: string;
}

interface CouponForm {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: string;
  minOrderAmount: string;
  maxUses: string;
  validFrom: string;
  validTo: string;
  active: boolean;
}

const emptyForm: CouponForm = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minOrderAmount: "0",
  maxUses: "",
  validFrom: new Date().toISOString().slice(0, 16),
  validTo: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 16),
  active: true,
};

export default function CouponsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CouponForm>(emptyForm);

  const { data: coupons = [], isLoading } = useQuery<Coupon[]>({
    queryKey: ["/api/admin/coupons"],
    queryFn: getAdminQueryFn(),
  });

  const createMutation = useMutation({
    mutationFn: async (data: CouponForm) => {
      const body = {
        ...data,
        maxUses: data.maxUses ? parseInt(data.maxUses) : null,
      };
      const res = await adminApiRequest("POST", "/api/admin/coupons", body);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
      setShowForm(false);
      setForm(emptyForm);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CouponForm }) => {
      const body = {
        ...data,
        maxUses: data.maxUses ? parseInt(data.maxUses) : null,
      };
      const res = await adminApiRequest("PATCH", `/api/admin/coupons/${id}`, body);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
      setEditingId(null);
      setShowForm(false);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await adminApiRequest("DELETE", `/api/admin/coupons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
    },
  });

  function openEdit(coupon: Coupon) {
    setForm({
      code: coupon.code,
      discountType: coupon.discountType as "percentage" | "fixed",
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxUses: coupon.maxUses?.toString() || "",
      validFrom: new Date(coupon.validFrom).toISOString().slice(0, 16),
      validTo: new Date(coupon.validTo).toISOString().slice(0, 16),
      active: coupon.active,
    });
    setEditingId(coupon.id);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Ticket className="h-6 w-6" /> Cupons de Desconto
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{coupons.length} cupons cadastrados</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Novo Cupom
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-5 space-y-4">
          <h2 className="font-bold">{editingId ? "Editar Cupom" : "Novo Cupom"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Código</label>
              <input
                type="text"
                required
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm font-mono uppercase"
                placeholder="DESCONTO10"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Tipo</label>
              <select
                value={form.discountType}
                onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value as "percentage" | "fixed" }))}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
              >
                <option value="percentage">Porcentagem (%)</option>
                <option value="fixed">Valor fixo (R$)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">
                Valor {form.discountType === "percentage" ? "(%)" : "(R$)"}
              </label>
              <input
                type="text"
                required
                value={form.discountValue}
                onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                placeholder={form.discountType === "percentage" ? "10" : "25.00"}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Pedido mínimo (R$)</label>
              <input
                type="text"
                value={form.minOrderAmount}
                onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Limite de usos</label>
              <input
                type="number"
                value={form.maxUses}
                onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                placeholder="Ilimitado"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                id="coupon-active"
              />
              <label htmlFor="coupon-active" className="text-sm">Ativo</label>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Válido de</label>
              <input
                type="datetime-local"
                required
                value={form.validFrom}
                onChange={(e) => setForm((f) => ({ ...f, validFrom: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Válido até</label>
              <input
                type="datetime-local"
                required
                value={form.validTo}
                onChange={(e) => setForm((f) => ({ ...f, validTo: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {editingId ? "Salvar" : "Criar"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
              className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Carregando...</div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Ticket className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Nenhum cupom cadastrado</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium">Código</th>
                <th className="px-4 py-3 font-medium">Desconto</th>
                <th className="px-4 py-3 font-medium">Usos</th>
                <th className="px-4 py-3 font-medium">Validade</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium w-24">Ações</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => {
                const now = new Date();
                const expired = new Date(coupon.validTo) < now;
                const usedUp = coupon.maxUses !== null && coupon.currentUses >= coupon.maxUses;
                return (
                  <tr key={coupon.id} className="border-t hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold">{coupon.code}</td>
                    <td className="px-4 py-3">
                      {coupon.discountType === "percentage"
                        ? `${parseFloat(coupon.discountValue)}%`
                        : `R$ ${parseFloat(coupon.discountValue).toFixed(2)}`}
                      {parseFloat(coupon.minOrderAmount) > 0 && (
                        <span className="text-xs text-muted-foreground ml-1">
                          (min R$ {parseFloat(coupon.minOrderAmount).toFixed(2)})
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {coupon.currentUses}{coupon.maxUses !== null ? `/${coupon.maxUses}` : ""}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {new Date(coupon.validFrom).toLocaleDateString("pt-BR")} — {new Date(coupon.validTo).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      {!coupon.active ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Inativo</span>
                      ) : expired ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">Expirado</span>
                      ) : usedUp ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Esgotado</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Ativo</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(coupon)}
                          className="p-1.5 rounded hover:bg-muted transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Deletar cupom ${coupon.code}?`)) {
                              deleteMutation.mutate(coupon.id);
                            }
                          }}
                          className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                          title="Deletar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
