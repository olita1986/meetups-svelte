<script>
import MeetupItem from './MeetupItem.svelte';
import MeetupFilter from './MeetupFilter.svelte';
import { scale } from 'svelte/transition';
import { flip } from 'svelte/animate';

export let meetups;

let showFavMeetups = false

$: filteredMeetups = showFavMeetups ? meetups.filter( m => m.isFavorite) : meetups;

const setFilter = (e) => {
  showFavMeetups = e.detail === 1;
}
</script>

<style>
section {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
}

@media (min-width: 768px) {
  section {
    grid-template-columns: repeat(2, 1fr);
  }
}

#meetups-control {
  margin: 1rem;
}
</style>

<section id="meetups-control">
  <MeetupFilter on:select={setFilter}/>
</section>
<section id="meetups">
    {#each filteredMeetups as meetup (meetup._id)}
      <div transition:scale animate:flip={{duration:300}}>
        <MeetupItem {...meetup} on:showdetails on:editmeetup/>
      </div>
    {/each}
</section>