import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotificationFeed } from "@/components/notifications/NotificationFeed";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Yeni sonuç yüklendi",
    message: "HbA1c değeriniz güncellendi.",
    timestamp: "2024-03-20T14:00:00Z",
    type: "info",
    read: false,
  },
  {
    id: "2",
    title: "Randevu onaylandı",
    message: "Dr. Ayşe ile 5 Haziran randevunuz onaylandı.",
    timestamp: "2024-03-19T14:00:00Z",
    type: "success",
    read: true,
  },
];

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  notifications: mockNotifications,
  onMarkAsRead: vi.fn(),
};

describe("NotificationFeed", () => {
  it("renders notifications correctly", () => {
    render(<NotificationFeed {...defaultProps} />);
    
    expect(screen.getByText("Yeni sonuç yüklendi")).toBeInTheDocument();
    expect(screen.getByText("HbA1c değeriniz güncellendi.")).toBeInTheDocument();
    expect(screen.getByText("Randevu onaylandı")).toBeInTheDocument();
    expect(screen.getByText("Dr. Ayşe ile 5 Haziran randevunuz onaylandı.")).toBeInTheDocument();
  });

  it("displays empty message when there are no notifications", () => {
    render(<NotificationFeed {...defaultProps} notifications={[]} />);
    
    expect(screen.getByText("Henüz bildirim bulunmuyor")).toBeInTheDocument();
  });

  it("applies correct styles for read/unread notifications", () => {
    render(<NotificationFeed {...defaultProps} />);
    
    const unreadTitle = screen.getByText("Yeni sonuç yüklendi");
    const readTitle = screen.getByText("Randevu onaylandı");
    
    expect(unreadTitle).toHaveClass("font-semibold");
    expect(readTitle).not.toHaveClass("font-semibold");
  });

  it("renders timestamps with proper formatting", () => {
    render(<NotificationFeed {...defaultProps} />);
    
    // Note: The actual formatted dates will depend on the locale and timezone
    expect(screen.getByText(/20 Mart 2024/)).toBeInTheDocument();
    expect(screen.getByText(/19 Mart 2024/)).toBeInTheDocument();
  });

  it("has proper list semantics", () => {
    render(<NotificationFeed {...defaultProps} />);
    
    const list = screen.getByRole("list");
    const items = screen.getAllByRole("listitem");
    
    expect(items).toHaveLength(2);
  });

  it("renders notification icons based on type", () => {
    render(<NotificationFeed {...defaultProps} />);
    
    const infoIcon = screen.getByTestId("info-icon");
    const successIcon = screen.getByTestId("success-icon");
    
    expect(infoIcon).toHaveClass("text-blue-500");
    expect(successIcon).toHaveClass("text-green-500");
  });

  it("calls onClose when close button is clicked", () => {
    render(<NotificationFeed {...defaultProps} />);
    
    const closeButton = screen.getByRole("button", { name: /kapat/i });
    closeButton.click();
    
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
}); 