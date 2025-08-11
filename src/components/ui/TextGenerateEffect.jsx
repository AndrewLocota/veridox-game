import React, { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";

function classNames(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

export default function TextGenerateEffect({
  words,
  className,
  filter = true,
  duration = 0.5,
  delayStep = 0.06,
  id = "text-generate-effect",
}) {
  const [scope, animate] = useAnimate();
  const text = words || "";
  const tokens = text.split(/(\s+)/); // keep spaces as separate tokens

  useEffect(() => {
    // Animate characters in sequence for consistent reveal
    animate(
      ".textgen-char",
      { opacity: 1, filter: filter ? "blur(0px)" : "none" },
      { duration, delay: stagger(delayStep) }
    );
  }, [words]);

  return (
    <div className={classNames("text-generate-root", className)} id={id}>
      <motion.div
        ref={scope}
        className="text-generate-scope"
        id={`${id}-scope`}
        style={{ whiteSpace: "normal" }}
      >
        {tokens.map((token, tIdx) => {
          const isSpace = /\s+/.test(token);
          if (isSpace) {
            return (
              <span key={`sp-${tIdx}`} style={{ whiteSpace: "pre" }}>
                {token}
              </span>
            );
          }
          const chars = Array.from(token);
          const normalized = token.replace(/[^\w]/g, "").toLowerCase();
          const isFake = normalized === "fake";
          return (
            <span
              key={`w-${tIdx}`}
              className={isFake ? "fake-word" : undefined}
              style={{ display: "inline-block", whiteSpace: "nowrap" }}
            >
              {chars.map((ch, cIdx) => (
                <motion.span
                  key={`c-${tIdx}-${cIdx}-${ch}`}
                  className="textgen-char"
                  style={{
                    opacity: 0,
                    display: "inline-block",
                    filter: filter ? "blur(10px)" : "none",
                    willChange: "opacity, filter",
                  }}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}


