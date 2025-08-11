import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

function useUniqueId(prefix = "wf-") {
  const [id] = useState(() => `${prefix}${Math.random().toString(36).slice(2, 9)}`);
  return id;
}

export default function WordFlip({
  words = ["fake", "AI-generated", "forged"],
  interval = 2800,
  animationDurationMs = 600,
  className = "",
  letterDelay = 0.02,
  measureSuffix = "",
}) {
  const id = useUniqueId();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const textRef = useRef(null);
  const wrapRef = useRef(null);
  const [minWidthPx, setMinWidthPx] = useState(0);

  const currentWord = useMemo(() => words[currentWordIndex] || "", [words, currentWordIndex]);

  // No width animation; we reserve enough width up-front via minWidthPx

  // Precompute max width so the hero line doesn't reflow when words switch
  useEffect(() => {
    if (!wrapRef.current || typeof window === "undefined") return;
    const span = document.createElement("span");
    const cs = window.getComputedStyle(wrapRef.current);
    span.style.position = "absolute";
    span.style.visibility = "hidden";
    span.style.whiteSpace = "nowrap";
    span.style.font = cs.font || `${cs.fontStyle} ${cs.fontVariant} ${cs.fontWeight} ${cs.fontSize} / ${cs.lineHeight} ${cs.fontFamily}`;
    wrapRef.current.appendChild(span);
    let maxW = 0;
    for (const w of words) {
      span.textContent = `${w}${measureSuffix}`;
      const wpx = span.scrollWidth;
      if (wpx > maxW) maxW = wpx;
    }
    wrapRef.current.removeChild(span);
    setMinWidthPx(maxW + 10); // small padding
  }, [words]);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(t);
  }, [interval, words.length]);

  return (
    <motion.span
      className={"inline-block align-baseline " + className}
      style={{ overflow: "hidden", whiteSpace: "nowrap", width: minWidthPx }}
      ref={wrapRef}
    >
      <motion.span
        ref={textRef}
        key={`${id}-${currentWord}`}
        transition={{ duration: animationDurationMs / 1000, ease: "easeInOut" }}
        className="inline-block"
      >
        {Array.from(currentWord).map((ch, i) => (
          <motion.span
            key={`${id}-c-${i}-${ch}`}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: i * letterDelay }}
            className="inline-block"
          >
            {ch}
          </motion.span>
        ))}
      </motion.span>
    </motion.span>
  );
}


