export interface UserProfile {
  id: string;
  email: string;
  name: string;
  company: string | null;
  credits: number;
  is_admin: boolean;
  gdpr_consent: boolean;
  gdpr_date: string | null;
}
