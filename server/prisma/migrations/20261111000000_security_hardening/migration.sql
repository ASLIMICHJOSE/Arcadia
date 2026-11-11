-- Non-destructive security & performance hardening migration

-- Add tokenVersion column to "User" for immediate stateless JWT revocation on password reset / logout-all
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tokenVersion" INTEGER NOT NULL DEFAULT 0;

-- Composite indexes for rapid session / token revocation & expired row cleanup
CREATE INDEX IF NOT EXISTS "Session_userId_expiresAt_idx" ON "Session"("userId", "expiresAt");
CREATE INDEX IF NOT EXISTS "RefreshToken_userId_revoked_expiresAt_idx" ON "RefreshToken"("userId", "revoked", "expiresAt");

-- Automatic updatedAt maintenance function
CREATE OR REPLACE FUNCTION arcadia_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY['User', 'Account', 'Session', 'RefreshToken', 'PlayerProfile']
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', tbl || '_set_updated_at', tbl);
        EXECUTE format(
            'CREATE TRIGGER %I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION arcadia_set_updated_at()',
            tbl || '_set_updated_at',
            tbl
        );
    END LOOP;
END $$;

-- Lock down direct PostgREST access for Supabase anon / authenticated roles
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RefreshToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmailVerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PasswordResetToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PlayerProfile" ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY[
        'User',
        'Account',
        'Session',
        'RefreshToken',
        'EmailVerificationToken',
        'PasswordResetToken',
        'PlayerProfile'
    ]
    LOOP
        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
            EXECUTE format('REVOKE ALL ON TABLE %I FROM anon', tbl);
        END IF;
        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
            EXECUTE format('REVOKE ALL ON TABLE %I FROM authenticated', tbl);
        END IF;
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'deny_public_access_' || tbl, tbl);
        EXECUTE format(
            'CREATE POLICY %I ON %I AS RESTRICTIVE FOR ALL TO PUBLIC USING (false) WITH CHECK (false)',
            'deny_public_access_' || tbl,
            tbl
        );
    END LOOP;
END $$;

