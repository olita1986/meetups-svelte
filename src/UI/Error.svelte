<script>
import Modal from './Modal.svelte';

export let message;
</script>

<Modal title="An error occured" on:close> 
    <p>{message}</p>
</Modal>