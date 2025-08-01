<script lang="ts">
    import CountryRanking from "./CountryRanking.svelte";
    import SponsorTable from "./SponsorTable.svelte";

    const tabs = [
        { name: "Sponsor Table", component: SponsorTable },
        { name: "Country Ranking", component: CountryRanking },
        { name: "Statistics", component: null },
    ];
    let activeTab = $state(tabs[0].name);

    const ActiveComponent = $derived(
        tabs.find((tab) => tab.name === activeTab)?.component,
    );
</script>

<nav>
    {#each tabs as tab}
        <label class:current={tab.name === activeTab}>
            <input
                type="radio"
                name="tab"
                bind:group={activeTab}
                value={tab.name}
            />
            {tab.name}
        </label>
    {/each}
</nav>
{#if activeTab}
    <div>
        <ActiveComponent />
    </div>
{/if}

<style>
    nav {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(4, 1fr);
        margin-bottom: 1rem;
    }

    label {
        font-size: 1em;
        font-weight: 600;
        letter-spacing: 0.02em;

        padding: 1.25em 1.5rem;
        text-align: center;
        cursor: pointer;
        border-radius: 8px;
    }

    @media screen and (max-width: 600px) {
        label {
            padding: 0.5em 0.75em;
        }
    }

    @media screen and (max-width: 400px) {
        nav {
            grid-template-columns: repeat(2, 1fr);
        }
        label {
            padding: 1em 0.75em;
        }
    }

    label.current {
        background-color: var(--accent);
        color: var(--bg2);
    }

    input {
        display: none;
    }
</style>
