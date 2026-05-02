import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboardPage from '@/app/admin/dashboard/page';
import { useRouter } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock components that are too complex for unit testing
vi.mock('@/components/app-sidebar', () => ({
  AppSidebar: ({ onModelSelect, navMainItems }: any) => (
    <div data-testid="sidebar">
      {navMainItems.map((item: any) => (
        <button key={item.title} onClick={item.onClick} data-testid={`nav-${item.title.toLowerCase()}`}>
          {item.title}
        </button>
      ))}
      <button onClick={() => onModelSelect('project')} data-testid="select-project">Select Project</button>
    </div>
  ),
}));

vi.mock('@/components/admin/workflow-panel', () => ({
  WorkflowPanel: ({ activeModel }: any) => (
    <div data-testid="workflow-panel">
      Active Model: {activeModel || 'Dashboard'}
    </div>
  ),
}));

describe('Admin Dashboard Flow', () => {
  const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);

    // Mock global fetch
    global.fetch = vi.fn((url) => {
      if (url.includes('/api/admin/models')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ models: [{ name: 'project', verbose_name: 'Projects' }] }),
        });
      }
      if (url.includes('/api/auth/profile')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ email: 'admin@bns.org', first_name: 'Admin' }),
        });
      }
      if (url.includes('/api/auth/admin-context')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            capabilities: { can_view_admin: true },
            membership: { organization_name: 'BNS Org', role: 'owner' }
          }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    }) as any;
  });

  it('renders dashboard and shows "At a glance" stats', async () => {
    render(<AdminDashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/At a glance/i)).toBeDefined();
    });

    expect(screen.getByText(/BNS Org/i)).toBeDefined();
    expect(screen.getByText(/registered admin models/i)).toBeDefined();
  });

  it('switches between hub sections (Operations, Learn Hub, etc.)', async () => {
    render(<AdminDashboardPage />);

    await waitFor(() => expect(screen.getByTestId('nav-operations')).toBeDefined());

    // Click Operations
    fireEvent.click(screen.getByTestId('nav-operations'));
    expect(screen.getByText(/Managing Projects in Operations/i)).toBeDefined();

    // Click Learn Hub
    fireEvent.click(screen.getByTestId('nav-learn hub'));
    expect(screen.getByText(/Managing items in Learn Hub/i)).toBeDefined();
  });

  it('updates the active model when selected from sidebar', async () => {
    render(<AdminDashboardPage />);

    await waitFor(() => expect(screen.getByTestId('select-project')).toBeDefined());

    fireEvent.click(screen.getByTestId('select-project'));
    
    await waitFor(() => {
      const panel = screen.getByTestId('workflow-panel');
      expect(panel.textContent).toContain('Active Model: project');
    });
  });

  it('redirects to login if session is invalid (401)', async () => {
    (global.fetch as any).mockImplementationOnce(() => 
      Promise.resolve({ status: 401 })
    );

    render(<AdminDashboardPage />);

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/admin/login');
    });
  });
});
