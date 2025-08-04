import { useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";

interface ShiftLocation {
  id: number;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export function useShiftLocations(shiftId: string) {
  const [locations, setLocations] = useState<ShiftLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shiftId) return;
    const fetchLocations = async () => {
      try {
        const res = await axiosInstance.get(`/api/shifts/${shiftId}/locations`);
        setLocations(res.data);
      } catch (err) {
        console.error("Failed to fetch shift locations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [shiftId]);

  return { locations, loading };
}
