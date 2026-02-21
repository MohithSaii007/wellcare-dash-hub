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
  primary: "hero-gradient text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
};

const ServiceCard = ({ title, description, icon: Icon, to, color, delay = 0, onClick }: ServiceCardProps) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="group block rounded-xl border bg-card p-6 card-shadow transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color]} transition-transform group-hover:scale-110`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-heading font-semibold text-card-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </Link>
  );
};

export default ServiceCard;