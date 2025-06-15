import { describe, it, expect, jest, beforeEach  } from '@jest/globals';
import { render, screen, fireEvent } from "@testing-library/react";
import { NotificationBadge } from "@/components/notifications/NotificationBadge";

// Mock NotificationFeed component
jest.mock("@/components/notifications/NotificationFeed", () => ({
  NotificationFeed: ({ isOpen, notifications }: any) => (
    <div data-testid="notification-feed" data-open={isOpen}>
      {notifications.map((n: any) => (
        <div key={n.id}>{n.title}</div>
      ))}
    </div>
  )
}));

const mockNotifications = [
  {
    id: "1",
    title: "Test bildirimi 1",
    message: "Test mesajı 1",
    timestamp: "2025-06-01T10:00:00Z",
    read: false,
    type: "info" as const
  },
  {
    id: "2",
    title: "Test bildirimi 2",
    message: "Test mesajı 2",
    timestamp: "2025-06-01T11:00:00Z",
    read: true,
    type: "success" as const
  }
];

describe("NotificationBadge", () => {
  const mockOnMarkAsRead = jest.fn();

  beforeEach(() => {
    mockOnMarkAsRead.mockClear();
  });

  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(
        <NotificationBadge
          notifications={[]}
          onMarkAsRead={mockOnMarkAsRead}
        />
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("shows correct unread count", () => {
      render(
        <NotificationBadge
          notifications={mockNotifications}
          onMarkAsRead={mockOnMarkAsRead}
        />
      );
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("hides badge when no unread notifications", () => {
      render(
        <NotificationBadge
          notifications={mockNotifications.map(n => ({ ...n, read: true }))}
          onMarkAsRead={mockOnMarkAsRead}
        />
      );
      expect(screen.queryByText("1")).not.toBeInTheDocument();
    });

    it("has correct aria-label with unread count", () => {
      render(
        <NotificationBadge
          notifications={mockNotifications}
          onMarkAsRead={mockOnMarkAsRead}
        />
      );
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Bildirimler (1 okunmamış)"
      );
    });
  });

  describe("Interactions", () => {
    it("opens feed on click", () => {
      render(
        <NotificationBadge
          notifications={mockNotifications}
          onMarkAsRead={mockOnMarkAsRead}
        />
      );
      
      fireEvent.click(screen.getByRole("button"));
      expect(screen.getByTestId("notification-feed")).toHaveAttribute("data-open", "true");
    });

    it("marks notifications as read when closing", () => {
      render(
        <NotificationBadge
          notifications={mockNotifications}
          onMarkAsRead={mockOnMarkAsRead}
        />
      );
      
      // Open and close feed
      fireEvent.click(screen.getByRole("button"));
      const feed = screen.getByTestId("notification-feed");
      expect(feed).toHaveAttribute("data-open", "true");
      
      // Simulate closing
      fireEvent.click(screen.getByRole("button"));
      expect(mockOnMarkAsRead).toHaveBeenCalledWith(["1"]);
    });
  });

  describe("Accessibility", () => {
    it("has correct ARIA attributes", () => {
      render(
        <NotificationBadge
          notifications={mockNotifications}
          onMarkAsRead={mockOnMarkAsRead}
        />
      );
      
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-haspopup", "true");
      expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("updates aria-expanded when opened", () => {
      render(
        <NotificationBadge
          notifications={mockNotifications}
          onMarkAsRead={mockOnMarkAsRead}
        />
      );
      
      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(button).toHaveAttribute("aria-expanded", "true");
    });
  });
}); 