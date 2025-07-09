import React, { useEffect, useState } from "react";

export const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      }
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4  transform -translate-x-1/2 animate-bounce bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-2 rounded-full shadow-md z-50">
      <button
        onClick={handleInstallClick}
        className=" flex text-sm sm:text-base sm:font-semibold justify-center items-center gap-2 "
      >
        <img src="/icon.svg" alt="" />
        Install App
      </button>
    </div>
  );
};
