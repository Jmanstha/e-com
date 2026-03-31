import { useLocation } from "react-router-dom";
import { useEffect } from "react";

// every component using the useLocation hook will be
// refreshed when the URL changes hence it is used as
// a trigger in the useEffect hook

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
