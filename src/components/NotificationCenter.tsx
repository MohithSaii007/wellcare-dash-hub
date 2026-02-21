"use client";

import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2, Info } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: Date;
  read: boolean;
  type: string;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Listen for custom events to add notifications globally
  useEffect(() => {
    const handleNewNotification = (event: any) => {
      const newNotif: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        title: event.detail.title,
        body: event.detail.body,
        time: new Date(),
        read: false,
        type: event.detail.type,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      
      // Also show a toast for immediate feedback
      toast(newNotif.title, {
        description: newNotif.body,
      });
    };

    window.addEventListener("wellcare-notification", handleNewNotification);
    return () => window.removeEventListener("wellcare-notification", handleNewNotification);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[350px] sm:w-[400px]">
        <SheetHeader className="flex flex-row items-center justify-between border-b pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </SheetTitle>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs text-muted-foreground">
              <Trash2 className="mr-1 h-3 w-3" /> Clear All
            </Button>
          )}
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)] py-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
              <Info className="mb-2 h-10 w-10 opacity-20" />
              <p className="text-sm">No notifications yet</p>
              <p className="text-xs">Updates about your health journey will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4 pr-4">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`relative rounded-xl border p-4 transition-all ${
                    n.read ? "bg-card opacity-70" : "bg-accent/10 border-primary/20 shadow-sm"
                  }`}
                >
                  {!n.read && (
                    <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary" />
                  )}
                  <h4 className="text-sm font-bold pr-4">{n.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {n.body}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">
                      {n.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!n.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[10px]"
                        onClick={() => markAsRead(n.id)}
                      >
                        <Check className="mr-1 h-3 w-3" /> Mark read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationCenter;