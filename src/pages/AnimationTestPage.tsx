import { motion } from 'framer-motion';
import { Languages, GraduationCap } from 'lucide-react';

export default function AnimationTestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#07111F] to-[#0D1B2A] overflow-hidden">
      <div className="flex flex-col gap-6 max-w-2xl w-full">
        {/* Card 1 */}
        <motion.div
          initial={{ x: 350, scale: 0.95, opacity: 0 }}
          animate={{
            x: 0,
            scale: [0.95, 1.02, 1.0],
            opacity: 1,
          }}
          transition={{
            duration: 1.3,
            delay: 0,
            ease: [0.16, 1, 0.3, 1], // Custom ease-out
            times: [0, 0.7, 1],
          }}
          className="relative bg-white/[0.03] backdrop-blur-[20px] rounded-2xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_0_15px_rgba(59,130,246,0.1)] overflow-hidden flex items-center gap-5"
        >
          {/* Animated red line at bottom */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.3, // Starts after the card stops moving
              ease: "easeOut",
            }}
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 to-red-400 origin-left"
          />
          
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <Languages className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-white/90 text-lg leading-relaxed font-medium">
            Обучение ведется на английском, русском и таджикском языках.
          </p>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ x: 350, scale: 0.95, opacity: 0 }}
          animate={{
            x: 0,
            scale: [0.95, 1.02, 1.0],
            opacity: 1,
          }}
          transition={{
            duration: 1.3,
            delay: 0.1, // 0.1s delay between cards
            ease: [0.16, 1, 0.3, 1],
            times: [0, 0.7, 1],
          }}
          className="relative bg-white/[0.03] backdrop-blur-[20px] rounded-2xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_0_15px_rgba(59,130,246,0.1)] overflow-hidden flex items-center gap-5"
        >
          {/* Animated red line at bottom */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.4, // Starts after the card stops moving (1.3 + 0.1)
              ease: "easeOut",
            }}
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 to-red-400 origin-left"
          />
          
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.2)]">
            <GraduationCap className="w-6 h-6 text-teal-400" />
          </div>
          <p className="text-white/90 text-lg leading-relaxed font-medium">
            Наши преподаватели — опытные практикующие специалисты.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
