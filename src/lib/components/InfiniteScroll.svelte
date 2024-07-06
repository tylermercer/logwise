<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
  
    export let threshold: number = 100;
    export let hasMore: boolean;

    const dispatch = createEventDispatcher();
  
    let sentinel: HTMLDivElement | null = null;
  
    function handleIntersection(entries: IntersectionObserverEntry[]) {
      if (entries[0].isIntersecting && hasMore) {
        dispatch('loadMore');
      }
    }
  
    onMount(() => {
      const observer = new IntersectionObserver(handleIntersection, {
        rootMargin: `${threshold}px`,
      });
  
      if (sentinel) {
        observer.observe(sentinel);
      }
  
      return () => {
        if (sentinel) {
          observer.unobserve(sentinel);
        }
      };
    });
  </script>
  
  <div bind:this={sentinel}></div>
  
  <style>
    div {
      height: 1px;
    }
  </style>