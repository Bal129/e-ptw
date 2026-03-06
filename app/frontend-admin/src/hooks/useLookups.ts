import { useEffect, useState, useCallback } from 'react';
import { 
  fetchPermitTypes, 
  fetchLocations, 
  fetchUsers, 
  fetchSafetyEquipment
} from '../../../shared/services/api';

export function useLookups() {
  const [permitTypes, setPermitTypes] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [safetyEquipment, setSafetyEquipment] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const [typesData, locsData, usersData, safetyData] = await Promise.all([
          fetchPermitTypes(),
          fetchLocations(),
          fetchUsers(),
          fetchSafetyEquipment()
        ]);

        if (!mounted) return;

        setPermitTypes(typesData);
        setLocations(locsData);
        setSafetyEquipment(safetyData);
        setUsers(Array.isArray(usersData) ? usersData : (usersData.results || []));
      } catch (err: any) {
        if (!mounted) return;
        setError(err.message || 'Failed to load lookup data');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [refreshKey]);

  return { 
    permitTypes, locations, users, safetyEquipment,
    loading, error, refetch 
  };
}