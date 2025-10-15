// src/products/vayu/components/ui/VideoModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** Parse a YouTube ID from common URL shapes */
function getYouTubeId(url = "") {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    if (u.pathname.startsWith("/embed/")) return u.pathname.split("/embed/")[1];
  } catch {
    // noop
  }
  // plain ID fallback
  return /^[\w-]{11}$/.test(url) ? url : null;
}

function lockScroll(lock, saved) {
  if (lock) {
    const y = window.scrollY;
    saved.current = y;
    document.body.style.top = `-${y}px`;
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
  } else {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    if (typeof saved.current === "number") {
      window.scrollTo(0, saved.current);
    }
  }
}

export default function VideoModal({
  open,
  onClose,
  src,          // YouTube URL/ID or .mp4 URL
  poster,       // optional poster for mp4
  offset = 0,   // not used here; kept for future (header offset)
}) {
  const youTubeId = getYouTubeId(src);
  const isYouTube = Boolean(youTubeId);
  const savedScroll = useRef(0);
  const containerRef = useRef(null);
  const ytDivRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const [ytReady, setYtReady] = useState(false);

  // Lock background scroll while open
  useEffect(() => {
    if (open) lockScroll(true, savedScroll);
    return () => lockScroll(false, savedScroll);
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Initialize YouTube IFrame API when needed
  useEffect(() => {
    if (!open || !isYouTube) return;

    function makePlayer() {
      if (!window.YT || !window.YT.Player) return;
      setYtReady(true);
      ytPlayerRef.current = new window.YT.Player(ytDivRef.current, {
        videoId: youTubeId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            try { e.target.playVideo(); } catch {}
          },
          onStateChange: (e) => {
            // 0 = ended
            if (e.data === window.YT.PlayerState.ENDED) onClose?.();
          },
        },
      });
    }

    // Load API once
    if (!window.YT || !window.YT.Player) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev && prev();
        makePlayer();
      };
    } else {
      makePlayer();
    }

    return () => {
      try {
        ytPlayerRef.current?.destroy?.();
      } catch {}
      ytPlayerRef.current = null;
      setYtReady(false);
    };
  }, [open, isYouTube, youTubeId, onClose]);

  // Close when clicking backdrop (but not when clicking inside video box)
  const onBackdropClick = (e) => {
    if (!containerRef.current) return;
    if (e.target === containerRef.current) onClose?.();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onBackdropClick}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="relative w-full max-w-5xl aspect-video rounded-2xl bg-black shadow-xl overflow-hidden"
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              aria-label="Close video"
              className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-black/60 text-white hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={onClose}
            >
              ×
            </button>

            {/* YouTube or MP4 */}
            {isYouTube ? (
              <div className="w-full h-full">
                {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
                <div ref={ytDivRef} className="w-full h-full" />
                {!ytReady && (
                  <div className="absolute inset-0 flex items-center justify-center text-white/80 text-sm">
                    Loading…
                  </div>
                )}
              </div>
            ) : (
              <video
                src={src}
                poster={poster}
                className="w-full h-full object-contain bg-black"
                controls
                autoPlay
                playsInline
                onEnded={onClose}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
