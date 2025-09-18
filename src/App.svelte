<script lang="ts">
    import "./app.css";

    import FilePicker from "./components/FilePicker.svelte";
    import { sponsors } from "./appState.svelte";
    import TabBar from "./components/TabBar.svelte";
</script>

<main>
    <h1>GitHub Sponsor Explorer</h1>

    <section>
        <FilePicker />
    </section>

    {#if sponsors.value}
        <section>
            <TabBar />
        </section>
    {/if}
</main>

<style>
    h1 {
        text-align: center;
        margin-bottom: 1rem;
    }

    section {
        margin: 1rem 0;
    }
</style>
