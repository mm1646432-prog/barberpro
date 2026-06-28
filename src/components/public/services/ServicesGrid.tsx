"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ServiceCard } from "@/components/public/services/ServiceCard";
import { CategoryFilter } from "@/components/public/services/CategoryFilter";
import type { ServiceCardProps } from "@/components/public/services/ServiceCard";

const ALL_LABEL = "All";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

interface Props {
  services: ServiceCardProps[];
}

export function ServicesGrid({ services }: Props): React.JSX.Element {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_LABEL);

  const categories = useMemo<string[]>(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const s of services) {
      if (s.category !== null && s.category.length > 0 && !seen.has(s.category)) {
        seen.add(s.category);
        result.push(s.category);
      }
    }
    return result;
  }, [services]);

  const filtered = useMemo<ServiceCardProps[]>(() => {
    if (activeCategory === ALL_LABEL) return services;
    return services.filter((s) => s.category === activeCategory);
  }, [services, activeCategory]);

  return (
    <div className="space-y-8">
      {categories.length > 1 && (
        <CategoryFilter
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />
      )}

      <motion.div
        key={activeCategory}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((service) => (
          <motion.div key={service.id} variants={cardVariants}>
            <ServiceCard {...service} />
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p
          className="py-12 text-center text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          No services found in this category.
        </p>
      )}
    </div>
  );
}