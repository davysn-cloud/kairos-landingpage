-- Estratégia de Conteúdo: Plans
CREATE TABLE IF NOT EXISTS "estrategia_plans" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "price" text NOT NULL,
  "period" text NOT NULL DEFAULT '/mês',
  "recommended" boolean NOT NULL DEFAULT false,
  "features" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "whatsapp_message" text NOT NULL DEFAULT '',
  "sort_order" integer NOT NULL DEFAULT 0,
  "active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- Estratégia de Conteúdo: Steps
CREATE TABLE IF NOT EXISTS "estrategia_steps" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "number" text NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "sort_order" integer NOT NULL DEFAULT 0,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- Seed: Plans
INSERT INTO "estrategia_plans" ("name", "price", "period", "recommended", "features", "whatsapp_message", "sort_order", "active")
VALUES
  (
    'Estratégia Digital',
    'R$ 997',
    '/mês',
    false,
    '["Gestão de 2 redes sociais (Instagram + 1)","12 posts/mês (feed + stories)","Calendário editorial mensal","Copywriting alinhado à marca","Relatório mensal de métricas","Suporte via WhatsApp"]',
    'Olá! Tenho interesse no plano *Estratégia Digital* de conteúdo. Gostaria de saber mais.',
    0,
    true
  ),
  (
    'Estratégia Premium',
    'R$ 2.497',
    '/mês',
    true,
    '["Tudo do plano Digital +","Gestão de até 4 redes sociais","24 posts/mês (feed + stories + reels)","Produção de 4 reels/mês","Planejamento de campanhas","Consultoria estratégica quinzenal","Gestão de tráfego pago (budget à parte)","Relatório semanal de performance"]',
    'Olá! Tenho interesse no plano *Estratégia Premium* de conteúdo. Gostaria de saber mais.',
    1,
    true
  );

-- Seed: Steps
INSERT INTO "estrategia_steps" ("number", "title", "description", "sort_order")
VALUES
  ('01', 'Conversa inicial', 'Entendemos sua marca e objetivos', 0),
  ('02', 'Planejamento', 'Criamos a estratégia e calendário', 1),
  ('03', 'Execução', 'Produzimos e publicamos o conteúdo', 2);
