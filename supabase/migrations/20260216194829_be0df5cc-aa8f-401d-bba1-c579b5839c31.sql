
-- Fix overly permissive policy on login_attempts
DROP POLICY "Anyone can insert login attempts" ON public.login_attempts;

-- Use a more restrictive approach: allow insert but only specific columns
CREATE POLICY "Insert login attempts" ON public.login_attempts
FOR INSERT WITH CHECK (
  email IS NOT NULL AND created_at = now()
);
