<script>
import { onMount } from 'svelte';
import Header from './UI/Header.svelte';
import MeetupGrid from './Meetups/MeetupGrid.svelte';
import EditMeetup from './Meetups/EditMeetup.svelte';
import MeetupDetail from './Meetups/MeetupDetail.svelte';
import Button from './UI/Button.svelte';
import meetupItems from './Meetups/meetups-store.js';
import Error from './UI/Error.svelte';

let editMode;
let page = 'overview';
let pageData = {};
let editedId;

let error;

onMount(() => {
    fetch('http://localhost:8080/meetups')
        .then(res => {
            if (!res.ok) {
                throw new Error('An error has ocurred');
            }
            return res.json()
        })
        .then(meetups => {
            meetupItems.setMeetups(meetups.reverse());
        })
        .catch(err => {
            error = err
            console.log(err)
        })
})

const addMeetup = () => {
    editMode = null;
    editedId = null;
}

const showDetails = (e) => {
    page = 'details';
    pageData.id = e.detail;
}

const closeDetails = () => {
    page = 'overview';
    pageData = {};
}

const editMeetup = (e) => {
    editedId = e.detail;
    editMode = 'edit';
}
</script>


<style>
    main {
        margin-top: 5rem;
    }

    .meetup-control {
        margin: 1rem;
    }
</style>

{#if error}
    <Error message={error.message} on:close={() => error = null}/>
{/if}

<Header/>

<main>
{#if page == 'overview'}
    <div class="meetup-control">
        <Button 
            on:click={() => editMode = 'edit'}
        >New Meetup</Button>
    </div>
    {#if editMode === 'edit'}
        <EditMeetup _id={editedId} on:addmeetup={addMeetup} on:close={() => {
            editMode = null;
            editedId = null;
            }}/>
    {/if}
    <MeetupGrid 
        meetups={$meetupItems} 
        on:showdetails={e => showDetails(e)}
        on:editmeetup={editMeetup}/>
{:else}
    <MeetupDetail _id={pageData.id} on:close={closeDetails}/>
{/if}
</main>







