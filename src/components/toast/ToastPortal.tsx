import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ToastStack, type Props as ToastStackProps } from "./ToastStack";

export const ToastPortal = (props: ToastStackProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <ToastStack {...props} />,
    document.body
  );
}; 