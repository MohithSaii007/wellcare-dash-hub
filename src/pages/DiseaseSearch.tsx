import { useState } from "react";
import { Search, AlertTriangle, ChevronRight } from "lucide-react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { diseases, type Disease } from "@/data/mockData";

const DiseaseSearch = () => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Disease | null>(null);

  const filtered = query.length > 0
    ? diseases.filter((d) =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.symptoms.some((s) => s.toLowerCase().includes(query.toLowerCase()))
      )
    : diseases;

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-heading font-bold">Disease & Cure Search</h1>
          <p className="mt-1 text-muted-foreground">Search for any disease to learn about symptoms, causes, and treatments</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search diseases, symptoms..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
            className="pl-10 h-12 text-base"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Disease List */}
          <div className="lg:col-span-1 space-y-2">
            {filtered.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelected(d)}
                className={`w-full flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                  selected?.id === d.id
                    ? "border-primary bg-accent card-shadow-hover"
                    : "bg-card card-shadow hover:card-shadow-hover"
                }`}
              >
                <div>
                  <p className="font-semibold text-card-foreground">{d.name}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">{d.category}</Badge>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No diseases found for "{query}"</p>
            )}
          </div>

          {/* Disease Detail */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="rounded-xl border bg-card p-6 card-shadow animate-fade-in">
                <h2 className="text-2xl font-heading font-bold text-card-foreground">{selected.name}</h2>
                <p className="mt-2 text-muted-foreground">{selected.description}</p>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <InfoBlock title="Causes" items={selected.causes} color="destructive" />
                  <InfoBlock title="Symptoms" items={selected.symptoms} color="warning" />
                  <InfoBlock title="Basic Cure Suggestions" items={selected.cures} color="success" />
                  <InfoBlock title="Recommended Medicines" items={selected.medicines} color="primary" />
                </div>

                <div className="mt-6 flex items-start gap-2 rounded-lg bg-warning/10 p-4 text-sm">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
                  <p className="text-muted-foreground">
                    <strong>Disclaimer:</strong> This information is for educational purposes only. Please consult a qualified healthcare provider before starting any medication or treatment.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border border-dashed bg-muted/50 text-muted-foreground">
                Select a disease from the list to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

const InfoBlock = ({ title, items, color }: { title: string; items: string[]; color: string }) => (
  <div>
    <h3 className="mb-2 font-heading font-semibold text-card-foreground">{title}</h3>
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-${color}`} />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default DiseaseSearch;
