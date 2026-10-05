<script setup lang="ts">
const { consent, grant, deny } = useConsent()
</script>

<template>
    <Transition name="slide">
        <section v-if="consent === null" class="consent" aria-label="Analytics consent">
            <div class="consent-inner">
                <div>
                    <p class="consent-title">Help us understand how stories are read?</p>
                    <p class="meta">
                        With your permission we record anonymous reading statistics: pages visited, how far you scroll
                        and
                        how long you read. No names, no advertising cookies, nothing shared with third parties.
                        <NuxtLink to="/privacy">Read the details</NuxtLink>.
                    </p>
                </div>
                <div class="consent-actions">
                    <button type="button" class="btn" @click="deny">No thanks</button>
                    <button type="button" class="btn" @click="grant">Allow</button>
                </div>
            </div>
        </section>
    </Transition>
</template>

<style scoped>
.consent {
    position: fixed;
    inset: auto 1rem 1rem;
    z-index: 40;
    max-width: 760px;
    margin-inline: auto;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    box-shadow: 0 12px 40px rgb(43 37 34 / 18%);
}

.consent-inner {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    padding: 1.1rem 1.25rem;
}

.consent-inner>div:first-child {
    flex: 1 1 320px;
}

.consent-title {
    margin: 0 0 0.25rem;
    font-weight: 600;
}

.consent-actions {
    display: flex;
    gap: 0.5rem;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.25s ease, opacity 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateY(20px);
    opacity: 0;
}
</style>