import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function AnimatedText({
  text,
  className,
  delay = 0,
}: AnimatedTextProps) {
  // Split text into array of letters
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: delay * 0.1,
      },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <motion.div
      className={cn("flex overflow-hidden", className)}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <div className="flex">
        {letters.map((letter, index) => (
          <motion.span
            variants={child}
            key={index}
            className={letter === " " ? "mr-2" : ""}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
