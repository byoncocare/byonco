import React from "react";
import { motion } from "framer-motion";

/**
 * TypesCovered Component
 * Displays a "Types Covered" label with a colored number count.
 * 
 * Uses explicit color classes and inline styles to ensure colors are never overridden
 * by parent text color classes. Includes colored glow effects and subtle animations.
 * 
 * @param {number} count - The number to display
 * @param {string} numberColor - Tailwind color class for the number (e.g., "text-[#ff4a4a]", "text-orange-400")
 * @param {string} glowClass - Tailwind shadow class for the colored glow effect
 */
type TypesCoveredProps = {
  count: number;
  numberColor: string;
  glowClass: string;
};

const TypesCovered: React.FC<TypesCoveredProps> = ({ 
  count, 
  numberColor,
  glowClass
}) => {
  // Extract color value from numberColor for inline style fallback
  const getColorValue = (colorClass: string): string => {
    if (colorClass.includes('#ff4747') || colorClass.includes('#ff4a4a')) return '#ff4747';
    if (colorClass.includes('#ff9f1c') || colorClass.includes('orange')) return '#ff9f1c';
    if (colorClass.includes('#facc15') || colorClass.includes('yellow')) return '#facc15';
    return '#ffffff'; // fallback
  };

  // Extract shadow value from glowClass for inline style
  const getShadowValue = (glowClass: string): string => {
    if (glowClass.includes('255,74,74')) return '0 0 35px rgba(255,74,74,0.45)';
    if (glowClass.includes('255,165,0')) return '0 0 35px rgba(255,165,0,0.45)';
    if (glowClass.includes('255,215,0')) return '0 0 35px rgba(255,215,0,0.45)';
    return '0 0 35px rgba(139, 92, 246, 0.3)'; // fallback
  };

  const colorValue = getColorValue(numberColor);
  const shadowValue = getShadowValue(glowClass);

  return (
    <motion.div
      className={`mt-3 md:mt-5 p-3 md:p-5 rounded-lg md:rounded-[14px] transition-all duration-300 ${glowClass}`}
      style={{
        background: "rgba(60, 40, 90, 0.45)",
        border: "1px solid rgba(139, 92, 246, 0.3)",
        boxShadow: shadowValue,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Label - Always white, explicitly set to prevent inheritance */}
      <p 
        className="text-xs md:text-sm mb-1 md:mb-2 font-medium"
        style={{ color: '#ffffff' }}
      >
        Types Covered
      </p>
      {/* Number - Uses the provided color class with inline style fallback to ensure it's never black */}
      <p 
        className={`${numberColor} text-2xl md:text-3xl lg:text-4xl font-bold`}
        style={{ color: colorValue }}
      >
        {count}
      </p>
    </motion.div>
  );
};

export default TypesCovered;

