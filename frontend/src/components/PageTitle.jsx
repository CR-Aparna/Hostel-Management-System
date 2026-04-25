import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const formatTitle = (path) => {
  if (path === "/") return "Home";

  return path
    .split("/")                 // ["", "warden", "maintenance"]
    .filter(Boolean)            // ["warden", "maintenance"]
    .map(word =>
      word
        .replace(/-/g, " ")     // handle "room-details" → "room details"
        .replace(/\b\w/g, c => c.toUpperCase()) // capitalize
    )
    .join(" - ");               // "Warden - Maintenance"
};

const PageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const title = formatTitle(location.pathname);
    document.title = `${title} | Hostel Hub`;
  }, [location.pathname]);

  return null;
};

export default PageTitle;