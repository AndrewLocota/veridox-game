import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./App.css";
import { playTickSound } from "./utils/sounds";
import { documentDataset, userAnalytics } from "./data/documents";
import TextGenerateEffect from "./components/ui/TextGenerateEffect";
import WordFlip from "./components/ui/WordFlip";
import linkedinIcon from "./components/images/icon/linkedin-white.svg";
import gmailIcon from "./components/images/icon/gmail.svg";
import githubIcon from "./components/images/icon/github.svg";
import liveLinkIcon from "./components/images/icon/live-link.svg";

// Separate Magnifier component that renders as a portal
const Magnifier = ({
  visible,
  cursorX,
  cursorY,
  imageUrl,
  zoomFactor,
  bgPosition,
}) => {
  if (!visible) return null;

  return createPortal(
    <>
      {/* Lines that extend from cursor to screen edges */}
      <div
        className={`crosshair-lines ${visible ? "visible" : ""}`}
        style={{
          "--cursor-x": `${cursorX}px`,
          "--cursor-y": `${cursorY}px`,
        }}
      >
        <div className="line-vertical-top"></div>
        <div className="line-vertical-bottom"></div>
        <div className="line-horizontal-left"></div>
        <div className="line-horizontal-right"></div>
      </div>

      {/* Magnifying glass */}
      <div
        className={`magnifier-portal ${visible ? "visible" : ""}`}
        style={{
          left: `${cursorX}px`,
          top: `${cursorY}px`,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: bgPosition.backgroundSize,
          backgroundPosition: bgPosition.backgroundPosition,
        }}
      />
    </>,
    document.body
  );
};

function App() {
  const [gameState, setGameState] = useState("countdown"); // countdown, game
  const [countdown, setCountdown] = useState(5.0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [auroraActive, setAuroraActive] = useState(false);

  // Scroll snap + confirm-to-scroll state
  const scrollRootRef = useRef(null);
  const hintTimerRef = useRef(null);
  const lastWheelTimeRef = useRef(0);
  const [scrollConfirmStep, setScrollConfirmStep] = useState(0); // 0=idle, 1=step1, 2=step2
  const [showScrollHint, setShowScrollHint] = useState(false);
  const parallaxRef = useRef(null);
  const rafRef = useRef(0);

  // Handle countdown
  useEffect(() => {
    let count = 5.0;

    // Tick sound timer (every second)
    const tickTimer = setInterval(() => {
      if (count > 0 && count <= 5) {
        playTickSound();
      }
    }, 1000);

    // Decimal countdown timer (every 100ms)
    const countdownTimer = setInterval(() => {
      count -= 0.1;
      setCountdown(Math.max(0, parseFloat(count.toFixed(1))));

      if (count <= 0.1) {
        clearInterval(countdownTimer);
        clearInterval(tickTimer);
        // Start transition first so CSS no longer hides aurora, then activate on next frame
        setIsTransitioning(true);
        requestAnimationFrame(() => {
          setAuroraActive(true);
        });
        // Start transition animation
        setTimeout(() => {
          setGameState("game");
          setIsTransitioning(false);
        }, 800); // Wait for fly-out animation to complete
      }
    }, 100);

    return () => {
      clearInterval(countdownTimer);
      clearInterval(tickTimer);
    };
  }, []);

  // Confirm-to-scroll: gated two-step gesture (disabled during countdown)
  useEffect(() => {
    const el = scrollRootRef.current;
    if (!el) return;

    const resetHintLater = (ms = 1400) => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      hintTimerRef.current = setTimeout(() => {
        setShowScrollHint(false);
        setScrollConfirmStep(0);
      }, ms);
    };

    const onWheel = (e) => {
      // Only handle gating when attempting to scroll down from the very top
      if (e.deltaY <= 0) return;

      // Block leaving the top while loading/countdown
      if (gameState !== "game") {
        e.preventDefault();
        return;
      }

      const atTop = el.scrollTop <= 2;
      if (!atTop) return; // normal scrolling further down is allowed

      // Debounce to require distinct gestures between steps
      const now = Date.now();
      if (now - lastWheelTimeRef.current < 350) {
        e.preventDefault();
        return;
      }
      lastWheelTimeRef.current = now;

      e.preventDefault();
      if (scrollConfirmStep === 0) {
        setShowScrollHint(true);
        setScrollConfirmStep(1);
        resetHintLater();
        return;
      }
      if (scrollConfirmStep === 1) {
        setShowScrollHint(true);
        setScrollConfirmStep(2);
        resetHintLater();
        return;
      }
      // Step 2 reached → allow scrolling to next section
      setShowScrollHint(false);
      setScrollConfirmStep(0);
      el.scrollTo({ top: window.innerHeight + 2, behavior: "smooth" });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, [scrollConfirmStep, gameState]);

  // Parallax background: move a soft gradient slightly with scroll
  useEffect(() => {
    const el = scrollRootRef.current;
    const layer = parallaxRef.current;
    if (!el || !layer) return;

    const onScroll = () => {
      const y = el.scrollTop || 0;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const translate = Math.round(y * -0.08); // slow, upward drift
        layer.style.transform = `translateY(${translate}px)`;
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="App" id="app-root">
      {/* Background handled by body (fixed), no DOM layers needed */}
      <div className="header-cta" id="header-cta">
        <button
          type="button"
          className="login-btn"
          id="login-btn"
          onClick={() => {
            // Placeholder login action; replace with real route when available
            console.log("Login clicked");
          }}
        >
          Login
        </button>
        <button
          type="button"
          className="book-demo-btn"
          onClick={() =>
            window.open(
              "https://veridox.ai/book-a-demo",
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          Book a demo
        </button>
      </div>

      {/* Base white background (single background), stays under aurora */}
      <div className="base-white" id="base-white"></div>

      {/* Global bottom-half aurora overlay (fixed, behind content) */}
      <div
        className={`aurora-global ${auroraActive ? "active" : ""}`}
        id="aurora-global"
      >
        <div className="aurora__item" id="aurora-global-item-1"></div>
        <div className="aurora__item" id="aurora-global-item-2"></div>
        <div className="aurora__item" id="aurora-global-item-3"></div>
        <div className="aurora__item" id="aurora-global-item-4"></div>
        <div className="aurora__item" id="aurora-global-item-5"></div>
      </div>

      {/* Scrollable root with snap sections */}
      <div className="scroll-root" id="scroll-root" ref={scrollRootRef}>
        <div className="snap-section" id="section-game">
          {gameState === "countdown" && (
            <CountdownScreen
              count={countdown}
              isTransitioning={isTransitioning}
            />
          )}
          {gameState === "game" && <GameScreen />}

          {showScrollHint && (
            <div className="down-scroll-hint" id="scroll-hint">
              <span className="arrow" aria-hidden>
                ▼
              </span>
              <span className="txt">
                {scrollConfirmStep === 1
                  ? "Scroll again to continue"
                  : scrollConfirmStep === 2
                  ? "Almost there — scroll once more"
                  : "Scroll to continue"}
              </span>
            </div>
          )}
        </div>

        {/* Next section with a continuous purple background */}
        <div
          className="snap-section next-section"
          id="section-next"
          style={{ background: "transparent" }}
        >
          <div className="next-content" id="next-content">
            <h2>More from Veridox</h2>
            <p>Seamless continuation below the game screen.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const CountdownScreen = ({ count, isTransitioning }) => {
  const getCountdownText = () =>
    count >= 2.5 ? "Are you smarter than AI?" : "Can you spot a fake document?";

  return (
    <div
      className={`screen countdown-screen ${
        isTransitioning ? "transitioning" : ""
      }`}
      id="countdown-screen"
    >
      <div className="veridox-logo" id="logo-countdown">
        <img
          src={process.env.PUBLIC_URL + "/images/veridox-logo.png"}
          alt="Veridox"
        />
      </div>
      <div className="countdown-content" id="countdown-content">
        <div
          className={`countdown-text-container ${
            isTransitioning ? "fly-out-left" : ""
          }`}
          id="countdown-text-container"
        >
          <div className="countdown-text" id="countdown-text">
            <TextGenerateEffect
              words={getCountdownText()}
              className="countdown-textgen"
            />
          </div>
        </div>
        <div
          className={`countdown-number-container ${
            isTransitioning ? "fly-out-right" : ""
          }`}
          id="countdown-number-container"
        >
          <div className="countdown-number" id="countdown-number">
            {count.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Position queue card (replaces learning card)
const PositionQueue = ({ position, totalPlayers, delta }) => {
  const progressPct = Math.max(
    0,
    Math.min(100, (position / Math.max(1, totalPlayers)) * 100)
  );
  return (
    <div className="position-queue-card" id="position-queue-card">
      <p className="pq-rank" id="pq-rank">
        You're <span className="pq-strong">{position}</span>/{totalPlayers}
      </p>
      <div className="pq-progress-row" id="pq-progress-row">
        <div className="pq-progress" id="pq-progress">
          <div
            className="pq-progress-fill"
            id="pq-progress-fill"
            style={{ width: `${progressPct.toFixed(2)}%` }}
          />
        </div>
        {delta != null && (
          <div className="pq-delta" id="pq-delta">
            {delta}
          </div>
        )}
      </div>
      <div className="pq-meta" id="pq-meta">
        <svg
          className="pq-star"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <p>
          Next cohort unlocks in <span className="pq-strong">5 days</span> for
          top
          <span className="pq-strong"> 1000 places</span>
        </p>
      </div>
      <div className="pq-share" id="pq-share">
        <div className="pq-share-icons">
          <a href="#" className="pq-share-icon" aria-label="LinkedIn">
            <img src={linkedinIcon} alt="LinkedIn" />
          </a>
          <a href="#" className="pq-share-icon" aria-label="GitHub">
            <img src={githubIcon} alt="GitHub" />
          </a>
        </div>
        <p className="pq-share-caption">
          Share to jump <span className="pq-strong">100 places</span>
        </p>
      </div>
    </div>
  );
};

const GameScreen = () => {
  const [score, setScore] = useState(0);
  const [guessCount, setGuessCount] = useState(0);
  const [currentDocument, setCurrentDocument] = useState(0); // Changed to 0-based indexing
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [showEducationalFeedback, setShowEducationalFeedback] = useState(false);
  const [lastAnswer, setLastAnswer] = useState(null);
  const [randomizedDocuments, setRandomizedDocuments] = useState([]);
  const [magnifierState, setMagnifierState] = useState({
    visible: false,
    cursorX: 0,
    cursorY: 0,
    imageUrl: "",
    bgPosition: { backgroundSize: "", backgroundPosition: "" },
  });
  const TOTAL_TIME = 10.0;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const AUTO_ADVANCE_TIME = 3.5;
  const [autoAdvanceLeft, setAutoAdvanceLeft] = useState(0);
  const [isHoveringFeedback, setIsHoveringFeedback] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [barOvershoot, setBarOvershoot] = useState(false);
  const thinkingTimerRef = useRef(null);
  const feedbackTimerRef = useRef(null);

  // Position queue: initialize to mid-pack and move up 50 places per correct
  const TOTAL_PLAYERS = 49747;
  const [position, setPosition] = useState(23085);
  const [pendingPositionDelta, setPendingPositionDelta] = useState(0);
  const [startPosition, setStartPosition] = useState(null);
  const [deltaShown, setDeltaShown] = useState(null);
  const [queuePulse, setQueuePulse] = useState(false);
  const [showCorrectToast, setShowCorrectToast] = useState(false);
  const [toastTruth, setToastTruth] = useState("fake");
  // Signup modal state
  const [showSignup, setShowSignup] = useState(false);
  const [signupMinimize, setSignupMinimize] = useState(false);
  const [nextSignupAt, setNextSignupAt] = useState(3);
  const [emailInput, setEmailInput] = useState("");
  const [signupSubmitting, setSignupSubmitting] = useState(false);

  // Bottom ticker messages (always visible)
  const TICKER_MESSAGES = [
    "🎉 User1213 has just guessed 10 right answers in a row!",
    "✨ Current record, 127 correct guesses in a row. Can you beat it?",
  ];
  const MARQUEE_DURATION_MS = 8000; // faster cycling
  const [tickerIdx, setTickerIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIdx((i) => (i + 1) % TICKER_MESSAGES.length);
    }, MARQUEE_DURATION_MS);
    return () => clearInterval(interval);
  }, []);

  // Open signup after every 3 guesses
  useEffect(() => {
    if (isSliding) return;
    if (!showSignup && guessCount >= nextSignupAt) {
      setShowSignup(true);
      setSignupMinimize(false);
    }
  }, [guessCount, nextSignupAt, showSignup, isSliding]);

  const closeSignup = () => {
    setSignupMinimize(true);
    setTimeout(() => {
      setShowSignup(false);
      setSignupMinimize(false);
      setSignupSubmitting(false);
      setEmailInput("");
      setNextSignupAt(guessCount + 3);
    }, 260);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (signupSubmitting) return;
    setSignupSubmitting(true);
    setTimeout(() => {
      closeSignup();
    }, 900);
  };

  // Click-away anywhere to close
  useEffect(() => {
    if (!showSignup) return;
    const onDocClick = (e) => {
      if (e.target.closest && e.target.closest(".signup-card")) return;
      closeSignup();
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [showSignup]);

  // Initialize randomized document order - always start with fake
  useEffect(() => {
    const fakeDocuments = documentDataset.filter((doc) => !doc.isReal);
    const realDocuments = documentDataset.filter((doc) => doc.isReal);

    // Start with a random fake document
    const startingFake =
      fakeDocuments[Math.floor(Math.random() * fakeDocuments.length)];

    // Randomize the remaining documents
    const remainingDocs = documentDataset.filter(
      (doc) => doc.id !== startingFake.id
    );
    const shuffledRemaining = remainingDocs.sort(() => Math.random() - 0.5);

    // Combine: fake first, then random order
    const orderedDocuments = [startingFake, ...shuffledRemaining];
    setRandomizedDocuments(orderedDocuments);
  }, []);

  // Use randomized dataset with safety check
  const currentDoc =
    randomizedDocuments.length > 0
      ? randomizedDocuments[currentDocument % randomizedDocuments.length]
      : null;

  // Thinking timer (counts down only during the guessing phase)
  useEffect(() => {
    if (!currentDoc) return;

    // Reset when new doc shows
    setTimeLeft(TOTAL_TIME);
    // brief overshoot so purple appears to reset to 110% before counting down
    setBarOvershoot(true);
    const overshootTimer = setTimeout(() => setBarOvershoot(false), 160);
    if (thinkingTimerRef.current) {
      clearInterval(thinkingTimerRef.current);
      thinkingTimerRef.current = null;
    }

    if (!showEducationalFeedback) {
      thinkingTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const next = +(prev - 0.05).toFixed(2); // smoother 50ms steps
          if (next <= 0) {
            if (thinkingTimerRef.current) {
              clearInterval(thinkingTimerRef.current);
              thinkingTimerRef.current = null;
            }
            // Time out – show feedback, then start auto-advance timer (but do not advance immediately)
            if (!isOnCooldown) {
              setIsOnCooldown(true);
              setLastAnswer({
                userChoice: null,
                document: currentDoc,
                isCorrect: false,
                timedOut: true,
              });
              setShowEducationalFeedback(true);
              setAutoAdvanceLeft(AUTO_ADVANCE_TIME);
              // Keep cooldown TRUE during feedback so user cannot guess again
            }
            return 0;
          }
          return next;
        });
      }, 50);
    }

    return () => {
      if (thinkingTimerRef.current) {
        clearInterval(thinkingTimerRef.current);
        thinkingTimerRef.current = null;
      }
      clearTimeout(overshootTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDocument, showEducationalFeedback, currentDoc]);

  // Feedback auto-advance timer (runs only when feedback shown and not hovered)
  useEffect(() => {
    // Only run when feedback is visible and not during slide animation
    if (!showEducationalFeedback || isSliding) return;
    setAutoAdvanceLeft(AUTO_ADVANCE_TIME);
    if (feedbackTimerRef.current) {
      clearInterval(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
    feedbackTimerRef.current = setInterval(() => {
      if (isHoveringFeedback) return; // pause while hovering feedback
      setAutoAdvanceLeft((prev) => {
        const next = +(prev - 0.05).toFixed(2);
        if (next <= 0) {
          if (feedbackTimerRef.current) {
            clearInterval(feedbackTimerRef.current);
            feedbackTimerRef.current = null;
          }
          // Always proceed to next with swipe when feedback timer ends
          handleContinue();
          return 0;
        }
        return next;
      });
    }, 50);

    return () => {
      if (feedbackTimerRef.current) {
        clearInterval(feedbackTimerRef.current);
        feedbackTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showEducationalFeedback, isHoveringFeedback, currentDocument, isSliding]);

  useEffect(() => {
    if (showEducationalFeedback && startPosition == null) {
      setStartPosition(position);
    }
  }, [showEducationalFeedback, startPosition, position]);

  // Swipe gesture: left = fake, right = real
  useEffect(() => {
    const container = document.querySelector(".document-container");
    if (!container) return;

    let startX = 0;
    let startY = 0;
    let active = false;

    const onStart = (e) => {
      active = true;
      const p = "touches" in e ? e.touches[0] : e;
      startX = p.clientX;
      startY = p.clientY;
    };
    const onMove = (e) => {
      if (!active) return;
    };
    const onEnd = (e) => {
      if (!active) return;
      active = false;
      const p = "changedTouches" in e ? e.changedTouches[0] : e;
      const dx = p.clientX - startX;
      const dy = p.clientY - startY;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
        // choose by swipe; real => right, fake => left
        if (dx > 0) handleAnswer(true);
        else handleAnswer(false);
      }
    };

    container.addEventListener("mousedown", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    container.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });

    return () => {
      container.removeEventListener("mousedown", onStart);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      container.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [currentDoc, isOnCooldown]);

  const handleAnswer = (isReal) => {
    // Prevent spamming with cooldown or if no document loaded yet
    if (isOnCooldown || !currentDoc) return;

    setIsOnCooldown(true);
    setGuessCount((c) => c + 1);
    const isCorrect = isReal === currentDoc.isReal;
    const primaryWrapper = document.querySelector(".document-wrapper.primary");
    const shadowWrapper = document.querySelector(
      ".document-wrapper.shadow-only"
    );

    // Store the answer for educational feedback
    setLastAnswer({ userChoice: isReal, document: currentDoc, isCorrect });

    // Log wrong answers for analytics
    if (!isCorrect) {
      userAnalytics.logWrongAnswer(currentDoc.id, isReal);
    }

    if (isCorrect) {
      setScore(score + 1);
      // Immediate position update: move up 50 places
      setPosition((prev) => Math.max(1, prev - 50));
      setDeltaShown(-50);
      setTimeout(() => setDeltaShown(null), 900);
      // pulse the queue card
      setQueuePulse(true);
      setTimeout(() => setQueuePulse(false), 600);
      // show toast over image
      setToastTruth(currentDoc?.isReal ? "real" : "fake");
      setShowCorrectToast(true);
      setTimeout(() => setShowCorrectToast(false), 1200);

      // Add confetti effect to button
      const buttonClass = isReal ? ".arrow-button.right" : ".arrow-button.left";
      const button = document.querySelector(buttonClass);
      if (button) {
        button.classList.add("correct");
        setTimeout(() => {
          button.classList.remove("correct");
        }, 600);
      }

      // Show tick mark and green glow for correct answer
      if (primaryWrapper) {
        primaryWrapper.classList.add("show-tick", "glow-green", "jump-correct");
      }
    } else {
      // Show shake animation and red glow for wrong answer
      if (primaryWrapper) {
        primaryWrapper.classList.add("shake-wrong", "glow-red");
      }
    }

    // After 500ms of feedback, continue to the next document
    setTimeout(() => {
      if (primaryWrapper) {
        // Remove feedback classes including glow effects
        primaryWrapper.classList.remove(
          "show-tick",
          "shake-wrong",
          "glow-green",
          "glow-red",
          "jump-correct"
        );
      }
      if (shadowWrapper) {
        shadowWrapper.classList.remove("slide-left", "slide-right");
      }
      handleContinue();
    }, 500);
  };

  const handleContinue = () => {
    if (isSliding) return; // prevent stacking

    const primaryWrapper = document.querySelector(".document-wrapper.primary");
    const shadowWrapper = document.querySelector(
      ".document-wrapper.shadow-only"
    );
    const docIsReal =
      (lastAnswer?.document?.isReal ?? currentDoc?.isReal) === true;

    // Direction based on truth: real -> right, fake -> left
    const directionClass = docIsReal ? "slide-right" : "slide-left";

    // Add slide animation
    if (primaryWrapper) {
      setIsSliding(true);
      // stop feedback timer immediately
      if (feedbackTimerRef.current) {
        clearInterval(feedbackTimerRef.current);
        feedbackTimerRef.current = null;
      }
      // Preload next image to avoid flash when swapping
      const nextIdx = (currentDocument + 1) % (randomizedDocuments.length || 1);
      const nextDoc = randomizedDocuments[nextIdx];
      if (nextDoc?.image) {
        const pre = new Image();
        pre.src = nextDoc.image;
      }
      // Keep cooldown during swipe
      // Clear any inline transform from tilt so CSS animation can take control
      primaryWrapper.style.transform = "";
      if (shadowWrapper) shadowWrapper.style.transform = "";
      // Ensure fresh animation: remove classes, force reflow, then add
      primaryWrapper.classList.remove("slide-left", "slide-right");
      if (shadowWrapper)
        shadowWrapper.classList.remove("slide-left", "slide-right");
      void primaryWrapper.offsetWidth; // force reflow
      primaryWrapper.classList.add(directionClass);
      if (shadowWrapper) shadowWrapper.classList.add(directionClass);

      // Disable any interaction while sliding
      setIsOnCooldown(true);

      // Advance when animation actually ends
      const onEnd = () => {
        primaryWrapper.removeEventListener("animationend", onEnd);
        // Change document only after slide animation fully completes
        setCurrentDocument((idx) => idx + 1);

        // Clean up slide classes
        primaryWrapper.classList.remove("slide-left", "slide-right");
        if (shadowWrapper)
          shadowWrapper.classList.remove("slide-left", "slide-right");

        // Reset cooldown after the slide completes
        setIsOnCooldown(false);
        setLastAnswer(null);
        setIsSliding(false);

        setShowEducationalFeedback(false);
      };
      primaryWrapper.addEventListener("animationend", onEnd, { once: true });
    }
  };

  // Add keyboard support
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (isOnCooldown || !currentDoc) return; // Prevent key presses during cooldown or when no doc

      if (event.key === "ArrowLeft") {
        handleAnswer(false); // Forged
      } else if (event.key === "ArrowRight") {
        handleAnswer(true); // Real
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isOnCooldown, currentDoc, currentDocument, score]); // Updated dependencies

  // Add cursor tilt effect
  useEffect(() => {
    const handleMouseMove = (event) => {
      const container = document.querySelector(".document-container");
      if (!container) return;

      const primaryWrapper = document.querySelector(
        ".document-wrapper.primary"
      );
      const shadowWrapper = document.querySelector(
        ".document-wrapper.shadow-only"
      );
      if (!primaryWrapper) return;
      // Disable tilt only while sliding to next doc
      if (isSliding) {
        if (primaryWrapper.style.transform) primaryWrapper.style.transform = "";
        if (shadowWrapper && shadowWrapper.style.transform)
          shadowWrapper.style.transform = "";
        return;
      }

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate cursor position relative to center
      const deltaX = (event.clientX - centerX) / (rect.width / 2);
      const deltaY = (event.clientY - centerY) / (rect.height / 2);

      // Apply tilt with reduced range for more subtle effect (inverted to tilt toward cursor)
      const tiltX = Math.max(-8, Math.min(8, deltaY * -4)); // Tilt around X-axis (up/down, inverted)
      const tiltY = Math.max(-8, Math.min(8, deltaX * 4)); // Tilt around Y-axis (left/right)

      const transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      primaryWrapper.style.transform = transform;
      if (shadowWrapper) {
        shadowWrapper.style.transform = `${transform} translateY(10px) scale(1.02)`;
      }
    };

    // Track mouse movement on entire window
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [currentDocument, isSliding]); // Re-attach when state changes

  // Add magnifier effect
  useEffect(() => {
    const handleMagnifier = (event) => {
      const container = document.querySelector(".document-container");
      const image = document.querySelector(".document-image");
      const primaryWrapper = document.querySelector(
        ".document-wrapper.primary"
      );

      if (!container || !image || !primaryWrapper || !currentDoc) return;

      // Suppress magnifier while hovering action buttons or signup modal
      const target = event.target;
      if (
        target &&
        target.closest &&
        (target.closest(".action-row") ||
          target.closest(".arrow-button") ||
          target.closest(".signup-card") ||
          target.closest("#signup-overlay") ||
          target.closest(".signup-backdrop"))
      ) {
        primaryWrapper.classList.remove("magnifier-active");
        setMagnifierState((prev) => ({ ...prev, visible: false }));
        return;
      }

      const rect = container.getBoundingClientRect();
      const imageRect = image.getBoundingClientRect();

      // Get cursor position relative to the container
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Check if cursor is over the image
      if (
        x >= imageRect.left - rect.left &&
        x <= imageRect.right - rect.left &&
        y >= imageRect.top - rect.top &&
        y <= imageRect.bottom - rect.top
      ) {
        // Add magnifier-active class to hide cursor
        primaryWrapper.classList.add("magnifier-active");

        // Calculate zoom
        const zoomFactor = 2;
        const relativeX = (event.clientX - imageRect.left) / imageRect.width;
        const relativeY = (event.clientY - imageRect.top) / imageRect.height;
        const bgX = relativeX * 100;
        const bgY = relativeY * 100;

        setMagnifierState({
          visible: true,
          cursorX: event.clientX,
          cursorY: event.clientY,
          imageUrl: currentDoc.image,
          bgPosition: {
            backgroundSize: `${imageRect.width * zoomFactor}px ${
              imageRect.height * zoomFactor
            }px`,
            backgroundPosition: `${bgX}% ${bgY}%`,
          },
        });
      } else {
        // Remove magnifier-active class to show cursor
        primaryWrapper.classList.remove("magnifier-active");
        setMagnifierState((prev) => ({ ...prev, visible: false }));
      }
    };

    const handleMouseLeave = () => {
      const primaryWrapper = document.querySelector(
        ".document-wrapper.primary"
      );
      if (primaryWrapper) {
        primaryWrapper.classList.remove("magnifier-active");
      }
      setMagnifierState((prev) => ({ ...prev, visible: false }));
    };

    const container = document.querySelector(".document-container");
    if (container && currentDoc) {
      container.addEventListener("mousemove", handleMagnifier);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMagnifier);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [currentDoc?.image]); // Use optional chaining

  // Pause/resume timer when hovering feedback area (right panel)
  useEffect(() => {
    const feedback = document.querySelector(".learning-card");
    if (!feedback) return;
    const enter = () => setIsHoveringFeedback(true);
    const leave = () => setIsHoveringFeedback(false);
    feedback.addEventListener("mouseenter", enter);
    feedback.addEventListener("mouseleave", leave);
    return () => {
      feedback.removeEventListener("mouseenter", enter);
      feedback.removeEventListener("mouseleave", leave);
    };
  }, [showEducationalFeedback]);

  // Compute angle for circular timer depending on phase
  const timerProgress = showEducationalFeedback
    ? autoAdvanceLeft / AUTO_ADVANCE_TIME
    : timeLeft / TOTAL_TIME;

  // Pop-in effect for new document content
  useEffect(() => {
    const wrapper = document.querySelector(".document-wrapper");
    const img = document.querySelector(".document-wrapper .document-image");
    if (!wrapper || !img) return;

    const showNew = () => {
      wrapper.classList.add("pop-in");
      const onAnimEnd = () => {
        wrapper.classList.remove("pop-in");
      };
      img.addEventListener("animationend", onAnimEnd, { once: true });
    };

    // Prefer decode() to guarantee pixel-ready before revealing
    if (typeof img.decode === "function") {
      img
        .decode()
        .then(() => showNew())
        .catch(() => {
          if (img.complete) showNew();
          else img.addEventListener("load", showNew, { once: true });
        });
    } else {
      if (img.complete) showNew();
      else img.addEventListener("load", showNew, { once: true });
    }

    return () => {
      wrapper.classList.remove("pop-in");
      img.removeEventListener("load", showNew);
    };
  }, [currentDocument]);

  return (
    <>
      <Magnifier
        visible={magnifierState.visible}
        cursorX={magnifierState.cursorX}
        cursorY={magnifierState.cursorY}
        imageUrl={magnifierState.imageUrl}
        zoomFactor={2}
        bgPosition={magnifierState.bgPosition}
      />
      <div className="veridox-logo" id="logo-game">
        <img
          src={process.env.PUBLIC_URL + "/images/veridox-logo.png"}
          alt="Veridox"
        />
      </div>
      <div className="screen game-screen" id="game-screen">
        <div
          className={`game-grid ${
            showEducationalFeedback ? "showing-feedback" : ""
          }`}
          id="game-grid"
        >
          {/* Row 1, Col 1: Time remaining bar (left) */}
          <div className="time-remaining" id="time-remaining">
            <span className="time-label">Time remaining</span>
            <div
              className={`time-bar ${
                showEducationalFeedback ? "" : "bar-resetting"
              }`}
              id="time-bar"
            >
              <div
                className="time-fill play"
                id="time-fill-play"
                style={{
                  width: barOvershoot
                    ? "120%"
                    : `${
                        showEducationalFeedback
                          ? 0
                          : Math.max(
                              0,
                              Math.min(100, (timeLeft / TOTAL_TIME) * 100)
                            )
                      }%`,
                  opacity: showEducationalFeedback ? 0 : 1,
                }}
              />
              <div
                className="time-fill feedback"
                id="time-fill-feedback"
                style={{
                  width: `${
                    showEducationalFeedback
                      ? Math.max(
                          0,
                          Math.min(
                            100,
                            (autoAdvanceLeft / AUTO_ADVANCE_TIME) * 100
                          )
                        )
                      : 100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Row 1, Col 2: Hero (right) */}
          <div className="copy-hero" id="copy-hero">
            <h1 className="hero-title">
              Can you spot a <br />
              <span className="hero-second-line">
                <span className="fake-word">
                  <WordFlip
                    words={["fake", "generated", "forged"]}
                    interval={2600}
                    animationDurationMs={600}
                    measureSuffix=" document?"
                  />
                </span>{" "}
                document?
              </span>
            </h1>
            <p className="hero-sub">
              Each <span className="em">correct guess</span> jumps you up the
              wait-list.
            </p>
          </div>

          {/* Row 2, Col 1: Image card (left) */}
          {/* Magnifier container around image */}
          <div className="document-container" id="document-container">
            {/* Shadow duplicate of the image card (no img), slightly bigger and lower */}
            <div
              className="image-card image-card-shadow"
              id="image-card-shadow"
            >
              <div
                className="document-wrapper shadow-only"
                id="document-wrapper-shadow"
              />
            </div>

            <div className="image-card" id="image-card">
              {/* Removed circular timer from image card */}

              {/* Optional toast */}
              {showCorrectToast && (
                <div className="correct-toast" id="correct-toast">
                  <span className="ct-emoji" aria-hidden>
                    🎉
                  </span>
                  <span className="ct-text">
                    <strong>Correct!</strong> That was {toastTruth}.{" "}
                    <span className="ct-plus">+50 places!</span>
                  </span>
                </div>
              )}

              {/* Signup modal */}
              {showSignup && (
                <div
                  className={`signup-overlay ${
                    signupMinimize ? "minimizing" : "visible"
                  }`}
                  id="signup-overlay"
                >
                  <div className="signup-backdrop" onClick={closeSignup} />
                  <div
                    className="signup-card"
                    id="signup-card"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="signup-title">Join us!</h3>
                    <form className="signup-form" onSubmit={handleSignupSubmit}>
                      <label htmlFor="signup-email">Email</label>
                      <input
                        id="signup-email"
                        type="email"
                        className="signup-input"
                        placeholder="Email address"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        required
                      />
                      <button
                        type="submit"
                        className={`signup-submit ${
                          signupSubmitting ? "loading" : ""
                        }`}
                        disabled={signupSubmitting}
                      >
                        {signupSubmitting ? "Loading..." : "Get early access"}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Bottom ticker removed from image card – relocated below PQ card */}

              <div
                className={`document-wrapper primary ${
                  showEducationalFeedback ? "" : "slide-in"
                } ${showSignup ? "blurred" : ""}`}
                id="document-wrapper"
              >
                {currentDoc ? (
                  <img
                    key={currentDoc.id}
                    src={currentDoc.image}
                    alt={`${currentDoc.type} to verify`}
                    className="document-image"
                  />
                ) : (
                  <div className="loading-placeholder" id="loading-placeholder">
                    <p>Loading documents...</p>
                  </div>
                )}
                <div
                  className="grid-overlay"
                  id="grid-overlay"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Action buttons anchored to the image card */}
            <div className="action-row" id="action-row">
              <button
                className="arrow-button circle danger"
                onClick={() => handleAnswer(false)}
                title="Forged (Left Arrow)"
                disabled={!currentDoc || isOnCooldown}
              >
                <span className="symbol" aria-hidden="true">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 6l12 12M18 6l-12 12"
                      stroke="currentColor"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="label">fake</span>
              </button>
              <button
                className="arrow-button circle success"
                onClick={() => handleAnswer(true)}
                title="Real (Right Arrow)"
                disabled={!currentDoc || isOnCooldown}
              >
                <span className="symbol" aria-hidden="true">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="label">real</span>
              </button>
            </div>
          </div>

          {/* Row 2, Col 2: Position queue card (right) */}
          <div className="copy-right-panel" id="copy-right-panel">
            <div
              className={`position-queue-wrapper ${queuePulse ? "pulse" : ""}`}
              id="position-queue-wrapper"
            >
              <PositionQueue
                position={position}
                totalPlayers={TOTAL_PLAYERS}
                delta={deltaShown}
              />
              {/* Vertical lyric-style ticker under PQ card */}
              <div className="pq-lyric-ticker" aria-live="polite">
                <div
                  key={tickerIdx}
                  className="pq-lyric-line"
                  style={{ "--lyric-duration": `${MARQUEE_DURATION_MS}ms` }}
                >
                  {TICKER_MESSAGES[tickerIdx]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
