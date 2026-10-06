<template>
  <div class="site">
    <a class="skip-link" href="#main">Skip to content</a>

    <header class="site-header">
      <div class="container header-inner">
        <NuxtLink to="/" class="brand">In Their Words</NuxtLink>
        <nav aria-label="Main">
          <NuxtLink to="/#all-stories">All stories</NuxtLink>
          <NuxtLink to="/privacy">Privacy</NuxtLink>
        </nav>
      </div>
    </header>

    <main id="main" tabindex="-1">
      <slot />
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <p>
          In Their Words is a demo built for the Global Asia Institute take-home assessment. All
          stories and people are fictional.
        </p>
        <NuxtLink to="/privacy">Privacy and analytics</NuxtLink>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.site {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  outline: none;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgb(251 247 241 / 92%);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--line);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
}

.brand {
  font: 650 1.3rem var(--font-display);
  color: var(--ink);
  text-decoration: none;
}

nav {
  display: flex;
  gap: 1.25rem;
}

nav a {
  color: var(--ink-soft);
  text-decoration: none;
  font-weight: 500;
}

nav a:hover,
nav a.router-link-exact-active {
  color: var(--accent);
}

.site-footer {
  margin-top: 4rem;
  padding: 2rem 0;
  border-top: 1px solid var(--line);
  background: var(--surface-warm);
  color: var(--ink-soft);
  font-size: 0.9rem;
}

.footer-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
}

.footer-inner p {
  margin: 0;
  max-width: 60ch;
}
</style>
