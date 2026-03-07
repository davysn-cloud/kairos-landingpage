import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Megaphone } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  recommended: boolean;
  features: string[];
  whatsappMessage: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
}

interface Step {
  id: string;
  number: string;
  title: string;
  description: string;
  sortOrder: number;
  createdAt: string;
}

interface PlanForm {
  name: string;
  price: string;
  period: string;
  recommended: boolean;
  features: string;
  whatsappMessage: string;
  sortOrder: string;
  active: boolean;
}

interface StepForm {
  number: string;
  title: string;
  description: string;
  sortOrder: string;
}

const emptyPlanForm: PlanForm = {
  name: "",
  price: "",
  period: "/mês",
  recommended: false,
  features: "",
  whatsappMessage: "",
  sortOrder: "0",
  active: true,
};

const emptyStepForm: StepForm = {
  number: "",
  title: "",
  description: "",
  sortOrder: "0",
};

export default function EstrategiaAdmin() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"plans" | "steps">("plans");

  // ── Plans State ──
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planForm, setPlanForm] = useState<PlanForm>(emptyPlanForm);

  // ── Steps State ──
  const [showStepForm, setShowStepForm] = useState(false);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [stepForm, setStepForm] = useState<StepForm>(emptyStepForm);

  // ── Queries ──
  const { data: plans = [], isLoading: loadingPlans } = useQuery<Plan[]>({
    queryKey: ["/api/admin/estrategia/plans"],
  });

  const { data: steps = [], isLoading: loadingSteps } = useQuery<Step[]>({
    queryKey: ["/api/admin/estrategia/steps"],
  });

  // ── Plan Mutations ──
  const createPlan = useMutation({
    mutationFn: async (data: PlanForm) => {
      const body = {
        ...data,
        features: data.features.split("\n").map((f) => f.trim()).filter(Boolean),
        sortOrder: parseInt(data.sortOrder) || 0,
      };
      const res = await apiRequest("POST", "/api/admin/estrategia/plans", body);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/estrategia/plans"] });
      setShowPlanForm(false);
      setPlanForm(emptyPlanForm);
    },
  });

  const updatePlan = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PlanForm }) => {
      const body = {
        ...data,
        features: data.features.split("\n").map((f) => f.trim()).filter(Boolean),
        sortOrder: parseInt(data.sortOrder) || 0,
      };
      const res = await apiRequest("PATCH", `/api/admin/estrategia/plans/${id}`, body);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/estrategia/plans"] });
      setEditingPlanId(null);
      setShowPlanForm(false);
      setPlanForm(emptyPlanForm);
    },
  });

  const deletePlan = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/estrategia/plans/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/estrategia/plans"] });
    },
  });

  // ── Step Mutations ──
  const createStep = useMutation({
    mutationFn: async (data: StepForm) => {
      const body = { ...data, sortOrder: parseInt(data.sortOrder) || 0 };
      const res = await apiRequest("POST", "/api/admin/estrategia/steps", body);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/estrategia/steps"] });
      setShowStepForm(false);
      setStepForm(emptyStepForm);
    },
  });

  const updateStep = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: StepForm }) => {
      const body = { ...data, sortOrder: parseInt(data.sortOrder) || 0 };
      const res = await apiRequest("PATCH", `/api/admin/estrategia/steps/${id}`, body);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/estrategia/steps"] });
      setEditingStepId(null);
      setShowStepForm(false);
      setStepForm(emptyStepForm);
    },
  });

  const deleteStep = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/estrategia/steps/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/estrategia/steps"] });
    },
  });

  // ── Helpers ──
  function openEditPlan(plan: Plan) {
    setPlanForm({
      name: plan.name,
      price: plan.price,
      period: plan.period,
      recommended: plan.recommended,
      features: plan.features.join("\n"),
      whatsappMessage: plan.whatsappMessage,
      sortOrder: String(plan.sortOrder),
      active: plan.active,
    });
    setEditingPlanId(plan.id);
    setShowPlanForm(true);
  }

  function openEditStep(step: Step) {
    setStepForm({
      number: step.number,
      title: step.title,
      description: step.description,
      sortOrder: String(step.sortOrder),
    });
    setEditingStepId(step.id);
    setShowStepForm(true);
  }

  function handlePlanSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingPlanId) {
      updatePlan.mutate({ id: editingPlanId, data: planForm });
    } else {
      createPlan.mutate(planForm);
    }
  }

  function handleStepSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingStepId) {
      updateStep.mutate({ id: editingStepId, data: stepForm });
    } else {
      createStep.mutate(stepForm);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="h-6 w-6" /> Estratégia de Conteúdo
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie planos e passos da página de estratégia
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        <button
          onClick={() => setTab("plans")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "plans"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Planos ({plans.length})
        </button>
        <button
          onClick={() => setTab("steps")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "steps"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Passos ({steps.length})
        </button>
      </div>

      {/* ══════════════ PLANS TAB ══════════════ */}
      {tab === "plans" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => { setShowPlanForm(true); setEditingPlanId(null); setPlanForm(emptyPlanForm); }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" /> Novo Plano
            </button>
          </div>

          {showPlanForm && (
            <form onSubmit={handlePlanSubmit} className="rounded-xl border bg-card p-5 space-y-4">
              <h2 className="font-bold">{editingPlanId ? "Editar Plano" : "Novo Plano"}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Nome</label>
                  <input
                    type="text"
                    required
                    value={planForm.name}
                    onChange={(e) => setPlanForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                    placeholder="Estratégia Digital"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Preço</label>
                  <input
                    type="text"
                    required
                    value={planForm.price}
                    onChange={(e) => setPlanForm((f) => ({ ...f, price: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                    placeholder="R$ 997"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Período</label>
                  <input
                    type="text"
                    value={planForm.period}
                    onChange={(e) => setPlanForm((f) => ({ ...f, period: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                    placeholder="/mês"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Ordem</label>
                  <input
                    type="number"
                    value={planForm.sortOrder}
                    onChange={(e) => setPlanForm((f) => ({ ...f, sortOrder: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                  />
                </div>
                <div className="flex items-center gap-4 pt-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={planForm.recommended}
                      onChange={(e) => setPlanForm((f) => ({ ...f, recommended: e.target.checked }))}
                    />
                    Recomendado
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={planForm.active}
                      onChange={(e) => setPlanForm((f) => ({ ...f, active: e.target.checked }))}
                    />
                    Ativo
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Features (1 por linha)</label>
                <textarea
                  value={planForm.features}
                  onChange={(e) => setPlanForm((f) => ({ ...f, features: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm font-mono"
                  placeholder={"Gestão de 2 redes sociais\n12 posts/mês\nRelatório mensal"}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Mensagem WhatsApp</label>
                <input
                  type="text"
                  value={planForm.whatsappMessage}
                  onChange={(e) => setPlanForm((f) => ({ ...f, whatsappMessage: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                  placeholder="Olá! Tenho interesse no plano..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={createPlan.isPending || updatePlan.isPending}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                >
                  {editingPlanId ? "Salvar" : "Criar"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowPlanForm(false); setEditingPlanId(null); setPlanForm(emptyPlanForm); }}
                  className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {loadingPlans ? (
            <div className="text-sm text-muted-foreground">Carregando...</div>
          ) : plans.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Nenhum plano cadastrado</p>
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 text-left">
                    <th className="px-4 py-3 font-medium">Ordem</th>
                    <th className="px-4 py-3 font-medium">Nome</th>
                    <th className="px-4 py-3 font-medium">Preço</th>
                    <th className="px-4 py-3 font-medium">Features</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium w-24">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan.id} className="border-t hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">{plan.sortOrder}</td>
                      <td className="px-4 py-3 font-medium">
                        {plan.name}
                        {plan.recommended && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            Recomendado
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">{plan.price}{plan.period}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {plan.features.length} itens
                      </td>
                      <td className="px-4 py-3">
                        {plan.active ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Ativo</span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Inativo</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => openEditPlan(plan)} className="p-1.5 rounded hover:bg-muted transition-colors" title="Editar">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => { if (confirm(`Deletar plano "${plan.name}"?`)) deletePlan.mutate(plan.id); }}
                            className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                            title="Deletar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══════════════ STEPS TAB ══════════════ */}
      {tab === "steps" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => { setShowStepForm(true); setEditingStepId(null); setStepForm(emptyStepForm); }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" /> Novo Passo
            </button>
          </div>

          {showStepForm && (
            <form onSubmit={handleStepSubmit} className="rounded-xl border bg-card p-5 space-y-4">
              <h2 className="font-bold">{editingStepId ? "Editar Passo" : "Novo Passo"}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Número</label>
                  <input
                    type="text"
                    required
                    value={stepForm.number}
                    onChange={(e) => setStepForm((f) => ({ ...f, number: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                    placeholder="01"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Título</label>
                  <input
                    type="text"
                    required
                    value={stepForm.title}
                    onChange={(e) => setStepForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                    placeholder="Conversa inicial"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Descrição</label>
                  <input
                    type="text"
                    required
                    value={stepForm.description}
                    onChange={(e) => setStepForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                    placeholder="Entendemos sua marca e objetivos"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Ordem</label>
                  <input
                    type="number"
                    value={stepForm.sortOrder}
                    onChange={(e) => setStepForm((f) => ({ ...f, sortOrder: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={createStep.isPending || updateStep.isPending}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                >
                  {editingStepId ? "Salvar" : "Criar"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowStepForm(false); setEditingStepId(null); setStepForm(emptyStepForm); }}
                  className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {loadingSteps ? (
            <div className="text-sm text-muted-foreground">Carregando...</div>
          ) : steps.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Nenhum passo cadastrado</p>
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 text-left">
                    <th className="px-4 py-3 font-medium">Ordem</th>
                    <th className="px-4 py-3 font-medium">Número</th>
                    <th className="px-4 py-3 font-medium">Título</th>
                    <th className="px-4 py-3 font-medium">Descrição</th>
                    <th className="px-4 py-3 font-medium w-24">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {steps.map((step) => (
                    <tr key={step.id} className="border-t hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">{step.sortOrder}</td>
                      <td className="px-4 py-3 font-mono font-bold">{step.number}</td>
                      <td className="px-4 py-3 font-medium">{step.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">{step.description}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => openEditStep(step)} className="p-1.5 rounded hover:bg-muted transition-colors" title="Editar">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => { if (confirm(`Deletar passo "${step.title}"?`)) deleteStep.mutate(step.id); }}
                            className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                            title="Deletar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
