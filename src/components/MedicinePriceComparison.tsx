"use client";

import React from "react";
import { Medicine, pharmacies, Pharmacy } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Truck, Clock, CheckCircle2, Zap } from "lucide-react";

interface PriceComparisonProps {
  medicine: Medicine;
  onSelect: (pharmacy: Pharmacy, price: number, discount: number) => void;
}

const MedicinePriceComparison = ({ medicine, onSelect }: PriceComparisonProps) => {
  if (!medicine.prices) return null;

  const sortedPrices = [...medicine.prices].sort((a, b) => {
    const priceA = a.price * (1 - a.discount / 100);
    const priceB = b.price * (1 - b.discount / 100);
    return priceA - priceB;
  });

  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Available at {medicine.prices.length} Pharmacies</h3>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Real-time Pricing</Badge>
      </div>

      <div className="space-y-3">
        {sortedPrices.map((priceData, index) => {
          const pharmacy = pharmacies.find(p => p.id === priceData.pharmacyId);
          if (!pharmacy) return null;

          const finalPrice = Math.round(priceData.price * (1 - priceData.discount / 100));
          const isBestValue = index === 0;

          return (
            <Card 
              key={pharmacy.id} 
              className={`overflow-hidden transition-all hover:border-primary/50 ${isBestValue ? 'border-primary/40 bg-primary/5 ring-1 ring-primary/20' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm">{pharmacy.name}</h4>
                      {isBestValue && (
                        <Badge className="bg-primary text-[8px] h-4 px-1.5 gap-1">
                          <Zap className="h-2 w-2 fill-current" /> BEST VALUE
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5 text-warning">
                        <Star className="h-3 w-3 fill-current" /> {pharmacy.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {pharmacy.deliveryTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Truck className="h-3 w-3" /> {pharmacy.deliveryCharge === 0 ? 'FREE' : `₹${pharmacy.deliveryCharge}`}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {priceData.discount > 0 && (
                        <span className="text-[10px] text-muted-foreground line-through">₹{priceData.price}</span>
                      )}
                      <span className="text-lg font-bold text-primary">₹{finalPrice}</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground">per unit</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className={`h-1.5 w-1.5 rounded-full ${priceData.stock > 20 ? 'bg-success' : 'bg-warning'}`} />
                    <span className="text-[10px] text-muted-foreground">
                      {priceData.stock > 20 ? 'In Stock' : `Only ${priceData.stock} left`}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    className="h-8 px-4 hero-gradient"
                    onClick={() => onSelect(pharmacy, priceData.price, priceData.discount)}
                  >
                    Select Pharmacy
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MedicinePriceComparison;