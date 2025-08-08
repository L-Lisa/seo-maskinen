-- Drop ALL existing policies to fix recursion
DROP POLICY IF EXISTS "Admin can read all profiles" ON public.users;
DROP POLICY IF EXISTS "Admin can update all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admin can read all analyses" ON public.analyses;
DROP POLICY IF EXISTS "Users can read own analyses" ON public.analyses;
DROP POLICY IF EXISTS "Users can insert own analyses" ON public.analyses;
DROP POLICY IF EXISTS "Users can update own analyses" ON public.analyses;

-- Recreate policies without recursion
-- Users can read their own profile (simple check)
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (simple check)
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Users can read their own analyses (simple check)
CREATE POLICY "Users can read own analyses" ON public.analyses
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own analyses (simple check)
CREATE POLICY "Users can insert own analyses" ON public.analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own analyses (simple check)
CREATE POLICY "Users can update own analyses" ON public.analyses
  FOR UPDATE USING (auth.uid() = user_id);

-- Note: Admin policies removed to avoid recursion
-- Admins can use service role key for admin operations
