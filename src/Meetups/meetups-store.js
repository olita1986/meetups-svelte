import { writable } from 'svelte/store';

const meetups = writable([])

const customMeetupsStore = {
    subscribe: meetups.subscribe,
    setMeetups: (meetupsItems) => {
        meetups.set(meetupsItems);
    },
    addMeetup: (meetup) => {
        let createdMeetup = {
            ...meetup
        }
        meetups.update(items => {
            return [createdMeetup, ...items]
        })
    },
    toggleFavorite: (itemId) => {
        meetups.update( items => {
            const selectedMeetup = {...items.find( m => m._id === itemId)};
            selectedMeetup.isFavorite = !selectedMeetup.isFavorite;
            const meetupIndex = items.findIndex( m => m._id === itemId);
            const updatedMeetups = [...items];
            updatedMeetups[meetupIndex] = selectedMeetup;
            return updatedMeetups;
        })
    },
    updateMeetup: (itemId, editedMeetup) => {
        meetups.update( items => {
            const meetupIndex = items.findIndex( m => m._id === itemId);
            const updatedMeetup = {...items[meetupIndex], ...editedMeetup};
            const updatedMeetups = [...items];
            updatedMeetups[meetupIndex] = updatedMeetup;
            return updatedMeetups;
        })
    },
    deleteMeetup: (itemId) => {
        meetups.update( items => {
            const updatedMeetups = items.filter( item => item._id !== itemId);
            return updatedMeetups;
        })
    }
}

export default customMeetupsStore;