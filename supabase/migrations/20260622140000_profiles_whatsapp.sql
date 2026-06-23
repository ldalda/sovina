-- Captura de WhatsApp + opt-in (pré-feature do fast-follow nº1 "O Sovina no seu
-- WhatsApp"). Constrói a lista de interessados e valida demanda antes da feature
-- existir. Consentimento explícito (LGPD) registrado com timestamp.
--
-- whatsapp          : número informado (E.164/dígitos). NULL = não optou.
-- whatsapp_optin_at : quando o usuário consentiu (prova de consentimento).
-- profiles já tem RLS own-profile (auth.uid() = id), então a escrita é segura.

alter table public.profiles
  add column if not exists whatsapp text,
  add column if not exists whatsapp_optin_at timestamptz;

comment on column public.profiles.whatsapp is
  'Número de WhatsApp para o fast-follow de cobrança ativa. NULL = sem opt-in.';
comment on column public.profiles.whatsapp_optin_at is
  'Timestamp do consentimento explícito (LGPD) para contato via WhatsApp.';
