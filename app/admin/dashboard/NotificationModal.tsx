"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Bell,
  Check,
  X,
  AlertCircle,
  Info,
  Mail,
  Calendar,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning" | "invite";
  title: string;
  message: string;
  time: string;
  read: boolean;
  sender?: {
    name: string;
    avatar: string;
  };
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationModalProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationModal({ open, onClose }: NotificationModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "Payment Received",
      message:
        "Your subscription payment of $12.99 has been processed successfully.",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: "2",
      type: "invite",
      title: "New Connection Request",
      message: "Sarah Johnson wants to connect with you on MemorialHub.",
      time: "15 minutes ago",
      read: false,
      sender: {
        name: "Sarah Johnson",
        avatar: "/avatars/sarah-johnson.jpg",
      },
      action: {
        label: "Respond",
        onClick: () => console.log("Respond to invite"),
      },
    },
    {
      id: "3",
      type: "warning",
      title: "Storage Limit Approaching",
      message:
        "You've used 85% of your storage. Upgrade to Premium for more space.",
      time: "1 hour ago",
      read: true,
    },
    {
      id: "4",
      type: "info",
      title: "New Feature Available",
      message: "Try our new memorial timeline feature to showcase life events.",
      time: "3 hours ago",
      read: true,
    },
    {
      id: "5",
      type: "error",
      title: "Login Attempt Failed",
      message: "There was an unsuccessful login attempt from a new device.",
      time: "Yesterday",
      read: true,
    },
    {
      id: "6",
      type: "invite",
      title: "Event Reminder",
      message: "Memorial service for Robert Wilson is tomorrow at 2:00 PM.",
      time: "2 days ago",
      read: true,
      action: {
        label: "Add to Calendar",
        onClick: () => console.log("Add to calendar"),
      },
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <Check className="h-5 w-5 text-green-500" />;
      case "error":
        return <X className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "invite":
        return <UserPlus className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <DialogTitle>Notifications</DialogTitle>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="px-2 py-0.5">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
          </div>
          <DialogDescription>
            {unreadCount > 0
              ? `${unreadCount} unread notifications`
              : "You're all caught up"}
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-2" />

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-10 w-10 text-gray-400 mb-2" />
              <h3 className="text-lg font-medium">No notifications</h3>
              <p className="text-sm text-gray-500">
                We'll notify you when something new arrives.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg transition-colors ${
                  !notification.read ? "bg-blue-50/50" : "hover:bg-gray-50"
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="pt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-medium ${
                          !notification.read ? "text-gray-900" : "text-gray-600"
                        }`}
                      >
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    {notification.sender && (
                      <div className="flex items-center mt-2">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={notification.sender.avatar} />
                          <AvatarFallback>
                            {notification.sender.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500">
                          From {notification.sender.name}
                        </span>
                      </div>
                    )}
                    {notification.action && (
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            notification.action?.onClick();
                          }}
                        >
                          {notification.action.label}
                        </Button>
                      </div>
                    )}
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <Separator className="my-2" />

        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
