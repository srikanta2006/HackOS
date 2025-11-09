import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const charactersData = [
  { color: "#FF6B35", x: 40, y: 220, width: 95, height: 150 },
  { color: "#2D2D2D", x: 155, y: 245, width: 85, height: 130 },
  { color: "#FFD23F", x: 260, y: 255, width: 80, height: 120 },
  { color: "#6C5CE7", x: 95, y: 95, width: 100, height: 160 },
];

const spring = { type: "spring", stiffness: 120, damping: 18 };

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function calculateEyeAndBodyPosition(mousePos, char) {
  if (!mousePos) return { eyeX: 0, eyeY: 0, bodyRotate: 0, bodyLean: 0 };

  const centerX = char.x + char.width / 2;
  const centerY = char.y + char.height * 0.35;

  const dx = mousePos.x - centerX;
  const dy = mousePos.y - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  const eyeDistance = Math.min(distance / 40, 6);
  const eyeX = Math.cos(angle) * eyeDistance;
  const eyeY = Math.sin(angle) * eyeDistance;

  const bodyLean = clamp(dx / 30, -18, 18);
  const bodyRotate = clamp(dx / 40, -8, 8);

  return { eyeX, eyeY, bodyRotate, bodyLean };
}

function useRandomBlink(enabled = true) {
  const [isBlinking, setIsBlinking] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let timeoutId;
    function schedule() {
      const t = 2200 + Math.random() * 3800;
      timeoutId = setTimeout(() => {
        setIsBlinking(true);
        const dur = 80 + Math.random() * 100;
        setTimeout(() => {
          setIsBlinking(false);
          schedule();
        }, dur);
      }, t);
    }
    schedule();
    return () => clearTimeout(timeoutId);
  }, [enabled]);
  return isBlinking;
}

function Character({ index, char, mousePos, isTypingPassword, showPassword, loginState, justToggledPassword }) {
  const isBlinking = useRandomBlink(loginState === 'idle');
  const { eyeX, eyeY, bodyRotate, bodyLean } = calculateEyeAndBodyPosition(mousePos, char);

  let headVariants = {
    idle: { x: bodyLean, rotate: bodyRotate, y: 0, scale: 1 },
    error: { y: 6, scale: 0.98, rotate: 0, x: 0 },
    success: { y: -10, scale: 1.03, rotate: 0, x: 0 },
  };

  const peekOffset = 6 + index * 4;
  let stateKey = "idle";
  let extraTransform = {};

  if (loginState === "error") {
    stateKey = "error";
  } else if (loginState === "success") {
    stateKey = "success";
  } else if (isTypingPassword && !showPassword) {
    stateKey = "idle";
    extraTransform = { x: peekOffset + 10, rotate: 8 + index * 2 };
  } else if (isTypingPassword && showPassword) {
    stateKey = "idle";
    extraTransform = { x: -15 - index * 3, rotate: -12 - index * 3, scale: 0.98 };
  }

  let pupilSize = { width: 18, height: 18, marginLeft: 0 };
  if (isTypingPassword && showPassword) pupilSize = { width: 14, height: 18, marginLeft: 8 };
  if (justToggledPassword && showPassword) pupilSize = { width: 20, height: 20, marginLeft: 0 };

  let leftEyeTransform = { x: eyeX, y: eyeY };
  let rightEyeTransform = { x: eyeX, y: eyeY };

  if (loginState === "error") {
    leftEyeTransform = { x: 0, y: 5 };
    rightEyeTransform = { x: 0, y: 5 };
  } else if (isTypingPassword && !showPassword) {
    leftEyeTransform = { x: 6, y: 0 };
    rightEyeTransform = { x: 6, y: 0 };
  } else if (isTypingPassword && showPassword) {
    leftEyeTransform = { x: -7, y: 1 };
    rightEyeTransform = { x: -7, y: 1 };
  }

  return (
    <motion.div
      initial={false}
      animate={{ ...headVariants[stateKey], ...extraTransform }}
      transition={spring}
      style={{ 
        left: char.x, 
        top: char.y, 
        width: char.width, 
        height: char.height, 
        position: "absolute", 
        transformOrigin: "center center" 
      }}
      className="absolute"
    >
      {/* Body */}
      <motion.div
        className="absolute inset-0 rounded-b-3xl"
        style={{ 
          backgroundColor: char.color, 
          top: `${char.height * 0.35}px`, 
          borderRadius: "0 0 24px 24px", 
          boxShadow: "0 6px 12px rgba(0,0,0,0.15)" 
        }}
        animate={{ y: [0, -1.5, 0] }}
        transition={{ duration: 3 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Head */}
      <div
        style={{ 
          height: `${char.height * 0.42}px`, 
          backgroundColor: char.color, 
          borderRadius: "50% 50% 0 0", 
          position: "absolute", 
          left: 0, 
          right: 0, 
          top: 0, 
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)" 
        }}
      >
        {/* Eyebrows */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-7">
          {loginState === "error" ? (
            <>
              <motion.div 
                className="w-10 h-1.5 bg-black/90 rounded-full" 
                style={{ transform: "rotate(18deg) translateY(-2px)" }}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: [1, 0.95, 1] }}
                transition={{ duration: 0.3 }}
              />
              <motion.div 
                className="w-10 h-1.5 bg-black/90 rounded-full" 
                style={{ transform: "rotate(-18deg) translateY(-2px)" }}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: [1, 0.95, 1] }}
                transition={{ duration: 0.3 }}
              />
            </>
          ) : isTypingPassword && showPassword ? (
            <>
              <motion.div 
                className="w-10 h-1.5 bg-black/90 rounded-full" 
                animate={{ rotate: -15, y: -3 }}
                transition={spring}
              />
              <motion.div 
                className="w-10 h-1.5 bg-black/90 rounded-full" 
                animate={{ rotate: 15, y: -3 }}
                transition={spring}
              />
            </>
          ) : loginState === "success" ? (
            <>
              <motion.div 
                className="w-10 h-1.5 bg-black/90 rounded-full" 
                animate={{ rotate: -12 }}
                transition={spring}
              />
              <motion.div 
                className="w-10 h-1.5 bg-black/90 rounded-full" 
                animate={{ rotate: 12 }}
                transition={spring}
              />
            </>
          ) : (
            <>
              <div className="w-10 h-1.5 bg-black/90 rounded-full" />
              <div className="w-10 h-1.5 bg-black/90 rounded-full" />
            </>
          )}
        </div>

        {/* Eyes container */}
        <div className="absolute w-full left-0 right-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="flex gap-5">
            {loginState === "success" ? (
              // Happy closed eyes - curved smile shape
              <>
                <motion.div 
                  className="w-11 h-6 flex items-center justify-center"
                  initial={{ scaleY: 1 }}
                  animate={{ scaleY: 0.3 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg width="40" height="16" viewBox="0 0 40 16">
                    <path d="M 5 2 Q 20 14 35 2" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                </motion.div>
                <motion.div 
                  className="w-11 h-6 flex items-center justify-center"
                  initial={{ scaleY: 1 }}
                  animate={{ scaleY: 0.3 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg width="40" height="16" viewBox="0 0 40 16">
                    <path d="M 5 2 Q 20 14 35 2" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                </motion.div>
              </>
            ) : (
              <>
                {/* LEFT EYE */}
                <div className="relative w-11 h-11 bg-white rounded-full flex items-center justify-center border-2 border-gray-800 overflow-hidden">
                  <motion.div 
                    animate={{ x: leftEyeTransform.x, y: leftEyeTransform.y }} 
                    transition={spring} 
                    style={{ 
                      width: pupilSize.width, 
                      height: pupilSize.height, 
                      marginLeft: pupilSize.marginLeft 
                    }} 
                    className="bg-gray-900 rounded-full" 
                  />
                </div>
                
                {/* RIGHT EYE */}
                <div className="relative w-11 h-11 bg-white rounded-full flex items-center justify-center border-2 border-gray-800 overflow-hidden">
                  <motion.div 
                    animate={{ x: rightEyeTransform.x, y: rightEyeTransform.y }} 
                    transition={spring} 
                    style={{ 
                      width: pupilSize.width, 
                      height: pupilSize.height, 
                      marginLeft: pupilSize.marginLeft 
                    }} 
                    className="bg-gray-900 rounded-full" 
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Enhanced Blinking Animation - Eyelids from top and bottom */}
        <AnimatePresence>
          {isBlinking && loginState !== "success" && (
            <>
              {/* Top Eyelid */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.08, ease: "easeInOut" }}
                className="absolute left-0 right-0 top-0 h-1/2 bg-gradient-to-b from-gray-900/95 to-transparent pointer-events-none"
                style={{ 
                  borderRadius: "50% 50% 0 0",
                  backdropFilter: "blur(1px)"
                }}
              />
              
              {/* Bottom Eyelid */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.08, ease: "easeInOut" }}
                className="absolute left-0 right-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-900/95 to-transparent pointer-events-none"
                style={{ 
                  borderRadius: "0 0 50% 50%",
                  backdropFilter: "blur(1px)"
                }}
              />
              
              {/* Eyelid line in the middle */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.06 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-0.5 bg-gray-900 rounded-full pointer-events-none"
              />
            </>
          )}
        </AnimatePresence>
        
        {/* Blush when happy or embarrassed */}
        {(loginState === "success" || (isTypingPassword && showPassword)) && (
          <>
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.5 }}
              className="absolute left-2 top-1/2 w-7 h-5 bg-pink-400/60 rounded-full blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.5 }}
              className="absolute right-2 top-1/2 w-7 h-5 bg-pink-400/60 rounded-full blur-sm" 
            />
          </>
        )}
      </div>

      {/* Mouth */}
      <div className="absolute left-0 right-0 bottom-14 flex items-center justify-center pointer-events-none">
        {loginState === "error" ? (
          <motion.svg 
            width="50" 
            height="25" 
            viewBox="0 0 50 25"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.path 
              d="M 8 18 Q 25 8 42 18" 
              stroke="black" 
              strokeWidth="3" 
              fill="none" 
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          </motion.svg>
        ) : loginState === "success" ? (
          <motion.div
            initial={{ scale: 0.8, y: 5 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <svg width="60" height="30" viewBox="0 0 60 30">
              <motion.path 
                d="M 8 8 Q 30 28 52 8" 
                stroke="black" 
                strokeWidth="3" 
                fill="none" 
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              />
            </svg>
          </motion.div>
        ) : (
          <svg width="45" height="20" viewBox="0 0 45 20">
            <path d="M 8 10 Q 22.5 15 37 10" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {/* Tear drop for error */}
      {loginState === "error" && (
        <motion.div 
          initial={{ y: -10, opacity: 0, scale: 0 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-blue-400 text-base"
        >
          💧
        </motion.div>
      )}

      {/* Sparkle for success */}
      {loginState === "success" && (
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.5, rotate: -45 }} 
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }} 
          transition={{ delay: index * 0.08, duration: 0.5, type: "spring" }} 
          className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl pointer-events-none drop-shadow-lg"
        >
          ✨
        </motion.div>
      )}
    </motion.div>
  );
}

// Main Component - Export this for your login/register pages
export default function AnimatedMascots({ mousePos, isTypingPassword, showPassword, loginState, justToggledPassword }) {
  return (
    <div className="relative w-full h-full">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
      <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-slate-950/20 to-transparent" />

      {/* Characters Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative" style={{ width: '400px', height: '400px' }}>
          {charactersData.map((char, i) => (
            <Character
              key={i}
              index={i}
              char={char}
              mousePos={mousePos}
              isTypingPassword={isTypingPassword}
              showPassword={showPassword}
              loginState={loginState}
              justToggledPassword={justToggledPassword}
            />
          ))}
        </div>
      </div>

      {/* Success Celebration Overlay */}
      <AnimatePresence>
        {loginState === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ 
                scale: [1, 1.3, 1.1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 0.8,
                times: [0, 0.5, 1],
                ease: "easeInOut"
              }}
              className="text-9xl drop-shadow-2xl"
            >
              🎉
            </motion.div>
            
            {/* Floating sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: [0, (i % 2 ? 1 : -1) * (50 + i * 20)],
                  y: [0, -50 - i * 15]
                }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute text-4xl"
                style={{
                  left: '50%',
                  top: '50%'
                }}
              >
                {i % 3 === 0 ? '✨' : i % 3 === 1 ? '⭐' : '💫'}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}