import { useEffect, useMemo, useState } from "react";

const HOURS = { open: 11, close: 21 } as const;

export const useRestaurantHours = () => {
  const [now, setNow] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
  const isOpen = useMemo(() => {
    const h = now.getHours();
    return h >= HOURS.open && h < HOURS.close;
  }, [now]);
  
  return { isOpen, now };
};