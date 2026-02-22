import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  color: "primary" | "secondary" | "accent" | "success" | "warning";
  delay?: number;
  onClick?: (e: React.MouseEvent) => void;
}

const colorMap = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

const ServiceCard = ({ title, description, icon: Icon, to, color, delay = 0, onClick }: ServiceCardProps) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="group block rounded-3xl border bg-card p-8 card-shadow transition-all duration-300 hover:card-shadow-hover hover:-translate-y-2 animate-fade-in border-border/50 hover:border-primary/20"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${colorMap[color]} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-heading font-bold text-card-foreground group-hover:text-primary transition-colors">{title}</h3>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{description}</p>
      <div className="mt-6 flex items-center text-xs font-bold text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
        Learn More <span className="ml-2">→</span>
      </div>
    </Link>
  );
};

export default ServiceCard;