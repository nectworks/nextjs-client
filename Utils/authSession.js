'use client';

export function completeAuthSession(user, setUser) {
  setUser(user);

  if (typeof window === 'undefined') return;

  localStorage.setItem('userAuthenticated', 'true');
  localStorage.setItem('lastAuthCheck', Date.now().toString());
  sessionStorage.removeItem('userInfo');
  localStorage.removeItem('dashboard');
}

function normalizeRedirectPath(path) {
  if (!path || !path.startsWith('/') || path.startsWith('//')) {
    return '/profile';
  }

  return path;
}

export function navigateAfterAuth(router, path = '/profile') {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'auto';
  }

  router.replace(normalizeRedirectPath(path));

  if (typeof window !== 'undefined') {
    window.setTimeout(() => {
      router.refresh();
    }, 0);
  }
}
