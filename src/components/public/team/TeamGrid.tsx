"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { BarberCard } from "@/components/public/team/BarberCard";
import type { BarberCardProps } from "@/components/public/team/BarberCard";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

interface Props {
  members: BarberCardProps[];
}

export function TeamGrid({ members }: Props): React.JSX.Element {
  if (members.length === 0) {
    return (
      <p
        className="py-12 text-center text-sm"
        style={{ color: "var(--color-text-muted)" }}
      >
        Team information coming soon.
      </p>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {members.map((member) => (
        <motion.div key={member.id} variants={cardVariants}>
          <BarberCard {...member} />
        </motion.div>
      ))}
    </motion.div>
  );
}