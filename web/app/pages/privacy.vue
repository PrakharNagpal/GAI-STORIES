<script setup lang="ts">
useSeoMeta({
  title: 'Privacy and analytics',
  description: 'What In Their Words records about reading, why, and how to change your choice.',
})
const {consent, grant, deny} = useConsent()
</script>

<template>
  <article class="narrow privacy">
    <p class="eyebrow">Privacy</p>
    <h1>Privacy and analytics</h1>
    <p class="lede">
      Stories here can be personal, so we keep measurement minimal, anonymous and optional.
    </p>

    <h2>Your choice</h2>
    <ClientOnly>
      <p>
        Reading statistics are currently
        <strong>{{
          consent === 'granted' ? 'on' : consent === 'denied' ? 'off' : 'not yet chosen'
        }}</strong
        >.
      </p>
      <div class="actions">
        <button type="button" class="btn" :disabled="consent === 'granted'" @click="grant">
          Turn on
        </button>
        <button type="button" class="btn" :disabled="consent === 'denied'" @click="deny">
          Turn off
        </button>
      </div>
    </ClientOnly>

    <h2>What we record, only if you say yes</h2>
    <ul>
      <li>Which pages on this site you open, and which page you came from on this site.</li>
      <li>How far you scroll through a story (25, 50, 75 or 100 percent).</li>
      <li>How long you actively read a story, counted only while the tab is visible.</li>
      <li>
        A random ID that lasts only for this browser tab, so one visit's events can be grouped.
      </li>
    </ul>

    <h2>What we never record</h2>
    <ul>
      <li>Your name, email, or any account details. This site has no accounts.</li>
      <li>Your IP address or device fingerprint alongside these events.</li>
      <li>
        Advertising or third-party tracking cookies. Data is not shared with or sold to anyone.
      </li>
    </ul>

    <h2>Why</h2>
    <p>
      To learn which stories readers finish and where they stop, so the editorial team can improve
      how stories are written and presented. We do not use it to profile individuals or infer
      anything sensitive about them.
    </p>

    <h2>How long we keep it</h2>
    <p>
      In this demo, events exist only as hosting logs, which expire automatically. A production
      version would keep raw events for a short, fixed period and only aggregated counts after that.
    </p>

    <h2>Browser privacy signals</h2>
    <p>
      If your browser sends Global Privacy Control or Do Not Track, we treat that as a no
      automatically.
    </p>

    <p class="meta note">
      This is a demo for a take-home assessment, not a legal document. A real deployment would be
      reviewed by the organisation's Data Protection Officer and list their contact details here.
    </p>
  </article>
</template>

<style scoped>
.narrow {
  width: min(100% - 2.5rem, 720px);
  margin-inline: auto;
}

.privacy {
  padding: clamp(2rem, 6vw, 4rem) 0;
  font-family: var(--font-reading);
  font-size: 1.1rem;
  line-height: 1.7;
}

.privacy h1 {
  font-size: clamp(2rem, 5vw, 3rem);
}

.privacy h2 {
  font-size: 1.4rem;
  margin-top: 2.2rem;
}

.lede {
  font-size: 1.25rem;
  color: var(--ink-soft);
}

.actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn:disabled {
  opacity: 0.45;
  cursor: default;
}

.note {
  margin-top: 3rem;
  font-family: var(--font-ui);
}
</style>
