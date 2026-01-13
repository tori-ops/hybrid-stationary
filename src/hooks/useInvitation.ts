import { useEffect, useState } from 'react';
import { Invitation, getInvitationBySlug } from '@/lib/supabase';

export function useInvitation(slug: string | undefined) {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    async function fetchInvitation() {
      try {
        setLoading(true);
        if (!slug) {
          setError('No event slug provided');
          return;
        }
        const data = await getInvitationBySlug(slug);
        
        if (!data) {
          setError('Invitation not found');
          setInvitation(null);
        } else {
          setInvitation(data);
          setError(null);
        }
      } catch (err) {
        setError('Failed to load invitation');
        setInvitation(null);
      } finally {
        setLoading(false);
      }
    }

    fetchInvitation();
  }, [slug]);

  return { invitation, loading, error };
}
