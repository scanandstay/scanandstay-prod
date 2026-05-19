-- ============================================================
-- ScanAndStay — Supabase schema
-- À exécuter dans l'éditeur SQL du Supabase Dashboard
-- ============================================================

-- ── Table orders ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  establishment_name  TEXT,
  owner_name          TEXT,
  client_email        TEXT,
  phone               TEXT,
  address             TEXT,
  offer               TEXT,
  languages           TEXT,
  total               INTEGER,
  deposit             INTEGER,
  balance             INTEGER,
  monthly_amount      INTEGER,
  qr_plates           INTEGER DEFAULT 0,
  local_research      BOOLEAN DEFAULT FALSE,
  activities_research BOOLEAN DEFAULT FALSE,
  billing_name        TEXT,
  billing_email       TEXT,
  billing_address     TEXT,
  billing_postal_city TEXT,
  billing_country     TEXT,
  billing_vat         TEXT,
  -- acompte_recu | en_creation | pret_a_livrer | livre | cloture
  status              TEXT NOT NULL DEFAULT 'acompte_recu',
  stripe_session_id   TEXT,
  deposit_paid_at     TIMESTAMPTZ,
  balance_paid_at     TIMESTAMPTZ,
  guide_url           TEXT
);

-- ── Table prospects ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prospects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  establishment_name TEXT NOT NULL,
  contact_name    TEXT,
  email           TEXT,
  phone           TEXT,
  -- site_web | booking | airbnb | instagram | autre
  source          TEXT DEFAULT 'autre',
  -- nouveau | contacte | en_discussion | converti | perdu
  status          TEXT NOT NULL DEFAULT 'nouveau',
  notes           TEXT,
  last_contact_at TIMESTAMPTZ
);

-- ── Désactiver RLS (simple pour usage admin privé) ────────────
-- Si vous souhaitez activer RLS, commentez ces lignes et
-- configurez des policies adaptées.
ALTER TABLE orders   DISABLE ROW LEVEL SECURITY;
ALTER TABLE prospects DISABLE ROW LEVEL SECURITY;

-- ── Index utiles ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS orders_status_idx   ON orders (status);
CREATE INDEX IF NOT EXISTS orders_email_idx    ON orders (client_email);
CREATE INDEX IF NOT EXISTS prospects_status_idx ON prospects (status);
