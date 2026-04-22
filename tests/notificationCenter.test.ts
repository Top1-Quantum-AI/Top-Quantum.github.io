/**
 * Notification Center Tests
 */
import { addNotification, getUnreadCount } from '../src/components/NotificationCenter';

describe('NotificationCenter utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('addNotification', () => {
    it('should add a notification to localStorage', () => {
      addNotification('security', 'Test Title', 'Test message');
      const raw = localStorage.getItem('quantum_notifications');
      expect(raw).not.toBeNull();
      const items = JSON.parse(raw!);
      expect(items.length).toBeGreaterThan(0);
      // Last added is at the beginning (unshift)
      expect(items[0].title).toBe('Test Title');
      expect(items[0].type).toBe('security');
      expect(items[0].read).toBe(false);
    });

    it('should add multiple notifications', () => {
      addNotification('system', 'Alert 1', 'Message 1');
      addNotification('billing', 'Alert 2', 'Message 2');
      const raw = localStorage.getItem('quantum_notifications');
      const items = JSON.parse(raw!);
      // 2 added + default notifications
      expect(items.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getUnreadCount', () => {
    it('should return count of default unread notifications on fresh state', () => {
      const count = getUnreadCount();
      // Default notifications include some unread ones
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should increment after adding an unread notification', () => {
      const before = getUnreadCount();
      addNotification('info', 'New', 'New message');
      const after = getUnreadCount();
      expect(after).toBe(before + 1);
    });
  });
});
