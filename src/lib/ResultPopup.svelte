<script lang="ts">
  import { ConfettiExplosion } from 'svelte-confetti-explosion';

  export let win: boolean = false;
</script>

<p>{win ? 'You won!' : 'You lost :('}</p>
