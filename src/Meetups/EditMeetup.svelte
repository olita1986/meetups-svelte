<script>
import meetupsItem from './meetups-store.js';
import {createEventDispatcher} from 'svelte';
import Button from '../UI/Button.svelte';
import TextInput from '../UI/TextInput.svelte';
import Modal from '../UI/Modal.svelte';
import { isEmpty, validateEmail } from '../helpers/validations.js';

export let _id = null;

let title = '';
let subtitle = '';
let address = '';
let imageURL = '';
let description = '';
let contactEmail = '';
let isFavorite = false;

if (_id) {
    const unsubscribe = meetupsItem.subscribe(items => {
        const selectedMeetup = items.find(i => i._id === _id);
        title = selectedMeetup.title;
        subtitle = selectedMeetup.subtitle;
        address = selectedMeetup.address;
        imageURL = selectedMeetup.imageURL;
        description = selectedMeetup.description;
        contactEmail = selectedMeetup.contactEmail;
        isFavorite = selectedMeetup.isFavorite;
    })

    unsubscribe();
}

const dispatch = createEventDispatcher();

$: titleValid = !isEmpty(title);
$: subtitleValid = !isEmpty(subtitle);
$: addressValid = !isEmpty(address);
$: imageURLValid = !isEmpty(imageURL);
$: descriptionValid = !isEmpty(description);
$: contactEmailValid = !isEmpty(contactEmail) && validateEmail(contactEmail);
$: formIsValid = titleValid && subtitleValid && addressValid && imageURLValid 
    && descriptionValid && contactEmailValid

const submitForm = () => {
    const meetup = {
        title,
        subtitle,
        address,
        imageURL,
        description,
        contactEmail
    }
    if (_id) {
        fetch('http://localhost:8080/meetups', {
            method: 'PUT',
            body: JSON.stringify({...meetup, isFavorite, _id}),
            headers: {'Content-Type': 'application/json'}
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('an error occured')
            }
            return res.json()
        })
        .then(updatedMeetup => {
            meetupsItem.updateMeetup(_id, updatedMeetup);
            dispatch('addmeetup');
        })
        .catch(err => {
            console.log(err)
        })
    } else {
        fetch('http://localhost:8080/meetups', {
            method: 'POST',
            body: JSON.stringify({...meetup, isFavorite: false}),
            headers: {'Content-Type': 'application/json'}
        }).then( response => {
            if (!response.ok) {
                throw new Error('failed');
            }
            return response.json()
        }).then( meetupRes => {
            meetupsItem.addMeetup(meetup);
            dispatch('addmeetup');
        }).catch(error => {
            console.log(error)
        })
        
    }
}

const cancelEdit = () => {
    dispatch('close')
}

const deleteMeetup = () => {
    fetch('http://localhost:8080/meetups/' + _id, {
        method: 'DELETE'
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('something went wrong');
        }
        meetupsItem.deleteMeetup(_id);
        dispatch('addmeetup');
    })
    .catch(err => {
        console.log(err)
    })
}

</script>

<style>
form {
        max-width: 100%;
    }
</style>

<Modal title={_id ? "Edit Meetup" : "Add Meetup"} on:close>
    <form on:submit|preventDefault={submitForm}>
        <TextInput
            controlType="input"
            id="title"
            label="Title"
            value={title}
            valid={titleValid}
            validityMessage={'Please enter a valid title'}
            on:input={e => (title = e.target.value)}
        />
        <TextInput
            controlType="input"
            id="subtitle"
            label="Subtitle"
            value={subtitle}
            valid={subtitleValid}
            validityMessage={'Please enter a valid subtitle'}
            on:input={(e) => {subtitle = e.target.value}}
        />
        <TextInput
            controlType="input"
            id="address"
            label="Address"
            value={address}
            valid={addressValid}
            validityMessage={'Please enter a valid address'}
            on:input={(e) => {address = e.target.value}}
        />
        <TextInput
            controlType="input"
            id="imageURL"
            label="Image URL"
            value={imageURL}
            valid={imageURLValid}
            validityMessage={'Please enter a valid url'}
            on:input={(e) => {imageURL = e.target.value}}
        />
        <TextInput
            controlType="input"
            id="email"
            label="Contact Email"
            type="email"
            value={contactEmail}
            valid={contactEmailValid}
            validityMessage={'Please enter a valid email'}
            on:input={(e) => {contactEmail = e.target.value}}
        />
        <TextInput
            controlType="textarea"
            id="description"
            label="Description"
            bind:value={description}
            valid={descriptionValid}
            validityMessage={'Please enter a valid description'}
        />  
    </form>
    <div slot="footer">
        <Button type="submit" mode="outline" on:click={cancelEdit}>Cancel</Button>
        <Button type="submit" on:click={submitForm} disabled={!formIsValid}>Submit</Button> 
        {#if _id}
            <Button type="button" on:click={deleteMeetup}>Delete</Button>
        {/if}
    </div>
</Modal>
