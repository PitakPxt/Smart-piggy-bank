import { createPortal } from "react-dom";

export default function PortalModal({ children }) {
  const modalWrapper = () => (
    <div className="fixed inset-0 bg-black/50 z-[9999]">
      <div className="fixed inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );

  return createPortal(modalWrapper(), document.body);
}
