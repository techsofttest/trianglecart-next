export type ToastType = 'success' | 'info' | 'warning' | 'error';

export function showToast(message: string, type: ToastType = 'info') {
  if (typeof window === 'undefined') return;

  const existing = document.getElementById('trianglecart-toast');
  if (existing) {
    existing.remove();
  }

  const colors: Record<ToastType, { background: string; text: string }> = {
    success: { background: '#047857', text: '#ffffff' },
    info: { background: '#0f172a', text: '#ffffff' },
    warning: { background: '#92400e', text: '#ffffff' },
    error: { background: '#991b1b', text: '#ffffff' },
  };

  const { background, text } = colors[type] || colors.info;

  const toast = document.createElement('div');
  toast.id = 'trianglecart-toast';
  toast.style.position = 'fixed';
  toast.style.bottom = '1.5rem';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.zIndex = '9999';
  toast.style.width = 'auto';
  toast.style.maxWidth = 'calc(100% - 2rem)';
  toast.style.pointerEvents = 'none';

  const inner = document.createElement('div');
  inner.textContent = message;
  inner.style.display = 'inline-flex';
  inner.style.alignItems = 'center';
  inner.style.justifyContent = 'center';
  inner.style.padding = '0.85rem 1rem';
  inner.style.borderRadius = '9999px';
  inner.style.backgroundColor = background;
  inner.style.color = text;
  inner.style.fontSize = '0.95rem';
  inner.style.lineHeight = '1.2';
  inner.style.boxShadow = '0 18px 40px rgba(15, 23, 42, 0.2)';
  inner.style.opacity = '0';
  inner.style.transform = 'translateY(10px)';
  inner.style.transition = 'opacity 220ms ease, transform 220ms ease';
  inner.style.pointerEvents = 'auto';

  toast.appendChild(inner);
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    inner.style.opacity = '1';
    inner.style.transform = 'translateY(0)';
  });

  const hide = () => {
    inner.style.opacity = '0';
    inner.style.transform = 'translateY(10px)';
    window.setTimeout(() => toast.remove(), 220);
  };

  const timeoutId = window.setTimeout(hide, 2800);
  toast.addEventListener('click', () => {
    window.clearTimeout(timeoutId);
    hide();
  });
}

export function showLoginRequiredToast() {
  showToast('Please log in to use the wishlist.', 'info');
}
