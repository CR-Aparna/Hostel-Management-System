import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";

export const useCounters = () => {
  const [counters, setCounters] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchCounters = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/notifications/dashboard/counters");
      setCounters(res.data);
    } catch (err) {
      console.error("Error fetching dashboard counters:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch automatically on mount
  useEffect(() => {
    fetchCounters();
  }, [fetchCounters]);

  // Return the data and the function (in case you want to refresh manually)
  return { counters, loading, refreshCounters: fetchCounters };
};