-- ============================================================
-- ScanAndStay — Migration : nouvelles colonnes orders
-- À exécuter dans l'éditeur SQL du Supabase Dashboard
-- ============================================================

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS guide_started_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_email_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS delivered_at          TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS closed_at             TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_start_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS next_billing_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_status   TEXT DEFAULT 'pending';

-- Nouveau statut solde_en_attente (le champ status reste TEXT,
-- aucun ALTER de contrainte nécessaire)
-- Valeurs valides : acompte_recu | en_creation | pret_a_livrer
--                  solde_en_attente | livre | cloture

-- Index supplémentaire pour les clients actifs
CREATE INDEX IF NOT EXISTS orders_sub_status_idx ON orders (subscription_status);
